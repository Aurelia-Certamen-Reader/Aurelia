import { MongoClient } from 'mongodb'

const uri = process.env.DB_URI
const client = new MongoClient(uri);
const database = client.db("Testing");
const rounds = database.collection("Rounds");
const questions = database.collection("Questions");

/**
 * @typedef {Object} Query
 * @property {string} keywords
 * @property {string[]} difficulty - list of expected difficulties
 */

/**
 * @param {Query} query 
 * @returns 
 */
async function query(query) {
    let pipeline = []
    const roundInfo = (query.difficulty.length !== 0)
    const questionInfo = (query.keywords)
    let results;

    if (query.keywords) { // $search has to be the first pipeline stage
        pipeline.push({
            $search: {
                "text": {
                    "query": query.keywords,
                    "path": ["question", "answer", "boni.question", "boni.answer"],
                }
            }
        });
        // Add round info so it displays nicely
        pipeline.push({
            $lookup: {
                from: "Rounds",
                localField: "round",
                foreignField: "_id",
                as: "round"
            }
        });
        pipeline.push({ // Make it not in array form
            $set: { "round": { $arrayElemAt: ["$round", 0] } }
        });
        // Other filters here
        if (roundInfo) {
            const difficulties = query.difficulty.map(diff => ({ "round.division": diff }))
            pipeline.push({ $match: { $or: difficulties } });
        }
        results = questions.aggregate(pipeline);
        results = await results.toArray()
        return results;
    }

    // Round info
    if (roundInfo) {
        const difficulties = query.difficulty.map(diff => ({ "division": diff }))
        pipeline.push({ $match: { $or: difficulties } }); // TODO: don't do this if there isn't any difficulty selection lol
        pipeline.push({ // Find questions that match round properties
            $lookup: {
                from: "Questions",
                localField: "_id",
                foreignField: "round",
                as: "questions"
            }
        });
        // Format stuff nicely
        pipeline.push({ $unwind: "$questions" }); // We only care about the questions -> makes it a list of each question document
        pipeline.push({ // format Helpfully
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$questions",
                        {
                            "round": {
                                "$unsetField": {
                                    field: "questions",
                                    input: "$$ROOT"
                                }
                            }
                        }]
                }
            }
        });
        results = rounds.aggregate(pipeline);
        results = await results.toArray();
        return results;
    }

    // If there is non-keyword question info:
    /*
    Do the question info
    - If there was not round info, get the round info for each question
    */

    // No query -> random results:
    pipeline.push({ $sample: { size: 100 } });
    // Add round info so it displays nicely
    pipeline.push({
        $lookup: {
            from: "Rounds",
            localField: "round",
            foreignField: "_id",
            as: "round"
        }
    });
    pipeline.push({ // Make it not in array form
        $set: { "round": { $arrayElemAt: ["$round", 0] } }
    });
    results = questions.aggregate(pipeline);
    results = await results.toArray();
    return results;
}

/**
 * POST request handler to deal with database queries
 * @param {Request} req 
 * @returns {Response} {"questions": [questions matching query]}
 */
export async function POST(req) { // Handles the database query
    const formData = await req.formData();
    // parse form data
    const queryOptions = {
        "keywords": (formData.get("keywords") ? formData.get("keywords") : null), // the keywords if there are any; null if not
        "difficulty": formData.getAll("difficulty") // list of selected difficulty values
    }
    const questions = await query(queryOptions);
    return new Response(JSON.stringify(questions), { status: 200 })
}
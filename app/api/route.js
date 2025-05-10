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

    // ROUND INFO
    if (roundInfo) {
        const difficulties = query.difficulty.map(diff => ({ "division": diff }))
        pipeline.push({ $match: { $or: difficulties } }); // Find advanced rounds // TODO: don't do this if there isn't any difficulty selection lol
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
        let results = rounds.aggregate(pipeline); // TODO: fix if there is only question info
        results = await results.toArray();
        return results;
    }
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
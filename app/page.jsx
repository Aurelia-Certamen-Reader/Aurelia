export default function Page() {
  return <p>Hello world!</p>;
}

/**
 * @typedef {Object} Question
 * @property {string} _id
 * @property {number} number
 * @property {string} question - tossup text
 * @property {string} answer
 * @property {Bonus[]} boni
 * @property {Round} round
 */

/**
 * @typedef {Object} Round
 * @property {string} _id
 * @property {string} division (difficulty)
 * @property {number} number - numeric starting at 1, or -1 for final
 * @property {string} series
 * @property {number} year
 */

/**
 * @typedef {Object} Bonus
 * @property {string} question
 * @property {string} answer 
 */

/**
 * @param {Question} question 
 * @returns 
 */
export function QuestionCard(question) {
  return (
    <>
      <div>Round Info</div> {/*Header*/}
      <div> {/*All the question content*/}
        <p>TOSSUP {question.number}</p>
        <p>{}</p>
      </div>
      
    </>
  )
}
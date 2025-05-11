import styles from './styles.module.css'

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
export function QuestionCard({ question }) {
  const round = question.round;
  return (
    <li>
      <div>{`${round.series} ${round.division} ${round.year} | ${(round.number === -1 ? "FINAL ROUND" : "ROUND " + round.number)}`.toUpperCase()} </div> {/*Header*/}
      <div> {/*All the question content*/}
        <p>Tossup {question.number}</p>
        <p>{question.question}</p>
        <p>{question.answer}</p>
        <ul className={styles.question}> {/*Boni*/}
          {question.boni.map((bonus, index) => <Bonus bonus={bonus} num={index + 1} key={index} />)} {/*Should maybe have a key? idk*/}
        </ul>
      </div>
    </li>
  )
}

/**
 * 
 * @param {Bonus} param0 
 */
function Bonus({ bonus, num }) {
  return (
    <li>
      <hr></hr>
      <p>Bonus {num}</p>
      <p>{bonus.question}</p>
      <p>{bonus.answer}</p>
    </li>
  )
}
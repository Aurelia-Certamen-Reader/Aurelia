"use client"
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import { useState } from "react";

import '../globals.css'
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
  const [expanded, setExpanded] = useState(true);
  const round = question.round;
  return (
    <li className='w-7/12 mx-10 my-5'>
      <Card>
        <div className='bg-gray-300 p-2 shadow-sm font-bold' onClick={() => setExpanded(!expanded)}>{`${round.series} ${round.division} ${round.year} | ${(round.number === -1 ? "FINAL ROUND" : "ROUND " + round.number)}`.toUpperCase()} </div> {/*Header*/}
        <Collapse in={expanded}>
          <div className='p-2'> {/*All the question content*/}
            <p className='font-bold'>Tossup {question.number}</p>
            <p>{question.question}</p>
            <p className='text-right font-bold'>{question.answer}</p> {/*Is there a way I can make this match nicely with the other answer? Maybe some kind of class*/}
            <ul> {/*Boni*/}
              {question.boni.map((bonus, index) => <Bonus bonus={bonus} num={index + 1} key={index} />)} {/*Should maybe have a key? idk*/}
            </ul>
          </div>
        </Collapse>
      </Card>
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
      <hr className='my-2'></hr>
      <p className='font-bold'>Bonus {num}</p>
      <p>{bonus.question}</p>
      <p className='text-right font-bold'>{bonus.answer}</p>
    </li>
  )
}
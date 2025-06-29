"use client"

import { useEffect, useState } from "react";

import '../globals.css'
import { Button, TextField } from '@mui/material';

import { QuestionCard } from "./QuestionCard";
/**
 * Possible game states:
 * - "initial" - not started
 * - "displaying" - actively adding text, or waiting for the question to time out
 * - "buzzed" - someone buzzed in, is answering
 * - "answered" - someone answered or the question timed out; show the correct answer
 * - "paused"
 */

var game = {
  state: "initial",
  questionPart: -1, // -1 for tossup, otherwise index of current bonus
  currentQuestion: null,
  // buzzed: false, // whether someone has buzzed in
  wordIndex: 0,
  questions: [], // list of questions to be read
  currentFetch: null, // current promise for fetching questions
  // timeLeft: 0, // time left before the question times out; only matters if the end of the question has been reached
  // finishedDisplaying: false, // has the end of the current question been reached?
  currentDisplayLoop: 1, // tracks the id of the current display loop to make sure only one runs at a time
};

var updateReactGameState;
var displayWord;
var clearDisplay;
var addToLog;
var revealAnswer;

function updateGameState(newState) { // sets the game state and syncs with the react gameState; must use this function to update state
  game.state = newState;
  updateReactGameState(newState);
}

/** Starts and stops the game */
async function handleButton1Click() {
  if (game.state === "initial") { // "Start"
    updateGameState("displaying");
    if (game.questions.length == 0) {
      await loadMoreQuestions();
    }
    game.currentQuestion = game.questions.shift();
    displayQuestion();
  } else if (game.state === "paused") { // "Resume"
    updateGameState("displaying");
    displayQuestion();
  } else if (game.state === "displaying") { // "Pause"
    updateGameState("paused");
    interrupt()
  }
}

/** Advances to the next question */
async function handleButton2Click() {
  if (game.state == "displaying") { // "Skip"
    interrupt()
  } else if (game.state == "answered") { // "Next"
    updateGameState("displaying");
  }
  // Move to the next question
  await changeQuestion();
  clearDisplay();
  displayQuestion();
}

function handleBuzz() {
  updateGameState("buzzed");
  interrupt()
}

function submitAnswer() {
  updateGameState("answered");
  const currentQuestionPartial = (game.questionPart == -1 ? game.currentQuestion : game.currentQuestion.boni[game.questionPart]);
  revealAnswer(currentQuestionPartial.answer, currentQuestionPartial.question)
}

/** Stops the display of the current question */
function interrupt() {
  game.currentDisplayLoop++ // any running display loops will be out of date and stop
}

/** Used by next/skip to advance through questions / question parts */
async function changeQuestion() {
  if (game.questionPart == -1) { // Log a tossup
    const question = { ...game.currentQuestion }; // Make a shallow copy to pass to the log function
    question.boni = []; // Hide the boni
    addToLog(question, true);
  } else {
    addToLog(game.currentQuestion.boni[game.questionPart], false);
  }
  game.questionPart++;
  game.wordIndex = 0;

  if (game.questionPart >= game.currentQuestion.boni.length) { // If we're on the last part of the question, get a new question
    if (game.questions.length == 0) {
      await loadMoreQuestions();
    }
    game.currentQuestion = game.questions.shift();
    game.questionPart = -1;
    // TODO: refill questions when bank is low
    return;
  }
}

async function displayQuestion() {
  const questionText = (game.questionPart == -1 ? game.currentQuestion.question : game.currentQuestion.boni[game.questionPart].question);
  const questionWords = questionText.split(" ");

  const thisLoopId = game.currentDisplayLoop

  while (game.wordIndex < questionWords.length) {
    if (thisLoopId != game.currentDisplayLoop) {
      return
    }
    displayWord(questionWords[game.wordIndex]);
    game.wordIndex++
    await sleep(250);
  }
}

function loadMoreQuestions() {
  if (game.currentFetch) { // prevent having multiple fetches run at once
    return game.currentFetch;
  }
  game.currentFetch = (async () => {
    const response = await fetch('/api', {
      method: 'POST',
      body: new FormData(),
    });
    const loadedQuestions = await response.json();
    game.questions.push(...loadedQuestions);
    game.currentFetch = null; // clear the promise once it's been fulfilled
  })();
  return game.currentFetch;
}

export default function Page() {
  const [questionText, setQuestionText] = useState(""); // used for the text being displayed
  const [oldQuestions, setOldQuestions] = useState([]); // used for question log
  const [gameState, setGameState] = useState(game.state); // synced to game.state
  const [playerAnswer, setPlayerAnswer] = useState("");
  const [answer, setAnswer] = useState("");

  // Callbacks
  updateReactGameState = setGameState; // function used by game logic to update the react state
  displayWord = (word) => { setQuestionText(text => text + word + " ") }; // Use updater function so clearing works correctly (https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)
  addToLog = (question, isTossup) => {
    if (isTossup) {
      setOldQuestions([question, ...oldQuestions])
    } else {
      oldQuestions[0].boni.push(question);
      setOldQuestions(oldQuestions)
    }
  }
  clearDisplay = () => { setQuestionText(""); };
  revealAnswer = (answerLine, fullQuestionText) => {
    setAnswer(answerLine)
    setQuestionText(fullQuestionText)
  }

  useEffect(() => { loadMoreQuestions() }, []); // on start, load a bank of questions

  return (
    <>
      <div className="flex gap-2 items-center">
        {/*Button 1*/}
        <Button variant='contained' disabled={(gameState == "buzzed") || (gameState == "answered")} onClick={handleButton1Click}>{
          gameState == "initial" ? "Start" :
            gameState == "paused" ? "Resume" :
              "Pause"}</Button>

        {/*Button 2*/}
        <Button variant='contained' disabled={!(gameState == "answered" || gameState == "displaying")} onClick={handleButton2Click}>{
          gameState == "answered" ? "Next" :
            "Skip"}</Button>

        {/*Button 3*/}
        <Button variant='contained' disabled={gameState != "displaying"} onClick={handleBuzz}>Buzz</Button>

        {/* Answer Submission */}
        <span hidden={!(gameState == "buzzed")}>
          <label onChange={e => { setPlayerAnswer(e.target.value) }}>Answer: <input /></label>
          <Button variant="contained" onClick={submitAnswer}>Submit</Button>
        </span> {/* TODO: submit answer on enter being pressed; autofocus when unhidden */}
        <span hidden={!(gameState == "answered")}>{playerAnswer}</span>
      </div>
      <div>{questionText}</div>
      <div hidden={!(gameState == "answered")}>{answer}</div>
      <ul className="list-none">
        {oldQuestions.map(q => <QuestionCard question={q} key={q._id} />)}
      </ul>
    </>
  );
}

// Sleep for time in ms
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
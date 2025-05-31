"use client"

import { useState } from "react";

import '../globals.css'
import { Button, TextField } from '@mui/material';
import Script from "next/script";

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
  buzzed: false, // whether someone has buzzed in
  wordIndex: 0,
  questions: [], // list of questions to be read
  timeLeft: 0, // time left before the question times out; only matters if the end of the question has been reached
};

var updateReactGameState;

function updateGameState(newState) { // sets the game state and syncs with the react gameState; must use this function to update state
  game.state = newState;
  updateReactGameState(newState)
}

function handleButton1Click() {
  if (game.state === "initial") { // "Start"
    updateGameState("displaying");
  } else if (game.state === "paused") { // "Resume"
    updateGameState("displaying");
  } else if (game.state === "displaying") { // "Pause"
    updateGameState("paused");
  }
  // console.log("Button 1 clicked, game state is now:", game.state);
}

function handleButton2Click() {
  updateGameState("displaying");
}

function handleBuzz() {
  updateGameState("buzzed");
}

function submitAnswer() {
  updateGameState("answered");
}

export default function Page() {
  const [questionText, setQuestionText] = useState(""); // used for the text being displayed
  const [oldQuestions, setOldQuestions] = useState([]); // used for question log
  const [gameState, setGameState] = useState(game.state); // synced to game.state
  updateReactGameState = setGameState; // function used by game logic to update the react state

  return (
    <>
      <Button variant='contained' disabled={(gameState == "buzzed") || (gameState == "answered")} onClick={handleButton1Click}>{
        gameState == "initial" ? "Start" :
          gameState == "paused" ? "Resume" :
            "Pause"}</Button> {/*Button 1*/}
      <Button variant='contained' disabled={!(gameState == "answered" || gameState == "displaying")} onClick={handleButton2Click}>{
        gameState == "answered" ? "Next" :
          "Skip"}</Button> {/*Button 2*/}
      <Button variant='contained' disabled={gameState != "displaying"} onClick={handleBuzz}>Buzz</Button> {/*Button 3*/}
      <span hidden={!(gameState == "buzzed")}> <label>Answer: <input /></label> <Button variant="contained" onClick={submitAnswer}>Submit</Button> </span> {/* TODO: submit answer on enter being pressed; autofocus when unhidden */}
      <br />
      <div>{questionText}</div>
      <ul className="list-none">
        {oldQuestions.map(q => <QuestionCard question={q} key={q._id} />)}
      </ul>
    </>
  );
}
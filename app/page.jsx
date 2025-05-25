"use client"

import { useState } from "react";

import '../globals.css'
import { Button, TextField } from '@mui/material';
export default function Page() {
  let questions; // list of questions to be read
  const [questionText, setQuestionText] = useState("");
  const [oldQuestions, setOldQuestions] = useState([]);
  return (
    <>
      <Button variant='contained'>Start/Pause/Resume/etc</Button>
      <Button variant='contained'> Next/Skip </Button>
      <label>Answer: <input /></label>
      <br />
      <div>{questionText}</div>
      <ul className="list-none">
        {oldQuestions.map(q => <QuestionCard question={q} key={q._id} />)}
      </ul>
    </>
  );
}

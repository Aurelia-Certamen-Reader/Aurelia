"use client"
import { useState } from "react";

import { QuestionCard } from "../QuestionCard";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import '../../globals.css';

export default function DatabasePage() {
    const [questions, setQuestions] = useState([])
    // status: 'idle' (no search yet), 'loading', 'loaded', 'error'
    const [status, setStatus] = useState('idle')
    const [error, setError] = useState(null)
    return (<>
        <p>Hello DatabasePage</p>
        <DatabaseSearch onSubmit={handleSearch} disabled={status === 'loading'} />
        {status === 'error' && <p className="text-red-600">{error}</p>}
        {status === 'loading' && <p>Loading...</p>}
        {status === 'loaded' && (
            (questions.length === 0) ?
                <p>No questions found</p> :
                <>
                    <p>{questions.length} results</p>
                    <ul className="list-none">
                        {questions.map(q => <QuestionCard question={q} key={q._id} />)}
                    </ul>
                </>
        )}
    </>);

    async function handleSearch(e) {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);
        setStatus('loading')
        setError(null)
        setQuestions([])
        try {
            const response = await fetch('/api', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                let text
                try { text = await response.text() } catch { text = response.statusText }
                throw new Error(text || `Request failed (${response.status})`)
            }
            const questions = await response.json();
            setQuestions(questions);
            setStatus('loaded')
        } catch (err) {
            setError(err.message || 'Unknown error') // TODO: better error handling (probably needs to happen in the route)
            setStatus('error')
            console.error(err)
        }
    }
}

function DatabaseSearch({ onSubmit, disabled }) {
    return (<form onSubmit={onSubmit}>
            <TextField id="keywords" label="Keywords" variant="outlined" name="keywords" /> <br />
            <label><input type="checkbox" name="difficulty" value="novice" />Novice</label><br />
            <label><input type="checkbox" name="difficulty" value="intermediate" />Intermediate</label><br />
            <label><input type="checkbox" name="difficulty" value="advanced" />Advanced</label><br />
            <label><input type="checkbox" name="difficulty" value="elite" />Elite</label><br />
            <Button type="submit" variant="contained" disabled={disabled}>Search</Button>
        </form>)
    }


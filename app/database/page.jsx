"use client"

import { QuestionCard } from "../page";

export default function DatabasePage() {
    return (<>
        <p>Hello DatabasePage</p>
        <DatabaseSearch />
    </>);
}

function DatabaseSearch() {
    return (<form onSubmit={handleSearch}>
        <input type="text" name="keywords" /> <br />
        <label><input type="checkbox" name="difficulty" value="novice" />Novice</label><br />
        <label><input type="checkbox" name="difficulty" value="intermediate" />Intermediate</label><br />
        <label><input type="checkbox" name="difficulty" value="advanced" />Advanced</label><br />
        <label><input type="checkbox" name="difficulty" value="elite" />Elite</label><br />
        <button type="submit">Search</button>
    </form>)
}

async function handleSearch(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    console.log("handling form");
    const response = await fetch('/api', {
        method: 'POST',
        body: formData,
    });
    if (response.ok) {
        const questions = await response.json();
        console.log(questions);
    } else {
        console.log(":(")
    }
}
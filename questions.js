const questionForm = document.getElementById("question-form");
const questionsList = document.getElementById("questions-list");

// Load saved questions
let savedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");

// Display existing questions
savedQuestions.forEach(q => addQuestionToList(q));

questionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("question-name").value.trim();
    const text = document.getElementById("question-text").value.trim();

    if (!name || !text) {
        alert("Please fill in both fields!");
        return;
    }

    const question = { name, text, time: new Date().toISOString() };
    savedQuestions.push(question);
    localStorage.setItem("questions", JSON.stringify(savedQuestions));

    addQuestionToList(question);
    questionForm.reset();
    alert("Your question has been submitted!");
});

function addQuestionToList(q) {
    const li = document.createElement("li");
    li.textContent = `${q.name} asked: ${q.text}`;
    questionsList.appendChild(li);
}

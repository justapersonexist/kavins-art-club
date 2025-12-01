// ------------------- Generate Calendar -------------------
document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const appointmentForm = document.getElementById("appointment-form");
    const selectedDateDisplay = document.getElementById("selected-date");
    const appointmentsList = document.getElementById("appointments-list");
    const saveBtn = document.getElementById("save-btn");

    let selectedDate = null;

    // Create a simple calendar of days (1 to 31)
    for (let day = 1; day <= 31; day++) {
        const dayBox = document.createElement("div");
        dayBox.textContent = day;
        dayBox.addEventListener("click", () => {
            selectedDate = day;
            selectedDateDisplay.textContent = "Selected Date: " + day;
            appointmentForm.classList.remove("hidden");
        });

        calendar.appendChild(dayBox);
    }

    // ------------------- Save Appointment -------------------
    saveBtn.addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const reason = document.getElementById("reason").value;

        if (!name || !reason) {
            alert("Please fill in all fields");
            return;
        }

        // Save to localStorage
        const appointment = { date: selectedDate, name, reason };

        let saved = JSON.parse(localStorage.getItem("appointments")) || [];
        saved.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(saved));

        alert("Appointment saved!");
        displayAppointments();
    });

    // ------------------- Display Appointments -------------------
    function displayAppointments() {
        appointmentsList.innerHTML = "";
        const saved = JSON.parse(localStorage.getItem("appointments")) || [];

        saved.forEach(app => {
            const li = document.createElement("li");
            li.textContent = `${app.date}: ${app.name} — ${app.reason}`;
            appointmentsList.appendChild(li);
        });
    }

    displayAppointments();
});

const chatBtn = document.getElementById("chatbot-button");
const chatWindow = document.getElementById("chatbot-window");
const closeChat = document.getElementById("chatbot-close");

chatBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
});

closeChat.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
});

const questionForm = document.getElementById("question-form");
const questionsList = document.getElementById("questions-list");

// Load saved questions
let savedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");

// Display existing questions
savedQuestions.forEach(q => addQuestionToList(q));

questionForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

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

    questionForm.reset(); // Clear inputs
    alert("Question has either been sent to Kavin or Savanth");
});

// Function to add a question to the list
function addQuestionToList(q) {
    const li = document.createElement("li");
    li.textContent = `${q.name} asked: ${q.text}`;
    questionsList.appendChild(li);
}

// server.js
const express = require("express");
const httpModule = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

// ---------------- CONFIG ----------------
let PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, "data/users.json");
const QUESTIONS_FILE = path.join(__dirname, "data/questions.json");

function startServer(port) {
    const app = express();
    const http = httpModule.createServer(app);
    const io = new Server(http);

    // ---------------- MIDDLEWARE ----------------
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "public")));

    // ---------------- STATIC ROUTES ----------------
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });

    // ---------------- SOCKET.IO ----------------
    io.on("connection", (socket) => {
        console.log("User connected");

        socket.on("drawing", (data) => {
            socket.broadcast.emit("drawing", data);
        });

        socket.on("clearCanvas", () => {
            io.emit("clearCanvas");
        });
    });

    // ---------------- API: USERS ----------------
    app.get("/api/users", (req, res) => {
        fs.readFile(USERS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading users file");
            res.json(JSON.parse(data || "[]"));
        });
    });

    app.post("/api/users", (req, res) => {
        const newUser = req.body;
        fs.readFile(USERS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading users file");
            let users = JSON.parse(data || "[]");
            const idx = users.findIndex(u => u.username === newUser.username);
            if (idx !== -1) users[idx] = newUser; // update existing
            else users.push(newUser); // add new
            fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), () => res.json({ success: true }));
        });
    });

    app.delete("/api/users/:username", (req, res) => {
        fs.readFile(USERS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading users file");
            let users = JSON.parse(data || "[]");
            users = users.filter(u => u.username !== req.params.username);
            fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), () => res.json({ success: true }));
        });
    });

    // ---------------- API: QUESTIONS ----------------
    app.get("/api/questions", (req, res) => {
        fs.readFile(QUESTIONS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading questions file");
            res.json(JSON.parse(data || "[]"));
        });
    });

    app.post("/api/questions", (req, res) => {
        const question = req.body;
        fs.readFile(QUESTIONS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading questions file");
            let questions = JSON.parse(data || "[]");
            questions.push(question);
            fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2), () => res.json({ success: true }));
        });
    });

    app.delete("/api/questions/:index", (req, res) => {
        fs.readFile(QUESTIONS_FILE, "utf8", (err, data) => {
            if (err) return res.status(500).send("Error reading questions file");
            let questions = JSON.parse(data || "[]");
            questions.splice(req.params.index, 1);
            fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2), () => res.json({ success: true }));
        });
    });

    // ---------------- START SERVER ----------------
    http.listen(port)
        .on("listening", () => console.log(`🎉 Server running at http://localhost:${port}`))
        .on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.log(`⚠️ Port ${port} in use, trying ${port + 1}...`);
                PORT++;
                startServer(PORT);
            } else {
                console.error(err);
            }
        });
}

// ---------------- INIT ----------------
startServer(PORT);

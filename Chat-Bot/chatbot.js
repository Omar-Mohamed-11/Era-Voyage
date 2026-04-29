// OMarAdell
// This page will be the brain of my chatbot 


// Private API key --> OMar-Adell
const API_KEY = "AIzaSyCGyPQZWD0rVz0E3Bl5LluqDKWgKAl9PQw";


const chatBot = document.getElementById("chatBot");
let conversation = [];

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.innerText = text;
    chatBot.appendChild(msg);
    chatBot.scrollTop = chatBot.scrollHeight;
}

function removeTyping() {
    document.querySelectorAll(".ai").forEach(el => {
        if (el.innerText === "Typing...") el.remove();
    });
}


async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    addMessage("Typing...", "ai");

    const reply = await AskMora(text);

    removeTyping();
    addMessage(reply, "ai");
}

async function AskMora(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

    conversation.push({
        role: "user",
        parts: [{ text: prompt }]
    });

    const body = {
        contents: conversation
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            return data?.error?.message || "APIs Error";
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        conversation.push({
            role: "model",
            parts: [{ text: reply }]
        });

        return reply;

    } catch (error) {
        console.error(error);
        return "Connection Faild!";
    }
}
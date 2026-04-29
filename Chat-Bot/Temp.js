const API_KEY = "AIzaSyCGyPQZWD0rVz0E3Bl5LluqDKWgKAl9PQw";


const chatBotInput = document.getElementById("chatbot-input");
const chatBotMessages = document.getElementById("chatbot-messages");

let conversation = [];

document.addEventListener("DOMContentLoaded", function () {

  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotIcon = document.getElementById("chatbot-icon");

  chatBotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatBotIcon.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    chatBotIcon.style.display = "flex";
  });

  sendBtn.addEventListener("click", sendMessage);

  chatBotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

});

function addMessage(text, type)
{
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.innerText = text;
  chatBotMessages.appendChild(messageElement);
  chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
}

// function createTypingBubble() {
//   const typing = document.createElement("div");
//   typing.classList.add("message", "bot", "typing");

//   typing.innerHTML = `
//     <span></span>
//     <span></span>
//     <span></span>
//   `;

//   chatBotMessages.appendChild(typing);
//   chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
//   return typing;
// }

// let typingElement = null;

// function showTyping() {
//   typingElement = createTypingBubble();
// }

// function removeTyping() {
//   if (typingElement) {
//     typingElement.remove();
//     typingElement = null;
//   }
// }

async function sendMessage() {
  const text = chatBotInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatBotInput.value = "";

//   showTyping();
  const reply = await AskMora(text);

//   removeTyping();
  addMessage(reply, "bot");
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
      return data?.error?.message || "API Error";
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
    return "Connection Failed!";
  }
}
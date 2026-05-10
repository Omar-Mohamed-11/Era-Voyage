// API key initialization
const API_KEY = "AIzaSyCGyPQZWD0rVz0E3Bl5LluqDKWgKAl9PQw";


// Get elements from HTML page using their IDs
const chatBotInput = document.getElementById("chatbot-input");
const chatBotMessages = document.getElementById("chatbot-messages");

// Conversation Array: stores all messages between user and bot
let conversation = [];


// Chat Bot UI
// This event runs after the whole page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Chat-bot elements
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatBotIcon = document.getElementById("chatbot-icon");

    // Disable send button until the user writes something
    sendBtn.disabled = true;

    // When the user clicks the icon -> open the chatbot
    chatBotIcon.addEventListener("click", function () {
        chatbotContainer.classList.add("active");
        chatBotIcon.classList.add("hide");
    });

    // Initial welcome message displayed at the top of the chat
    addMessage("Hello, Do you have anything to ask about ?", "bot");

    // Close button to hide the chatbot
    closeBtn.addEventListener("click", function () {
        chatbotContainer.classList.remove("active");
        chatBotIcon.classList.remove("hide");
    });

    // When the send button is clicked -> call sendMessage function
    sendBtn.addEventListener("click", sendMessage);

    // User can send the prompt by pressing Enter
    chatBotInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    // Enable or disable send button depending on input value
    chatBotInput.addEventListener("input", function () {
        if (chatBotInput.value.trim() === "") {
            sendBtn.disabled = true;
        }
        else {
            sendBtn.disabled = false;
        }
    });

});




// Chat Bot Actions

// [1] Show typing bubbles while the bot is generating a response
let typingElement = null;
function showTyping() {
    typingElement = createTypingBubble();
}

// [2] Remove typing bubbles after the response is ready
function removeTyping() {
    if (typingElement) {
        typingElement.remove();
        typingElement = null;
    }
}

// Function to create typing bubbles animation
function createTypingBubble() {
    const typing = document.createElement("div");
    typing.classList.add("message", "bot", "typing");

    typing.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
    `;

    chatBotMessages.appendChild(typing);

    // Auto-scroll to the latest message
    chatBotMessages.scrollTop = chatBotMessages.scrollHeight;

    return typing;
}


// [3] Add message to the screen (from user or bot)
function addMessage(text, type) {
    const messageElement = document.createElement("div");

    // Add CSS classes for styling
    messageElement.classList.add("message", type);

    // Insert message text
    messageElement.innerText = text;

    // Add message to chat container
    chatBotMessages.appendChild(messageElement);

    // Auto-scroll to latest message
    chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
}


// Main workflow of the chatbot
// This function controls all chatbot actions
async function sendMessage() {

    // Get user input and remove extra spaces
    const text = chatBotInput.value.trim();

    // If input is empty -> stop function
    if (!text) return;

    // Display user message
    addMessage(text, "user");

    // Clear input field
    chatBotInput.value = "";

    // Show typing animation
    showTyping();

    // Wait for AI response from API
    const reply = await AskMora(text);

    // Remove typing animation
    removeTyping();

    // Display AI response
    addMessage(reply, "bot");
}







// Chat-bot asynchronous function
// This function connects with the AI API
async function AskMora(prompt) {

    // API endpoint URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;


    // Save user prompt into conversation array
    conversation.push({
        role: "user", // Message sender role
        parts: [{ text: prompt }]
    });


    // Prepare request body
    // Send the entire conversation history, not only one message
    const body = {
        contents: conversation
    };


    try {

        // fetch() sends HTTP request to the API
        const res = await fetch(url, {
            method: "POST",

            // Request headers
            headers: {
                "Content-Type": "application/json"
            },

            // Convert JavaScript object into JSON string
            body: JSON.stringify(body)
        });

        // Convert API response into JavaScript object
        const data = await res.json();

        // Print response inside browser console for debugging
        console.log(data);

        // Handle API or server errors
        if (!res.ok) {
            return data?.error?.message || "API Error";
        }

        // Extract AI response text from returned JSON data
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        // Save AI response into conversation array
        conversation.push({
            role: "model",
            parts: [{ text: reply }]
        });

        // Return AI response
        return reply;

    } catch (error) {

        // Print connection errors in console
        console.error(error);

        return "Connection Failed!";
    }
}
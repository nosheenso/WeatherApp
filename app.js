// Load the environment variables from the .env file (you'll need a library like `dotenv`)
require('dotenv').config();
function myFunction() {
  var x = document.getElementById("demo");
  if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
  } else { 
      x.className = x.className.replace(" w3-show", "");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Function to send initial message from the chatbot
  const sendInitialMessage = async () => {
    const initialMessage = "What to pack for the weather of the city you are going to that has";
    
    // Retrieve the saved variables from localStorage
    const savedDescription = localStorage.getItem('savedDescription');
    const savedTempC = localStorage.getItem('savedTempC');
    const savedTempF = localStorage.getItem('savedTempF');

    // Create the concatenated message
    const finalMessage = `${initialMessage} ${savedDescription} and the temperature ${savedTempC} °C (${savedTempF} °F)  is the following`;

    // Ask ChatGPT the final message as a question
    const apiKey = process.env.APIKEY;

    // Now you can use apiKey in your code
    console.log(apiKey);

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: finalMessage,
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const chatbotResponse = response.data.choices[0].text;

    // Send the initial message and ChatGPT's response to the chat
    messages.innerHTML += `<div class="message bot-message">
      <img src="./icons/chatbot.png" alt="bot icon"> <span>${finalMessage}</span>
    </div>`;
    messages.innerHTML += `<div class="message bot-message">
      <img src="./icons/chatbot.png" alt="bot icon"> <span>${chatbotResponse}</span>
    </div>`;
  };

  // Call the function to send the initial message and ask ChatGPT
  sendInitialMessage();

  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value;
    input.value = "";

    messages.innerHTML += `<div class="message user-message">
      <img src="./icons/user.png" alt="user icon"> <span>${message}</span>
    </div>`;

    // Use axios library to make a POST request to the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: message,
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const chatbotResponse = response.data.choices[0].text;

    messages.innerHTML += `<div class="message bot-message">
      <img src="./icons/chatbot.png" alt="bot icon"> <span>${chatbotResponse}</span>
    </div>`;
  });
});

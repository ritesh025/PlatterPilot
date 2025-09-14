// Smooth scroll for navbar and buttons
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Hero Parallax Animation
const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
  hero.style.backgroundPositionY = window.scrollY * 0.2 + "px";
});

// Menu Slider
const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".menu-card");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let index = 0;

function showSlides() {
  const slideWidth = slides[0].clientWidth + 20;
  track.style.transform = `translateX(${-slideWidth * index}px)`;
}

nextBtn.addEventListener("click", () => {
  if (index < slides.length - 3) {
    index++;
  } else {
    index = 0;
  }
  showSlides();
});

prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
  } else {
    index = slides.length - 3;
  }
  showSlides();
});

setInterval(() => {
  nextBtn.click();
}, 3000);

// Reservation Form Submission
document
  .querySelector(".reservation-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you! Your reservation request has been received.");
    this.reset();
  });

// Contact Form Submission
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Your message has been sent! We'll get back to you soon.");
    this.reset();
  });

// Chatbot Functionality
const chatbotIcon = document.getElementById("chatbot-icon");
const chatboxContainer = document.getElementById("chatbox-container");
const closeChatBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatArea = document.getElementById("chat-area");

// Toggle Chatbox visibility
chatbotIcon.addEventListener("click", () => {
  chatboxContainer.style.display = "flex";
});

// Close Chatbox
closeChatBtn.addEventListener("click", () => {
  chatboxContainer.style.display = "none";
});

// Send User Input
sendBtn.addEventListener("click", async () => {
  const query = userInput.value.trim();
  if (!query) return;

  addMessage("You", query);
  userInput.value = "";

  const response = await getFoodRecommendation(query);

  addMessage("Food Assistant", response);
});

// Add message to chat area
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<b>${sender}:</b> ${text}`;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Get food recommendation from Cohere API
async function getFoodRecommendation(query) {
  const defaultMessage = "Sorry, I couldn't fetch a recommendation right now.";
  const prompt = `
You are a friendly and knowledgeable AI vegetarian food assistant for PlatterPilot. Your job is to help users discover the perfect dish based on their preferences, mood, or dietary needs. You also promote the vegetarian restaurant’s signature dishes and seasonal specials as “must-try” recommendations. 

The restaurant’s menu includes: Pizza Paradise, Pasta Primavera, Vegan Salad, Burger Fries, Cheese Sandwich, Veg Manchurian, Spring Rolls, Paneer Tikka, Hot n Sour Soup, Mexican Rice, Brownies, Choco Lava Cake, Rasmalai.

When a user interacts with you:
- To the point answering the user input, do not make it to much lengthy complete in maximum 50 words for user to read. 
- Ask engaging questions to understand their taste (e.g., “Are you in the mood for something spicy or comforting today?”).
- Use their input to suggest 3–4 dishes from the menu that match their preferences.
- Always include dish from the restaurant’s featured menu, with a tempting description of its flavors, ingredients, and presentation.
- Always end with a friendly nudge like “Would you like to place an order or hear more suggestions?”

Here is the user's query: "${query}"
`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer COHERE_API_KEY`, // Replace with your actual API key
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error("API error:", await response.text());
      return defaultMessage;
    }

    const data = await response.json();

    if (data.generations && data.generations.length > 0) {
      return data.generations[0].text.trim();
    } else {
      console.error("Invalid response format:", data);
      return defaultMessage;
    }
  } catch (error) {
    console.error("Error fetching from Cohere:", error);
    return defaultMessage;
  }
}

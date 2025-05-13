const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const scoreElement = document.getElementById("score");
const summaryScreen = document.getElementById("summary-screen");
const finalScoreElement = document.getElementById("final-score");
const summaryListElement = document.getElementById("summary-list");

let currentQuestion = null;
let score = 0;
let questionsList = [];
let summaryList = [];

// Fetch the JSON data
fetch("./countries.json")
  .then((response) => response.json())
  .then((data) => {
    questionsList = shuffleArray(data);
    loadNewQuestion();
  })
  .catch((error) => console.error("Error loading JSON:", error));

const loadNewQuestion = () => {
  optionsContainer.innerHTML = "";
  nextButton.disabled = true;

  if (questionsList.length === 0) {
    showSummary();
    return;
  }

  currentQuestion = questionsList.pop();
  questionElement.innerText = `What is the capital of ${currentQuestion.country}?`;

  const correctAnswer = currentQuestion.capital;
  const allCapitals = questionsList.map((item) => item.capital);
  const filteredCapitals = allCapitals.filter((cap) => cap !== correctAnswer);
  const randomOptions = shuffleArray(filteredCapitals).slice(0, 2);

  const finalOptions = shuffleArray([correctAnswer, ...randomOptions]);

  finalOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.innerText = option;
    optionElement.addEventListener("click", () =>
      handleAnswer(optionElement, correctAnswer)
    );
    optionsContainer.appendChild(optionElement);
  });
};

const handleAnswer = (element, correctAnswer) => {
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((option) => option.classList.add("disabled"));

  if (element.innerText === correctAnswer) {
    element.classList.add("correct");
    updateScore();
    summaryList.push(`✔️ ${currentQuestion.country}: ${correctAnswer}`);
  } else {
    element.classList.add("wrong");
    allOptions.forEach((option) => {
      if (option.innerText === correctAnswer) {
        option.classList.add("correct");
      }
    });
    summaryList.push(
      `❌ ${currentQuestion.country}: Correct Answer is ${correctAnswer}`
    );
  }

  nextButton.disabled = false;
};

const updateScore = () => {
  score += 1;
  scoreElement.textContent = score;
};

const showSummary = () => {
  finalScoreElement.innerText = `You scored ${score} out of ${summaryList.length}!`;
  summaryListElement.innerHTML = summaryList
    .map((item) => `<li>${item}</li>`)
    .join("");
  summaryScreen.style.display = "block";
  questionElement.style.display = "none";
  optionsContainer.style.display = "none";
  nextButton.style.display = "none";
};

nextButton.addEventListener("click", () => {
  loadNewQuestion();
  nextButton.disabled = true;
});

restartButton.addEventListener("click", () => {
  window.location.reload();
});

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const summaryScreen = document.getElementById("summary-screen");
const finalScoreElement = document.getElementById("final-score");
const summaryListElement = document.getElementById("summary-list");
const progressBar = document.getElementById("progress-bar");

let currentQuestion = null;
let score = 0;
let totalQuestions = 0;
let questionsList = [];
let summaryList = [];
const bestScore = localStorage.getItem("bestScore") || 0;
bestScoreElement.textContent = bestScore;

// Fetch the JSON data
fetch("./countries.json")
  .then((response) => response.json())
  .then((data) => {
    questionsList = shuffleArray(data);
    totalQuestions = questionsList.length;
    loadNewQuestion();
  })
  .catch((error) => console.error("Error loading JSON:", error));

const loadNewQuestion = () => {
  optionsContainer.innerHTML = "";
  nextButton.disabled = true;

  // Check if there are questions left
  if (questionsList.length === 0) {
    showSummary();
    return;
  }

  // Pick a question and remove it from the list
  currentQuestion = questionsList.pop();
  questionElement.innerText = `What is the capital of ${currentQuestion.country}?`;

  // Generate options
  const correctAnswer = currentQuestion.capital;
  const allCapitals = questionsList.map((item) => item.capital);
  const filteredCapitals = allCapitals.filter((cap) => cap !== correctAnswer);
  const randomOptions = shuffleArray(filteredCapitals).slice(0, 2);
  const finalOptions = shuffleArray([correctAnswer, ...randomOptions]);

  // Render options
  finalOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.innerText = option;
    optionElement.addEventListener("click", () =>
      handleAnswer(optionElement, correctAnswer)
    );
    optionsContainer.appendChild(optionElement);
  });

  // Update progress bar
  updateProgress();
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

const updateProgress = () => {
  const progress =
    ((totalQuestions - questionsList.length) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
};

const showSummary = () => {
  // Update final score
  finalScoreElement.innerText = `You scored ${score} out of ${totalQuestions}!`;

  // Show summary
  summaryListElement.innerHTML = summaryList
    .map((item) => `<li>${item}</li>`)
    .join("");
  summaryScreen.style.display = "block";
  questionElement.style.display = "none";
  optionsContainer.style.display = "none";
  nextButton.style.display = "none";

  // Update Best Score if this is higher
  if (score > bestScore) {
    localStorage.setItem("bestScore", score);
    bestScoreElement.textContent = score;
  }
};

// 🔥🔥 This is where it was breaking! Now it works perfectly:
nextButton.addEventListener("click", () => {
  loadNewQuestion();
  nextButton.disabled = true;
  questionElement.style.display = "block";
  optionsContainer.style.display = "grid";
});

// Restart Game Logic
restartButton.addEventListener("click", () => {
  summaryScreen.style.display = "none";
  questionElement.style.display = "block";
  optionsContainer.style.display = "grid";
  nextButton.style.display = "block";
  score = 0;
  scoreElement.textContent = score;
  questionsList = shuffleArray([...summaryList]); // Reload the questions
  summaryList = [];
  loadNewQuestion();
});

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

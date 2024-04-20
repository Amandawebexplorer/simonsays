/**
 * DOM SELECTORS
 */

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * CONSTANTS
 */

const LEVELS = {
  1: 8,
  2: 14,
  3: 20,
  4: 31,
};

const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-1.mp3?raw=true"
    ),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-2.mp3?raw=true"
    ),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-3.mp3?raw=true"
    ),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-4.mp3?raw=true"
    ),
  },
];

/**
 * GAME VARIABLES
 */

let gameSequence = [];
let playerSequence = [];
let roundCount = 1;

/**
 * FUNCTIONS
 */

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function setText(element, text) {
  element.textContent = text;
}

function activatePad(color) {
  const pad = pads.find((pad) => pad.color === color);
  pad.selector.classList.add("active");
  pad.sound.currentTime = 0;
  pad.sound.play();
  setTimeout(() => pad.selector.classList.remove("active"), 300);
}

function activatePads(sequence) {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval);
      setTimeout(() => playHumanTurn(), 1000);
      return;
    }
    activatePad(sequence[i]);
    i++;
  }, 600);
}

function setLevel(level = 1) {
  if (level < 1 || level > 4) {
    console.error("Invalid level.");
    return;
  }
  const rounds = LEVELS[level];
  gameSequence = Array.from({ length: rounds }, () => getRandomItem(["red", "blue", "green", "yellow"]));
}

function startButtonHandler() {
  setLevel();
  setText(heading, `Simon Says - Round ${roundCount}`);
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  padContainer.classList.remove("unclickable");
  playComputerTurn();
}

function playComputerTurn() {
  setText(statusSpan, "Watch closely!");
  padContainer.classList.add("unclickable");
  activatePads(gameSequence);
}

function playHumanTurn() {
  setText(statusSpan, "Your turn!");
  playerSequence = [];
  padContainer.classList.remove("unclickable");
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  checkPress(color);
}

function checkPress(color) {
  activatePad(color);
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  if (playerSequence[index] !== gameSequence[index]) {
    gameOver();
    return;
  }
  if (playerSequence.length === gameSequence.length) {
    roundCount++;
    setText(heading, `Simon Says - Round ${roundCount}`);
    setTimeout(() => playComputerTurn(), 1000);
  }
}

function checkRound() {
  if (playerSequence.length === gameSequence.length) {
    roundCount++;
    setText(heading, `Simon Says - Round ${roundCount}`);
    setTimeout(() => playComputerTurn(), 1000);
  }
}

function gameOver() {
  setText(statusSpan, "Game Over!");
  padContainer.classList.add("unclickable");
  setTimeout(() => resetGame("Try Again!"), 1500);
}

function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
  roundCount = 1;
  gameSequence = [];
  playerSequence = [];
}

/**
 * EVENT LISTENERS
 */

startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);

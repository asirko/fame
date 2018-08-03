/**
 * Gère l'état d'avancement de la partie
 * Ce singleton permet d'assurer que tout le monde se base sur
 * la même information.
 */

exports.getCurrentQuestion = getCurrentQuestion; // Quel est la question en cours
exports.nextQuestion = nextQuestion; // Comment passer à la question suivante
exports.getQuestionWithAnswer = getQuestionWithAnswer; // S'il faut afficher la solution ou juste la question

const jsonOfQuestions = require('../questions') || [];

let currentQuestionIndex = null;
let showAnswer = false;

function getCurrentQuestion() {
  if (currentQuestionIndex === null) {
    return 'HAS_NOT_STARTED';
  } else if (currentQuestionIndex >= jsonOfQuestions.length) {
    return 'FINISHED';
  }

  const cloneQuestion = JSON.parse(JSON.stringify(
    jsonOfQuestions[currentQuestionIndex]
  ));
  cloneQuestion.hasAnswer = showAnswer;
  if (!showAnswer) {
    cloneQuestion.choices.forEach(a => delete a.isTrue);
  }
  return cloneQuestion;
}

function getQuestionWithAnswer() {
  showAnswer = true;
  return getCurrentQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex === null) {
    currentQuestionIndex = 0;
  } else {
    currentQuestionIndex++;
  }
  showAnswer = false;
  return getCurrentQuestion();
}

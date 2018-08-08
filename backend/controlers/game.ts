// Gère l'état d'avancement de la partie
// Ce singleton permet d'assurer que tout le monde se base sur
// la même information.

import { Answer, Choice, Question } from '../models';
import { clone } from '../utils/object-utils';

enum GameSate {
  HAS_NOT_STARTED = 'HAS_NOT_STARTED',
  FINISHED = 'FINISHED',
}

const jsonOfQuestions: Question[] = require('../resources/questions') || [];
let showAnswer = false;
let currentQuestionIndex: number = null;

/**
 * retourne la question en cours
 * @returns {Question | GameSate}
 */
export function getCurrentQuestion(): Question | GameSate {
  if (currentQuestionIndex === null) {
    return GameSate.HAS_NOT_STARTED;
  } else if (currentQuestionIndex >= jsonOfQuestions.length) {
    return GameSate.FINISHED;
  }

  const cloneQuestion = clone<Question>(jsonOfQuestions[currentQuestionIndex]);
  cloneQuestion.hasAnswer = showAnswer;
  if (!showAnswer) {
    cloneQuestion.choices.forEach(a => delete a.isTrue);
  }
  return cloneQuestion;
}

export function getCurrentQuestionOrNull(): Question {
  const currentQuestion = getCurrentQuestion();
  const gameStates = Object.keys(GameSate).map(k => GameSate[k]);
  const isAGameState = gameStates.indexOf(currentQuestion) !== -1;
  if (isAGameState) {
    return null;
  }
  return <Question>currentQuestion;
}

export function getScore(answers: Answer[]): number {
  return answers.map(a => getChoice(a.questionId, a.choiceId))
    .map(c => +c.isTrue)
    .reduce((total, point) => total + point, 0);
}

function getChoice(questionId: number, choiceId): Choice {
  return jsonOfQuestions
    .find(q => q.id === questionId)
    .choices
    .find(c => c.id === choiceId);
}

/**
 * active l'affichage de la réponse et renvoie la question courante
 * Cette question a donc maintenant les réponses
 * @returns {Question | GameSate}
 */
export function getQuestionWithAnswer(): Question | GameSate {
  showAnswer = true;
  return getCurrentQuestion();
}

/**
 * passe à la question suivante
 * et renvoie la nouvelle question courante
 * @returns {Question | GameSate}
 */
export function nextQuestion(): Question | GameSate {
  if (currentQuestionIndex === null) {
    currentQuestionIndex = 0;
  } else {
    currentQuestionIndex++;
  }
  showAnswer = false;
  return getCurrentQuestion();
}

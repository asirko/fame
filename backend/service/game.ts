// Gère l'état d'avancement de la partie
// Ce singleton permet d'assurer que tout le monde se base sur
// la même information.

import { Question } from '../models';
import { clone, mergeDeep } from '../utils/object-utils';

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
  if (Object.values(GameSate).includes(currentQuestion)) {
    return null;
  }
  return <Question>currentQuestion;
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

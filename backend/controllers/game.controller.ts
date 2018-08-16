import { Answer, Choice, Question } from '../models';
import { clone } from '../utils/object-utils';
import { BehaviorSubject } from 'rxjs';
import { Service } from '../utils/di';

enum GameSate {
  HAS_NOT_STARTED = 'HAS_NOT_STARTED',
  FINISHED = 'FINISHED',
}

/**
 * Gère l'état d'avancement de la partie
 * Ce singleton permet d'assurer que tout le monde se base sur
 * la même information.
 */
@Service()
export class GameController {

  private readonly _jsonOfQuestions: Question[] = require('../resources/questions') || [];
  private _currentQuestionIndex: number = null;

  // Permet de signaler à d'autre controller que l'on corrige une quesion
  private _showAnswer$ = new BehaviorSubject<boolean>(false);
  showAnswer$ = this._showAnswer$.asObservable();

  constructor() {}

  /**
   * retourne la question en cours
   * @returns {Question | GameSate}
   */
  getCurrentQuestion(): Question | GameSate {
    if (this._currentQuestionIndex === null) {
      return GameSate.HAS_NOT_STARTED;
    } else if (this._currentQuestionIndex >= this._jsonOfQuestions.length) {
      return GameSate.FINISHED;
    }

    const cloneQuestion = clone<Question>(this._jsonOfQuestions[this._currentQuestionIndex]);
    cloneQuestion.hasAnswer = this._showAnswer$.getValue();
    if (!cloneQuestion.hasAnswer) {
      cloneQuestion.choices.forEach(a => delete a.isTrue);
    }
    return cloneQuestion;
  }

  getCurrentQuestionOrNull(): Question {
    const currentQuestion = this.getCurrentQuestion();
    const gameStates = Object.keys(GameSate).map(k => GameSate[k]);
    const isAGameState = gameStates.indexOf(currentQuestion) !== -1;
    if (isAGameState) {
      return null;
    }
    return <Question>currentQuestion;
  }

  getScore(answers: Answer[]): number {
    const currentQuestion = this.getCurrentQuestionOrNull();
    return answers
    // don't take currentQuestion into account for the score if the answer has not been shown
      .filter(a => this._showAnswer$.getValue() || !currentQuestion || currentQuestion.id !== a.questionId)
      .map(a => this.getChoice(a.questionId, a.choiceId))
      .map(c => +c.isTrue)
      .reduce((total, point) => total + point, 0);
  }

  private getChoice(questionId: number, choiceId): Choice {
    return this._jsonOfQuestions
      .find(q => q.id === questionId)
      .choices
      .find(c => c.id === choiceId);
  }

  /**
   * active l'affichage de la réponse et renvoie la question courante
   * Cette question a donc maintenant les réponses
   * @returns {Question | GameSate}
   */
  getQuestionWithAnswer(): Question | GameSate {
    this._showAnswer$.next(true);
    return this.getCurrentQuestion();
  }

  /**
   * passe à la question suivante
   * et renvoie la nouvelle question courante
   * @returns {Question | GameSate}
   */
  nextQuestion(): Question | GameSate {
    if (this._currentQuestionIndex === null) {
      this._currentQuestionIndex = 0;
    } else {
      this._currentQuestionIndex++;
    }
    this._showAnswer$.next(false);
    return this.getCurrentQuestion();
  }

}

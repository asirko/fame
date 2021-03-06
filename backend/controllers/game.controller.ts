import { Answer, Choice, Game, GameState, Question } from '../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { Controller } from '../utils/di';
import { logger } from '../logger';
import { map } from 'rxjs/operators';
import { clone } from '../utils/object-utils';
import { filter } from 'rxjs/internal/operators';

/**
 * Gère l'état d'avancement de la partie
 * Ce singleton permet d'assurer que tout le monde se base sur
 * la même information.
 */
@Controller()
export class GameController {

  private readonly questions: Question[] = readQuestionFile('../resources/questions');
  private get initialGame(): Game {
    return {
      nbQuestions: (this.questions && this.questions.length) || 0,
      state: GameState.NOT_STARTED,
      currentQuestionIndex: null,
      showCurrentAnswer: false,
      serverQuestionStartedAt: null,
    };
  }

  private readonly _game$ = new BehaviorSubject<Game>({ ...this.initialGame });
  readonly game$ = this._game$.asObservable();
  get gameSnapshot(): Game {
    return { ...this._game$.getValue() };
  }

  currentQuestion$ = this.game$.pipe(
    map(game => this.extractQuestionFromGame(game)),
    filter(q => !!q),
  );
  get currentQuestionSnapshot(): Question {
    return this.extractQuestionFromGame(this.gameSnapshot);
  }

  constructor() {}

  getCurrentAnswerLabel(answers: Answer[]): string {
    const game = this.gameSnapshot;
    const currentQuestion = this.questions[game.currentQuestionIndex];
    if (!currentQuestion) {
      return '';
    }
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    if (!currentAnswer) {
      return '';
    }

    const choice = currentQuestion.choices.find(c => c.id === currentAnswer.choiceId);
    return choice && choice.label;
  }

  getScoreForAnswers(answers: Answer[]): number {
    const game = this.gameSnapshot;
    const currentQuestion = this.questions[game.currentQuestionIndex];
    return answers
      // don't take currentQuestion into account for the score if the answer has not been shown
      .filter(a => game.showCurrentAnswer || !currentQuestion || currentQuestion.id !== a.questionId)
      .map(a => this.getChoice(a.questionId, a.choiceId))
      .map(c => +c.isTrue)
      .reduce((total, point) => total + point, 0);
  }

  private getChoice(questionId: number, choiceId): Choice {
    return this.questions
      .find(q => q.id === questionId)
      .choices
      .find(c => c.id === choiceId);
  }

  showAnswer(): void {
    this.toggleAnswer(true);
  }
  hideAnswer(): void {
    this.toggleAnswer(false);
  }
  /**
   * active/désactive l'affichage de la réponse courante
   */
  private toggleAnswer(displayAnswer: boolean): void {
    this._game$.next({
      ...this._game$.getValue(),
      showCurrentAnswer: displayAnswer,
    });
  }

  getTimerOffset(): number {
    const game = this._game$.getValue();
    if (!game.serverQuestionStartedAt) {
      logger.error('no offset time');
      return null;
    }
    const msStart = game.serverQuestionStartedAt.getTime();
    const msNow = new Date().getTime();
    return msNow - msStart;
  }

  /**
   * passe à la question suivante
   */
  nextQuestion(): void {
    const game = this._game$.getValue();
    const nextIndex = game.currentQuestionIndex === null ? 0 : game.currentQuestionIndex + 1;
    const nextGameState = nextIndex >= game.nbQuestions ? GameState.FINISHED : GameState.ON_GOING;
    const nextTimer = nextGameState === GameState.ON_GOING ? new Date() : null;
    this._game$.next({
      ...game,
      currentQuestionIndex: nextIndex,
      state: nextGameState,
      showCurrentAnswer: false,
      serverQuestionStartedAt: nextTimer,
    });
  }

  /**
   * reviens en arrière d'une question
   */
  previousQuestion(): void {
    const game = this._game$.getValue();
    const previousIndex = game.currentQuestionIndex > 0 ? game.currentQuestionIndex - 1 : null;
    const nextGameState = previousIndex !== null ? GameState.ON_GOING : GameState.NOT_STARTED;
    const nextTimer = nextGameState === GameState.ON_GOING ? new Date() : null;
    this._game$.next({
      ...game,
      currentQuestionIndex: previousIndex,
      state: nextGameState,
      showCurrentAnswer: false,
      serverQuestionStartedAt: nextTimer,
    });
  }

  resetGame(): void {
    this._game$.next({ ...this.initialGame });
  }

  private extractQuestionFromGame(game: Game): Question {
    if (game.currentQuestionIndex === null || game.state !== GameState.ON_GOING) {
      return null;
    }
    const question = this.questions[game.currentQuestionIndex];
    if (!question) {
      logger.error('current game state refer to a question that does not exist');
      return null;
    }

    // remove answer if the question is still unanswered
    const cloneQuestion = clone<Question>(question);
    cloneQuestion.hasAnswer = game.showCurrentAnswer;
    if (!cloneQuestion.hasAnswer) {
      cloneQuestion.choices.forEach(a => delete a.isTrue);
    }
    return cloneQuestion;
  }
}

function readQuestionFile(path: string): Question[] {
  const questions = <Question[]>require(path);
  if (!questions || !questions.length) {
    logger.error('Question file is invalid, no question');
  }
  return questions || [];
}

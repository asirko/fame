import { Answer, Choice, Game, GameState, Question } from '../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { Controller } from '../utils/di';
import { logger } from '../logger';
import { map } from 'rxjs/operators';
import { clone } from '../utils/object-utils';

/**
 * Gère l'état d'avancement de la partie
 * Ce singleton permet d'assurer que tout le monde se base sur
 * la même information.
 */
@Controller()
export class GameController {

  private readonly questions: Question[] = readQuestionFile('../resources/questions');

  private readonly _game$ = new BehaviorSubject<Game>({
    nbQuestions: this.questions.length,
    state: GameState.NOT_STARTED,
    currentQuestionIndex: null,
    showCurrentAnswer: false,
  });
  readonly game$ = this._game$.asObservable();
  get gameSnapshot(): Game {
    return { ...this._game$.getValue() };
  }

  currentQuestion$ = this.game$.pipe(
    map(game => this.extractQuestionFromGame(game)),
  );
  get currentQuestionSnapshot(): Question {
    return this.extractQuestionFromGame(this.gameSnapshot);
  }

  constructor() {}

  getCurrentAnswerLabel(answers: Answer[]): string {
    const game = this.gameSnapshot;
    const currentQuestion = this.questions[game.currentQuestionIndex];
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

  /**
   * active l'affichage de la réponse
   * La question courante a donc maintenant les réponses
   */
  showAnswer(): void {
    this._game$.next({
      ...this._game$.getValue(),
      showCurrentAnswer: true,
    });
  }

  /**
   * passe à la question suivante
   */
  nextQuestion(): void {
    const game = this._game$.getValue();
    const nextIndex = game.currentQuestionIndex === null ? 0 : game.currentQuestionIndex + 1;
    const nextGameState = nextIndex >= game.nbQuestions ? GameState.FINISHED : GameState.ON_GOING;
    this._game$.next({
      ...game,
      currentQuestionIndex: nextIndex,
      state: nextGameState,
      showCurrentAnswer: false,
    });
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

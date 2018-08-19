export enum GameState {
  NOT_STARTED = 'HAS_NOT_STARTED',
  ON_GOING = 'ON_GOING',
  FINISHED = 'FINISHED',
}

export class Game {
  nbQuestions: number;
  state: GameState;
  currentQuestionIndex: number;
  showCurrentAnswer: boolean;
}

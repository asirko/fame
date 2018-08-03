export enum GameState {
  NOT_STARTED = 'HAS_NOT_STARTED',
  FINISHED = 'FINISHED',
}

export class Question {
  questionLabel: string;
  choices: {
    label: string;
    isTrue: boolean;
  };
  hasAnswer: boolean;
}

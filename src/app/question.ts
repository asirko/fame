export enum GameState {
  NOT_STARTED = 'HAS_NOT_STARTED',
  FINISHED = 'FINISHED',
}

export class Question {
  id: number;
  questionLabel: string;
  choices: {
    label: string;
    isTrue: boolean;
  };
  hasAnswer: boolean;
}

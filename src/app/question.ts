export enum GameState {
  NOT_STARTED = 'HAS_NOT_STARTED',
  FINISHED = 'FINISHED',
}

export class Question {
  id: number;
  questionLabel: string;
  choices: Choice[];
  hasAnswer: boolean;
}

export class Choice {
  id: number;
  label: string;
  isTrue: boolean;
}

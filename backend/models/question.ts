export class Question {
  id: number;
  questionLabel: string;
  choices: Choice[];
  hasAnswer?: boolean;
}

export class Choice {
  id: number;
  label: string;
  isTrue?: boolean;
}

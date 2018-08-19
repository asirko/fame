export class Player {
  id: string;
  name: string;
  score: number;
  isConnected: boolean;
  currentAnswer?: string;
  answers: Answer[];
}

export class Answer {
  questionId: number;
  choiceId: number;
}

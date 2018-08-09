export class Player {
  id: string; // will be the player socket id
  name: string;
  isConnected: boolean;
  answers: Answer[];
}

export class PlayerSummary {
  id: string;
  name: string;
  isConnected: boolean;
  score: number;
  currentAnswer?: string;
}

export class Answer {
  questionId: number;
  choiceId: number;
}

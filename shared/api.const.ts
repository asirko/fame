export enum GenericEvent {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
}

export const gameNamespaceName = 'game';
export enum GameEvent {
  GAME = 'game',
  CURRENT_QUESTION = 'currentQuestion',
  NEXT_QUESTION = 'nextQuestion',
  PREVIOUS_QUESTION = 'previousQuestion',
  SHOW_ANSWER = 'showAnswer',
  HIDE_ANSWER = 'hideAnswer',
  TIMER_OFFSET = 'timerOffset',
  RESET = 'reset',
}

export const playerNamespaceName = 'player';
export enum PlayerEvent {
  ALL_PLAYERS = 'allPlayers',
  MYSELF = 'myself',
  ADD_PLAYER = 'addPlayer',
  STORE_ANSWER = 'storeAnswer',
  INIT_ALL_PLAYERS = 'initAllPlayers',
}

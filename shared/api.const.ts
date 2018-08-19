export enum GenericEvent {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
}

export const gameNamespaceName = 'game';
export enum GameEvent {
  GAME = 'game',
  CURRENT_QUESTION = 'currentQuestion',
  NEXT_QUESTION = 'nextQuestion',
  SHOW_ANSWER = 'showAnswer',
}

export const playerNamespaceName = 'player';
export enum PlayerEvent {
  ALL_PLAYERS = 'allPlayers',
  MYSELF = 'myself',
  ADD_PLAYER = 'addPlayer',
  STORE_ANSWER = 'storeAnswer',
  INIT_ALL_PLAYERS = 'initAllPlayers',
}

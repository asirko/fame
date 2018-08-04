const gameService = require('game');

/**
 * Gère l'ensemble des player
 * Ce singleton permet de regrouper les info liée aux joueurs
 */

exports.addPlayer = addPlayer; // Ajoute un joueur à la liste renvois un booléen attestant de la disponibilité du nom du joueur
exports.disconnectPlayer = disconnectPlayer;
exports.storeAnswer = storeAnswer; // stock une réponse faite par un joueur à une question
exports.getFullResults = getFullResults; // Génère un récapitulatif des score

/*
class Player {
  id: string; // will be the player socket id
  name: string;
  isConnected: boolean;
  answers: Answer[];
}
class Answer {
  questionId: number;
  choiceId: number;
}
 */

// ATTENTION cette données est mutable !
// n'exposer que des clone pour éviter des effet de bord !!
const players = [];

function addPlayer(name, id) {
  const alreadyRegistredPlayer = players.find(p => p.name === name);

  // someone try to use a used name
  if (alreadyRegistredPlayer && alreadyRegistredPlayer.isConnected) {
    return false;
  }

  // someone try to reconnect
  if (alreadyRegistredPlayer && !alreadyRegistredPlayer.isConnected) {
    alreadyRegistredPlayer.isConnected = true;
    alreadyRegistredPlayer.id = id;
    return true;
  }

  // new player
  if (!alreadyRegistredPlayer) {
    players.push({
      name,
      id,
      isConnected: true,
      answers: [],
    });
    return true;
  }
}

function storeAnswer(playerId, choiceId) {
  const player = players.find(p => p.id === id);
  if (!player) {
    console.error('Un joueur non authentifié a pu répondre à une question.');
    return;
  }

  const currentQuestion = gameService.getCurrentQuestion();
  if (!currentQuestion) {
    console.error('Tentative de réponse alors qu\'il n\'y a pas de question en cours.');
    return;
  }
  const questionId = currentQuestion.id;

  const alreadyAnsweredQuestion = player.answers.find(a => a.questionId === questionId);
  if (alreadyAnsweredQuestion) {
    alreadyAnsweredQuestion.choiceId = choiceId;
  } else {
    player.answers.push({
      choiceId,
      questionId
    });
  }
}

function getFullResults() {
  // todo
}

function disconnectPlayer(id) {
  const player = players.find(p => p.id === id);
  if (player) {
    player.isConnected = false;
  }
}

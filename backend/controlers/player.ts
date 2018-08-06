// Gère l'ensemble des player
// Ce singleton permet de regrouper les info liée aux joueurs
import { Player } from '../models';
import { getCurrentQuestionOrNull } from './game';
import { logger } from '../logger';

// ATTENTION cette données est mutable !
// n'exposer que des clone pour éviter des effet de bord !!
const players: Player[] = [];

/**
 * Ajoute un joueur à la liste
 * le joueur n'est ajouté que si le nom demandé n'est pas pris par un autre joueur connecté
 * Si le nom est pris par un joueur déconnecté, on suppose qu'il s'agit d'une tentative de reconnexion
 * @param {string} name
 * @param {string} id
 * @returns {boolean}
 */
export function addPlayer(name: string, id: string): boolean {
  const alreadyRegisteredPlayer = players.find(p => p.name === name);

  // someone try to use a used name
  if (alreadyRegisteredPlayer && alreadyRegisteredPlayer.isConnected) {
    return false;
  }

  // someone try to reconnect
  if (alreadyRegisteredPlayer && !alreadyRegisteredPlayer.isConnected) {
    alreadyRegisteredPlayer.isConnected = true;
    alreadyRegisteredPlayer.id = id;
    return true;
  }

  // new player
  if (!alreadyRegisteredPlayer) {
    players.push({
      name,
      id,
      isConnected: true,
      answers: [],
    });
    return true;
  }

  logger.error('should have return something');
  return false;
}

/**
 * stock une réponse faite par un joueur à une question
 * @param {string} playerId
 * @param {number} choiceId
 */
function storeAnswer(playerId: string, choiceId: number): void {
  const player = players.find(p => p.id === playerId);
  if (!player) {
    logger.error('Un joueur non authentifié a pu répondre à une question.');
    return;
  }

  const currentQuestion = getCurrentQuestionOrNull();
  if (!currentQuestion) {
    logger.error('Tentative de réponse alors qu\'il n\'y a pas de question en cours.');
    return;
  }
  const questionId = currentQuestion.id;

  const alreadyAnsweredQuestion = player.answers.find(a => a.questionId === questionId);
  if (alreadyAnsweredQuestion) {
    // could change it's decision
    alreadyAnsweredQuestion.choiceId = choiceId;
  } else {
    player.answers.push({
      choiceId,
      questionId,
    });
  }
}

/**
 * Génère un récapitulatif des score
 */
export function getFullResults() {
  // todo
}

export function disconnectPlayer(id: string) {
  const player = players.find(p => p.id === id);
  if (player) {
    player.isConnected = false;
  }
}

export function getPlayer(id: string): Player {
  return players.find(p => p.id === id);
}

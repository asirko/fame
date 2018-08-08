// Gère l'ensemble des player
// Ce singleton permet de regrouper les info liée aux joueurs
import { Player, PlayerSummary } from '../models';
import { getCurrentQuestionOrNull, getScore, showAnswer$ } from './game';
import { logger } from '../logger';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  let isAvailable: boolean;

  if (alreadyRegisteredPlayer && alreadyRegisteredPlayer.isConnected) {
    // someone try to use a used name
    isAvailable = false;
  } else if (alreadyRegisteredPlayer && !alreadyRegisteredPlayer.isConnected) {
    // someone try to reconnect
    alreadyRegisteredPlayer.isConnected = true;
    alreadyRegisteredPlayer.id = id;
    isAvailable = true;
  } else if (!alreadyRegisteredPlayer) {
    // new player
    players.push({
      name,
      id,
      isConnected: true,
      answers: [],
    });
    isAvailable = true;
  } else {
    logger.error('should have return something');
    isAvailable = false;
  }

  _updatePlayersScore();
  return isAvailable;
}

/**
 * stock une réponse faite par un joueur à une question
 * @param {string} playerId
 * @param {number} choiceId
 */
export function storeAnswer(playerId: string, choiceId: number): void {
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
  logger.info('Réponse sélectionnée ' + choiceId + ' pour la question ' + questionId + ' par user ' + player.id);
  _updatePlayersScore();
}

function getCurrentAnswer(p: Player): string {
  const currentQuestion = getCurrentQuestionOrNull();
  if (!currentQuestion) {
    return '';
  }
  const currentAnswer = p.answers.find(a => a.questionId === currentQuestion.id);
  if (!currentAnswer) {
    return '';
  }
  return currentQuestion.choices.find(c => c.id === currentAnswer.choiceId).label;
}

export function disconnectPlayer(id: string) {
  const player = players.find(p => p.id === id);
  if (player) {
    player.isConnected = false;
    _updatePlayersScore();
  }
}

export function getPlayer(id: string): Player {
  return players.find(p => p.id === id);
}


/**
 * Génère un récapitulatif des scores
 * @export playersScore$
 */
const _playersScore$ = new BehaviorSubject<PlayerSummary[]>(null);
showAnswer$.subscribe(() => _updatePlayersScore());
function _updatePlayersScore() {
  _playersScore$.next(players
    .map(p => ({
      name: p.name,
      isConnected: p.isConnected,
      score: getScore(p.answers),
      currentAnswer: getCurrentAnswer(p),
    }))
    .sort((a, b) => a.score - b.score)
  );
}
export const playersScore$ = _playersScore$.asObservable().pipe(
  filter(g => g !== null),
);
export const playersScoreSnapshot = function (): PlayerSummary[] {
  return _playersScore$.getValue();
};

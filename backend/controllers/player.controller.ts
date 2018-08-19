import { Player } from '../../shared/models';
import { logger } from '../logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Controller } from '../utils/di';
import { GameController } from './game.controller';

/**
 * Gère l'ensemble des players
 * Ce singleton permet de regrouper les info liée aux joueurs
 */
@Controller()
export class PlayersController {

  // ATTENTION cette données est mutable !
  // n'exposer que des clone pour éviter des effet de bord !!
  private readonly _players: Player[] = [];

  /**
   * Génère un récapitulatif des scores
   */
  private _playersScore$ = new BehaviorSubject<Player[]>(null);

  readonly playersScore$ = this._playersScore$.asObservable()
    .pipe(filter(g => g !== null));

  get playersScoreSnapshot(): Player[] {
    return this._playersScore$.getValue();
  }

  constructor(
    private gameController: GameController,
  ) {
    // met à jour les score à chaque fois que l'admin décide de montrer la solution
    this.gameController.game$.pipe(
      filter(g => g.showCurrentAnswer),
      tap(() => this._updatePlayersScore()),
    ).subscribe();
  }

  /**
   * Ajoute un joueur à la liste
   * le joueur n'est ajouté que si le nom demandé n'est pas pris par un autre joueur connecté
   * Si le nom est pris par un joueur déconnecté, on suppose qu'il s'agit d'une tentative de reconnexion
   * @param {string} name
   * @param {string} id
   * @returns {boolean}
   */
  addPlayer(name: string, id: string): boolean {
    const alreadyRegisteredPlayer = this._players.find(p => p.name === name);
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
      this._players.push({
        name,
        id,
        score: 0,
        isConnected: true,
        answers: [],
      });
      isAvailable = true;
    } else {
      logger.error('should have return something');
      isAvailable = false;
    }

    this._updatePlayersScore();
    return isAvailable;
  }

  /**
   * stock une réponse faite par un joueur à une question
   * @param {string} playerId
   * @param {number} choiceId
   */
  storeAnswer(playerId: string, choiceId: number): void {
    const player = this._players.find(p => p.id === playerId);
    if (!player) {
      logger.error('Un joueur non authentifié a pu répondre à une question.');
      return;
    }

    const currentQuestion = this.gameController.currentQuestionSnapshot;
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

    this._updatePlayersScore();
  }

  disconnectPlayer(id: string) {
    const player = this._players.find(p => p.id === id);
    if (player) {
      player.isConnected = false;
      this._updatePlayersScore();
    }
  }

  getPlayer(id: string): Player {
    return { ...this._players.find(p => p.id === id)};
  }

  getPlayerScore$(id: string): Observable<Player> {
    return this.playersScore$.pipe(
      map(list => list.find(p => p.id === id)),
    );
  }

  private _updatePlayersScore() {
    const newPlayersState = this._players
      .map(p => ({
        ...p,
        score: this.gameController.getScoreForAnswers(p.answers),
      }))
      .sort((a, b) => a.score - b.score);

    this._playersScore$.next(newPlayersState);
  }
}

import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { context, keys, sounds, stateMachine, MAX_RECENT_GAMES } from "../globals.js";
import Background from "../objects/Background.js";
import RecentGamesManager from "../services/RecentGamesManager.js";
import Player from "../entities/Player.js";
import OpponentFactory from "../services/OpponentFactory.js";

export default class VictoryState extends State {
	constructor() {
		super();
		this.font = `64px Heavy`;
	}

	enter(parameters = {}) {
		this.player = parameters.player ?? null;
		this.opponent = parameters.opponent ?? null;

		if(this.player != null){
			RecentGamesManager.addRecentGame(this.player, this.opponent);
		}
        
        this.recentGames = RecentGamesManager.loadRecentGames();
	}

	exit() {
		sounds.stop(SoundName.Victory);
        sounds.stop(SoundName.Defeat);

		if(this.player != null){
			sounds.stop(SoundName.Instrumental1);
		}
	}

	update(dt) {

		if (keys.Enter) {
			keys.Enter = false;

			sounds.play(SoundName.Next);
			stateMachine.change(GameStateName.TitleScreen);
		}

		else if(keys[' ']){
			keys[' '] = false;

			sounds.play(SoundName.Start);
			stateMachine.change(GameStateName.Play, {
				player: this.recentGames[0].player,
				opponent: this.recentGames[0].opponent
			});
		}
	}

	render() {
		Background.renderDefault();
		this.renderRecentGames();
	}

	renderRecentGames() {

        context.font = this.font;
		context.textAlign = 'center';
		context.fillStyle = 'white';

		context.fillText(`Recent Games`, Background.WIDTH / 2, 75);

        for (let i = 0; i < MAX_RECENT_GAMES; i++) {
            context.fillText(`${this.recentGames[i].player.points} ${this.recentGames[i].player.team} | ${this.recentGames[i].opponent.team} ${this.recentGames[i].opponent.points}`, Background.WIDTH / 2, Background.HEIGHT / 7 + i * 100);
        }

		context.font = '44px Heavy';
		context.fillText(`Press [enter] to return to the main menu / Press [space] to load recent game`, Background.WIDTH / 2, Background.HEIGHT / 1.05);
	}
}

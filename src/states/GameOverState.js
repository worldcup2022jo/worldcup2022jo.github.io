import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { context, keys, sounds, stateMachine, MAX_RECENT_GAMES, timer } from "../globals.js";
import Background from "../objects/Background.js";
import Player from "../entities/Player.js";
import OpponentFactory from "../services/OpponentFactory.js";

export default class GameOverState extends State {
	constructor() {
		super();
		this.font = `64px Heavy`;
	}

	enter(parameters = {}) {
		this.player = parameters.player ?? new Player('por');
		this.opponent = parameters.opponent ?? OpponentFactory.createInstance('mar');

		this.r = 255;
		this.g = 255;
		this.b = 255;

		sounds.play(SoundName.Defeat);
		timer.tween(this, ['r', 'g', 'b'], [0, 0, 0], 28, () => {
			timer.removeFinishedTasks();
		});
	}

	exit(){
		timer.clear();
	}

	update(dt) {

		if (keys.Enter) {
			keys.Enter = false;

			sounds.play(SoundName.Next);
			stateMachine.change(GameStateName.RecentGames, {
				player: this.player,
				opponent: this.opponent
			});
		}

		timer.update(dt);
	}

	render() {
		Background.renderDefault();
		this.renderText();
	}

	renderText() {

		context.textAlign = 'center';
		context.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;

        context.font = '256px Heavy';
		context.fillText(`You Lost!`, Background.WIDTH / 2, Background.HEIGHT / 2);

        context.font = this.font;
		context.fillStyle = 'white';
		context.fillText(`Press [enter] to continue`, Background.WIDTH / 2, Background.HEIGHT / 1.05);
	}
}

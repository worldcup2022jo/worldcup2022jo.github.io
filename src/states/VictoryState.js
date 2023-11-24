import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { context, keys, sounds, stateMachine, timer } from "../globals.js";
import Background from "../objects/Background.js";
import OpponentFactory from "../services/OpponentFactory.js";

export default class VictoryState extends State {
	constructor() {
		super();
		this.colours = [
			[153, 229, 80],
			[95, 205, 228],
			[251, 242, 54],
			[223, 113, 38],
			[153, 229, 80],
			[95, 205, 228],
			[251, 242, 54],
			[223, 113, 38],
		];
		this.letters = ['Y', 'O', 'U', ' ', 'W', 'O', 'N', '!'];
		this.textY = Background.HEIGHT / 2.25;
	}

	enter(parameters = {}) {
		this.player = parameters.player ?? new Player('por');
		this.opponent = parameters.opponent ?? OpponentFactory.createInstance('mar');
		this.alternateColours = false;

		this.fontSize = { x: 64 };
		this.font = `${this.fontSize.x}px Heavy`;

		sounds.play(SoundName.Victory);
		
		timer.tween(this.fontSize, ['x'], [256], 37.25, () => {

			this.alternateColours = true;
			this.startColourTimer();
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

		this.font = `${this.fontSize.x}px Heavy`;
	}

	render() {
		Background.renderDefault();
		this.renderText();
	}

	renderText() {

		context.font = this.font;
		context.textBaseline = 'middle';
		context.textAlign = 'center';

		// Print letters in their current colors based on the timer.
		for (let i = 0; i < this.letters.length; i++) {
		
			let width1 = Background.WIDTH / 2 + 50 * i * (this.fontSize.x / 64) + 3 - this.fontSize.x * 2.70;
			let width2 = Background.WIDTH / 2 + 50 * i * (this.fontSize.x / 64) - this.fontSize.x * 2.70;

			// Shadow.
			if (this.alternateColours) {
				context.fillStyle = `rgb(34, 32, 52, 1)`;
			}
			else {
				context.fillStyle = 'white';
			}

			if (i > 4) {
				context.fillText(this.letters[i][0], width1 + (this.fontSize.x / 9), this.textY);
			}
			else {
				context.fillText(this.letters[i][0], width1, this.textY);
			}

			if (this.alternateColours) {
				// Coloured Text.
				const r = this.colours[i][0];
				const g = this.colours[i][1];
				const b = this.colours[i][2];
				context.fillStyle = `rgb(${r}, ${g}, ${b})`;

			}
			else {
				context.fillStyle = 'white';
			}

			if (i > 4) {
				context.fillText(this.letters[i][0], width2 + (this.fontSize.x / 9), this.textY);
			}
			else {
				context.fillText(this.letters[i][0], width2, this.textY);
			}
		}

		context.fillStyle = 'white';
		context.font = '64px Heavy';
		context.fillText(`Press [enter] to continue`, Background.WIDTH / 2, Background.HEIGHT / 1.05);
	}

	startColourTimer() {
		this.colourTimer = timer.addTask(() => {
			// Shift every colour to the next, looping the last to the front.
			this.colours = this.colours.slice(1).concat(this.colours.slice(0, 1));
		}, 0.45);
	}
}

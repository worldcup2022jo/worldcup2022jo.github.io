import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { context, keys, sounds, stateMachine, images } from "../globals.js";
import Background from "../objects/Background.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
		this.sprite = new Sprite(images.get(ImageName.TitleScreen), 0, 0, Background.WIDTH, Background.HEIGHT);
	}

	enter() {
		this.font = '64px Heavy';
        sounds.play(SoundName.Instrumental1);
	}

	update(dt) {

        if (keys.Enter) {
            keys.Enter = false;

			sounds.play(SoundName.Next);
			stateMachine.change(GameStateName.SelectTeams);
        }

		else if (keys[' ']){
			keys[' '] = false;

			sounds.play(SoundName.Next);
			stateMachine.change(GameStateName.RecentGames);
		}
    }

	render() {
		// this.renderBackground();
		this.sprite.render(0, 0);
		this.renderText();
	}

	renderText() {
		context.fillStyle = 'white';
		context.font = this.font;
		context.textAlign = 'center';

		context.fillText(`WELCOME TO FIFA WORLD CUP 2022!`, Background.WIDTH / 2, 100);

		context.font = '44px Heavy';
		context.fillText(`Press [enter] to pick teams / Press [space] to view recent games`, Background.WIDTH / 2, Background.HEIGHT / 1.05);
	}
}

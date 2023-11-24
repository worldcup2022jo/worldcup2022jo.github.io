import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, context } from "../globals.js";


export default class Background {
	static WIDTH = 1920;
	static HEIGHT = 1280;

	static FLAG_SIZE = 80;
	static FLAG_SCALE = { x: 2.5, y: 2.5};

	static PLAYER_FLAG;
	static OPPONENT_FLAG;


	constructor() {
		this.sprite = Background.generateSprite();
		this.suddenDeathMode = false;

		this.countryFlags = {
			[ImageName.Netherlands]: new Sprite(images.get(ImageName.Netherlands), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.UnitedStates]: new Sprite(images.get(ImageName.UnitedStates), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Argentina]: new Sprite(images.get(ImageName.Argentina), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Australia]: new Sprite(images.get(ImageName.Australia), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Japan]: new Sprite(images.get(ImageName.Japan), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Croatia]: new Sprite(images.get(ImageName.Croatia), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Brazil]: new Sprite(images.get(ImageName.Brazil), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Korea]: new Sprite(images.get(ImageName.Korea), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.England]: new Sprite(images.get(ImageName.England), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Senegal]: new Sprite(images.get(ImageName.Senegal), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.France]: new Sprite(images.get(ImageName.France), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Poland]: new Sprite(images.get(ImageName.Poland), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Morocco]: new Sprite(images.get(ImageName.Morocco), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Spain]: new Sprite(images.get(ImageName.Spain), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Portugal]: new Sprite(images.get(ImageName.Portugal), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
			[ImageName.Switzerland]: new Sprite(images.get(ImageName.Switzerland), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
		};
	}

	render(player, opponent) {
        this.sprite.render(0, 0);

		this.player = player;
		this.opponent = opponent;

		this.renderTurn();
		this.renderPenalties();
		this.renderCountryFlags();
	}

	static generateSprite() {
		return new Sprite(images.get(ImageName.Field), 0, 0, Background.WIDTH, Background.HEIGHT);
    }

	renderTurn(){
		context.font = '40px Bold';

		if(this.player.idleAttacker){
			context.fillStyle = 'green';
			
			context.fillText(`Player's Turn! (${this.player.team.toUpperCase()})`, 25, 50);
		}
		else{
			context.fillStyle = 'red';
			context.fillText(`Opponent's Turn! (${this.opponent.team.toUpperCase()})`, 25, 50);
		}

		if(this.suddenDeathMode){
			context.fillStyle = 'black';
			context.fillText(`SUDDEN DEATH MODE!`, 25, 100);
		}
	}

	renderPenalties(){
		context.font = '40px Bold';

		context.fillStyle = 'green';
		context.fillText(`Player's Penalties: ${this.player.penaltiesLeft}`, 1515, 50);

		context.fillStyle = 'red';
		context.fillText(`Opponent's Penalties: ${this.opponent.penaltiesLeft}`, 1450, 100);
	}

	renderCountryFlags(){
		this.countryFlags[this.player.team].render(675, 0, Background.FLAG_SCALE);
		this.countryFlags[this.opponent.team].render(1125, 0, Background.FLAG_SCALE);

		context.font = '40px Bold';
		context.fillStyle = 'black';
		context.textAlign = 'center'
		context.fillText(`${this.player.points} ${this.player.team.toUpperCase()} | ${this.opponent.team.toUpperCase()} ${this.opponent.points}`, Background.WIDTH / 2, 70);

		context.textAlign = 'start';
	}

	static renderDefault(){
		let sprite = new Sprite(images.get(ImageName.Background), 0, 0, Background.WIDTH, Background.HEIGHT);
		sprite.render(0, 0);
	}
}
import State from "../../lib/State.js";
import Background from "../objects/Background.js";
import { sounds, stateMachine, timer } from "../globals.js";
import GoalNet from "../objects/GoalNet.js";
import GoalPost from "../objects/GoalPost.js";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";
import SoundName from "../enums/SoundName.js";
import GameStateName from "../enums/GameStateName.js";
import Player from "../entities/Player.js";
import OpponentFactory from "../services/OpponentFactory.js";
import Ball from "../objects/Ball.js";

export default class PlayState extends State {

	constructor() {
		super();
	}

	enter(parameters = {}) {

		this.player = parameters.player ?? new Player('por');
		this.opponent = parameters.opponent ?? OpponentFactory.createInstance('mar');

		this.background = new Background();
		this.goalNet = new GoalNet();
		this.goalPost = new GoalPost();
		this.ball = new Ball();

		this.canvas = document.getElementsByTagName('canvas');
		this.canvas[0].addEventListener('click', (event) => {
			this.processClick(event);
		});

		this.inPlayState = true;
		this.listenForPenalty = true;

		this.opponentDefended = false;
		this.suddenDeathMode = false;

		sounds.stop(SoundName.Instrumental1);
		sounds.play(SoundName.Instrumental2);
	}

	exit() {
		sounds.stop(SoundName.Instrumental2);
		this.inPlayState = false;
		timer.clear();
	}

	update(dt) {

		if(!this.inPlayState){
			return;
		}

		this.ball.update();
		this.player.update(dt);
		this.opponent.update(dt);

		timer.update(dt);
	}

	render() {
		this.background.render(this.player, this.opponent);

		this.ball.render();
		this.player.render();
		this.opponent.render();

		//for debugging
		// this.goalNet.render();
		// this.goalPost.render();
	}

	processClick(event) {

		if (!this.inPlayState) {
			return;
		}

		if(!this.listenForPenalty){
			return;
		}

		this.shootBall(event);
	}

	async shootBall(event){
		this.determineCharacterAnimations(event);

		timer.tween(this.ball.position, ['x', 'y'], [event.offsetX, event.offsetY], 0.5, () => {
			this.ball.position = { x: Ball.DEFAULT_X, y: Ball.DEFAULT_Y };
		});

		await new Promise(r => setTimeout(r, 500));

		this.processBall(event);
	}

	determineCharacterAnimations(event){
		sounds.play(SoundName.Kick);

		if(this.player.idleAttacker){
			this.player.attack();
			this.opponent.defend();
			this.processOpponentDefense(event.offsetX);
		}
		else{
			this.opponent.attack();
			this.player.defend();
		}
	}

	processBall(event){

		//inside goal net
		if (this.checkForGoal(event) && !this.opponentDefended) {
			this.processGoal();
		}

		//outside goal net
		else {

			//inside goal post
			if (this.checkForPost(event)) {
				this.processPost();
			}

			//outside goal and post
			else {
				this.processOutside();
			}
		}

		this.opponentDefended = false;

		//switch turns after each penalty shot
		this.changeTurns();

		//check if there are any penalties left and we're not in sudden death mode
		if (this.player.penaltiesLeft == 0 && this.opponent.penaltiesLeft == 0 || this.suddenDeathMode) {
			this.determineEndState();
		}
	}

	checkForGoal(event) {

		let selection = {
			position: { x: event.offsetX, y: event.offsetY },
			dimensions: { x: 1, y: 1 }
		}

		for (let i = 0; i < this.goalNet.hitboxes.length; i++) {

			if (this.goalNet.hitboxes[i].didCollide(selection)) {
				this.goalNet.hitboxSelected = i;
				return true;
			}
		}

		return false;
	}

	checkForPost(event) {
		let hitPostLeft = isAABBCollision(
			this.goalPost.position.x,
			this.goalPost.position.y,
			(this.goalPost.dimensions.x - this.goalNet.dimensions.x) / 2,
			this.goalPost.dimensions.y,
			event.offsetX,
			event.offsetY,
			1, 1);

		let hitPostRight = isAABBCollision(
			this.goalNet.position.x + this.goalNet.dimensions.x,
			this.goalPost.position.y,
			(this.goalPost.dimensions.x - this.goalNet.dimensions.x) / 2,
			this.goalPost.dimensions.y,
			event.offsetX,
			event.offsetY,
			1, 1);

		let hitCrossbar = isAABBCollision(
			this.goalPost.position.x,
			this.goalPost.position.y,
			this.goalPost.dimensions.x,
			this.goalPost.dimensions.y - this.goalNet.dimensions.y,
			event.offsetX,
			event.offsetY,
			1, 1);

		return hitPostLeft || hitPostRight || hitCrossbar;
	}

	processGoal() {
		sounds.play(SoundName.GoalNet);

		if (this.player.isAttacking) {
			this.player.points++;
			// sounds.play(SoundName.Siu);
		}
		else {
			this.opponent.points++;
		}
	}

	processPost() {
		sounds.play(SoundName.GoalPost);
	}

	processOutside() {

		if (this.player.isAttacking) {
			// sounds.play(SoundName.Fail);
		}
	}

	changeTurns() {

		//player shot their penalty
		if (this.player.isAttacking) {

			this.player.isAttacking = this.opponent.isDefending = false
			this.player.idleDefender = this.opponent.idleAttacker = true;

			if (!this.suddenDeathMode) {
				this.player.penaltiesLeft--;
			}

			this.listenForPenalty = false;
			this.processOpponentAttack();
		}

		//opponent shot their penalty
		else {

			this.player.isDefending = this.opponent.isAttacking = false
			this.player.idleAttacker = this.opponent.idleDefender = true;

			if (!this.suddenDeathMode) {
				this.opponent.penaltiesLeft--;
			}

			this.listenForPenalty = true;
			this.opponentDefended = false;
		}
	}

	async processOpponentAttack(){
		await new Promise(r => setTimeout(r, 1000));

		let { x, y } = this.opponent.processAttack();

		let event = { offsetX: 0, offsetY: 0 };
		event.offsetX = x;
		event.offsetY = y;

		this.shootBall(event);
	}

	processOpponentDefense(endX){
		this.opponentDefended = this.opponent.processDefense();

		if(this.opponentDefended){
			this.opponent.isTweening = true;

			if(endX < this.opponent.position.x){
				endX -= 400; 
			}
			else{
				endX += 200;
			}
	
			timer.tween(this.opponent.position, ['x'], [endX], 1, () =>{
				this.opponent.isTweening = false;
			});
		}

	}

	determineEndState() {

		//player wins
		if (this.player.points > this.opponent.points) {
			stateMachine.change(GameStateName.Victory, {
				player: this.player,
				opponent: this.opponent
			});
		}

		//player loses
		else if (this.player.points < this.opponent.points) {
			stateMachine.change(GameStateName.GameOver, {
				player: this.player,
				opponent: this.opponent
			});
		}

		//tie, so continue the game
		else {
			this.suddenDeathMode = true;
			this.background.suddenDeathMode = true;
		}
	}
}

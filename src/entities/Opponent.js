import { getRandomPositiveInteger, didSucceedPercentChance } from "../../lib/RandomNumberHelpers.js";
import { timer } from "../globals.js";
import Background from "../objects/Background.js";
import GoalNet from "../objects/GoalNet.js";
import GameEntity from "./GameEntity.js";

export default class Opponent extends GameEntity {

    constructor(team, chanceOfAttack, chanceOfDefense) {
        super();

        this.currentSprite = GameEntity.DEFENDER_DEFAULT_SPRITE;

        this.team = team;
        this.idleDefender = true;

        this.chanceOfAttack = chanceOfAttack;
        this.chanceOfDefense = chanceOfDefense;
    }

    processAttack() {

        let ballX, ballY;

        if (didSucceedPercentChance(this.chanceOfAttack)) {
            ballX = getRandomPositiveInteger(GoalNet.START_X, GoalNet.END_X);
            ballY = getRandomPositiveInteger(GoalNet.START_Y, GoalNet.END_Y);
        }
        else {
            ballX = getRandomPositiveInteger(0, Background.WIDTH);
            ballY = getRandomPositiveInteger(0, Background.HEIGHT);
        }

        return { x: ballX, y: ballY };
    }

    processDefense() {
        return didSucceedPercentChance(this.chanceOfDefense);
    }
}
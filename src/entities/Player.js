import GameEntity from "./GameEntity.js";

export default class Player extends GameEntity {

    constructor(team){
        super();

        this.currentSprite = GameEntity.ATTACKER_DEFAULT_SPRITE;

        this.team = team;
        this.idleAttacker = true;
    }
}
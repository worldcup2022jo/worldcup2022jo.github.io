import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, context } from "../globals.js";
import Hitbox from "../../lib/Hitbox.js";
import Animation from "../../lib/Animation.js";

export default class GameEntity {

    static WIDTH = 40;
    static HEIGHT = 40;

    static ATTACKER_DEFAULT_SPRITE = 5;
    static ATTACKER_X = 600;
    static ATTACKER_Y = 750;
    static ATTACKER_SCALE = { x: 12, y: 12 };

    static DEFENDER_DEFAULT_SPRITE = 31;
    static DEFENDER_X = 785;
    static DEFENDER_Y = 295;
    static DEFENDER_SCALE = { x: 9, y: 9 };

    constructor() {
        this.position = 0;
        this.dimensions = 0;

        this.team = null;
        this.points = 0;
        this.penaltiesLeft = 5;

        this.sprites = GameEntity.generateSprites();
        this.currentAnimation = new Animation([0], 1, 1); //basic
        
        this.idleAttacker = false;
        this.idleDefender = false;
        this.idleAttackerAnimation = new Animation([5], 1, 1);
        this.idleDefenderAnimation = new Animation([31], 1, 1);

        this.isAttacking = false;
        this.isDefending = false;
        this.attackAnimation = new Animation([6, 7, 8, 3, 4, 5], 0.1, 1);
        this.defenseAnimation = new Animation([31, 33, 35], 0.1, 1);

        this.isTweening = false;

        this.hitbox = new Hitbox(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y, 'blue');
    }

    update(dt) {

        if(this.idleAttacker){
            this.currentAnimation = this.idleAttackerAnimation;
            this.position = { x: GameEntity.ATTACKER_X, y: GameEntity.ATTACKER_Y };
            this.dimensions = { x: GameEntity.WIDTH * GameEntity.ATTACKER_SCALE.x, y: GameEntity.HEIGHT * GameEntity.ATTACKER_SCALE.y };
        }

        else if (this.idleDefender){
            this.currentAnimation = this.idleDefenderAnimation;
            if(!this.isTweening){
                this.position = { x: GameEntity.DEFENDER_X, y: GameEntity.DEFENDER_Y };
            }
            this.dimensions = { x: GameEntity.WIDTH * GameEntity.DEFENDER_SCALE.x, y: GameEntity.HEIGHT * GameEntity.DEFENDER_SCALE.y };
        }

        else if(this.isAttacking){
            this.currentAnimation = this.attackAnimation;
            this.position = { x: GameEntity.ATTACKER_X, y: GameEntity.ATTACKER_Y };
            this.dimensions = { x: GameEntity.WIDTH * GameEntity.ATTACKER_SCALE.x, y: GameEntity.HEIGHT * GameEntity.ATTACKER_SCALE.y };
        }

        else if (this.isDefending) {
            this.currentAnimation = this.defenseAnimation;
            if(!this.isTweening){
                this.position = { x: GameEntity.DEFENDER_X, y: GameEntity.DEFENDER_Y };
            }
            this.dimensions = { x: GameEntity.WIDTH * GameEntity.DEFENDER_SCALE.x, y: GameEntity.HEIGHT * GameEntity.DEFENDER_SCALE.y };
        }

        this.currentAnimation.update(dt);

        //for debugging
        this.hitbox.set(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
        );
    }

    render() {
        //for debugging
        // this.hitbox.render(context);

        if (this.isAttacking || this.idleAttacker) {
            this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y, GameEntity.ATTACKER_SCALE);
        }
        else if(this.isDefending || this.idleDefender){
            this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y, GameEntity.DEFENDER_SCALE);
        }
    }

    static generateSprites() {
        return Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Player), GameEntity.WIDTH, GameEntity.HEIGHT);
    }

    attack(){
        this.attackAnimation = new Animation([6, 7, 8, 3, 4, 5], 0.1, 1);
        this.isAttacking = true;
        this.idleAttacker = false;
    }

    defend(){
        this.defenseAnimation = new Animation([31, 33, 35], 0.1, 1);
        this.isDefending = true;
        this.idleDefender = false;
    }
}
import GameObject from "./GameObject.js";
import GameEntity from "../entities/GameEntity.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import { context } from "../globals.js";
import Background from "./Background.js";

export default class Ball extends GameObject {

    static DEFAULT_X = Background.WIDTH / 2.08;
    static DEFAULT_Y = Background.HEIGHT / 1.3;
    static DEFAULT_SIZE = 35;

    constructor() {
        super(new Vector(Ball.DEFAULT_X, Ball.DEFAULT_Y), 
            new Vector(Ball.DEFAULT_SIZE, Ball.DEFAULT_SIZE));

        this.sprite = GameEntity.generateSprites()[22];
        this.hitbox = new Hitbox(Ball.DEFAULT_X, Ball.DEFAULT_Y, Ball.DEFAULT_SIZE * 2, Ball.DEFAULT_SIZE * 2, 'blue');
    }

    update(){
        this.hitbox.set(this.position.x, this.position.y, Ball.DEFAULT_SIZE * 2, Ball.DEFAULT_SIZE * 2);
    }

    render() {
        this.sprite.render(this.position.x, this.position.y, { x: 10, y: 10 });

        //for debugging
        // this.hitbox.render(context);
    }
}
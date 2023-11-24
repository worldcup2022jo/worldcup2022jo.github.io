import Vector from "../../lib/Vector.js";
import { context } from "../globals.js";
import GameObject from "./GameObject.js";

export default class GoalPost extends GameObject{

    static START_X = 503;
    static START_Y = 124;
    static END_X = 1416;
    static END_Y = 592;

    constructor(){
        super(new Vector(GoalPost.START_X, GoalPost.START_Y), 
        new Vector(GoalPost.END_X - GoalPost.START_X, GoalPost.END_Y - GoalPost.START_Y));
    }

    render(){
        this.renderGoalPostHitbox();
    }

    renderGoalPostHitbox(){
		context.save();
		context.lineWidth = 7;
		context.strokeStyle = 'blue';
		context.beginPath();
		context.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
		context.stroke();
		context.closePath();
		context.restore();
	}

}
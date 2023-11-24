import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import { context } from "../globals.js";
import GameObject from "./GameObject.js";

export default class GoalNet extends GameObject {

    static START_X = 598;
    static START_Y = 218;
    static END_X = 1321;
    static END_Y = 592;
    static DIMENSIONS_X = GoalNet.END_X - GoalNet.START_X;
    static DIMENSIONS_Y = GoalNet.END_Y - GoalNet.START_Y;

    static TOP_LEFT = new Hitbox(GoalNet.START_X, GoalNet.START_Y,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    static TOP_MIDDLE = new Hitbox(GoalNet.START_X + GoalNet.DIMENSIONS_X / 3, GoalNet.START_Y,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    static TOP_RIGHT = new Hitbox(GoalNet.START_X + ((GoalNet.DIMENSIONS_X / 3) * 2), GoalNet.START_Y,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    static BOTTOM_LEFT = new Hitbox(GoalNet.START_X, GoalNet.START_Y + GoalNet.DIMENSIONS_Y / 2,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    static BOTTOM_MIDDLE = new Hitbox(GoalNet.START_X + GoalNet.DIMENSIONS_X / 3, GoalNet.START_Y + GoalNet.DIMENSIONS_Y / 2,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    static BOTTOM_RIGHT = new Hitbox(GoalNet.START_X + ((GoalNet.DIMENSIONS_X / 3) * 2), GoalNet.START_Y + GoalNet.DIMENSIONS_Y / 2,
        GoalNet.DIMENSIONS_X / 3, GoalNet.DIMENSIONS_Y / 2);

    constructor() {
        super(new Vector(GoalNet.START_X, GoalNet.START_Y),
            new Vector(GoalNet.END_X - GoalNet.START_X, GoalNet.END_Y - GoalNet.START_Y));

        this.hitboxes = [
            GoalNet.TOP_LEFT,
            GoalNet.TOP_MIDDLE,
            GoalNet.TOP_RIGHT,
            GoalNet.BOTTOM_LEFT,
            GoalNet.BOTTOM_MIDDLE,
            GoalNet.BOTTOM_RIGHT
        ];

        this.hitboxSelected = -1;
    }

    render() {
        this.renderGoalNetHitbox();
        this.renderSixHitboxes();
    }

    renderGoalNetHitbox() {
        context.save();
        context.lineWidth = 7;
        context.strokeStyle = 'red';
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
        context.stroke();
        context.closePath();
        context.restore();
    }

    renderSixHitboxes() {
        context.save();
        context.lineWidth = 7;
        context.strokeStyle = 'red';
        context.beginPath();

        this.hitboxes.forEach(hitbox => {
            context.rect(hitbox.position.x, hitbox.position.y, hitbox.dimensions.x, hitbox.dimensions.y);
            context.stroke();
        });

        context.closePath();
        context.restore();
    }
}
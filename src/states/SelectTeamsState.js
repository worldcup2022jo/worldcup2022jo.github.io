import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import { sounds, context, keys, stateMachine } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import Background from "../objects/Background.js";
import Sprite from "../../lib/Sprite.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Hitbox from "../../lib/Hitbox.js";
import OpponentFactory from "../services/OpponentFactory.js";
import GameStateName from "../enums/GameStateName.js";

export default class SelectTeamsState extends State {

    static FLAG_SCALE = { x: 5, y: 5 };
    static X = Background.WIDTH / 5;
    static Y = Background.HEIGHT / 5;

    constructor() {
        super();
    }

    enter() {
        this.currentSelection = 0;
        this.countries = this.initializeCountries();
        this.countryFlags = this.initializeCountryFlags();
        this.countryHitboxes = this.initializeCountryHitboxes();

        this.playerTeamSelected = false;
        this.opponentTeamSelected = false;

        this.canvas = document.getElementsByTagName('canvas');
        this.canvas[0].addEventListener('click', (event) => {
            this.determineSelection(event);
        });
        this.font = '64px Heavy';

        this.inSelectTeamState = true;
    }

    exit() {
        sounds.stop(SoundName.Instrumental1);
        this.inSelectTeamState = false;
    }

    update(dt) {

        if(!this.inSelectTeamState){
            return;
        }

        if (keys.Enter) {

            keys.Enter = false;

            if (!this.playerTeamSelected) {
                this.player = new Player(this.countries[this.currentSelection]);
                this.playerTeamSelected = true;

                sounds.play(SoundName.Next);
            }

            else if (!this.opponentTeamSelected) {
                this.opponent = OpponentFactory.createInstance(this.countries[this.currentSelection])
                this.opponentTeamSelected = true;

                sounds.play(SoundName.Start);

                stateMachine.change(GameStateName.Play, {
                    player: this.player,
                    opponent: this.opponent
                });
            }
        }
    }

    render() {
		Background.renderDefault();
        this.renderText();
        this.renderCountryFlags();

        //for debugging
        // this.renderHitboxes();
    }

    determineSelection(event) {

        // to prevent this event listener in other states
        if(!this.inSelectTeamState) {
            return;
        }

        let selection = {
            position: { x: event.offsetX, y: event.offsetY },
            dimensions: { x: 1, y: 1 }
        }

        for (let i = 0; i < this.countryHitboxes.length; i++) {
            if (this.countryHitboxes[i].didCollide(selection)) {
                sounds.play(SoundName.Select);
                this.currentSelection = i;
            }
        }
    }

    initializeCountries() {
        return ['ned', 'usa',
            'arg', 'aus',
            'jpn', 'cro',
            'bra', 'kor',
            'eng', 'sen',
            'fra', 'pol',
            'mar', 'esp',
            'por', 'sui'];
    }

    initializeCountryFlags() {
        return [
            new Sprite(images.get(ImageName.Netherlands), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.UnitedStates), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Argentina), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Australia), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Japan), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Croatia), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Brazil), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Korea), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.England), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Senegal), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.France), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Poland), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Morocco), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Spain), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Portugal), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
            new Sprite(images.get(ImageName.Switzerland), 0, 0, Background.FLAG_SIZE, Background.FLAG_SIZE),
        ]
    }

    initializeCountryHitboxes() {
        let hitboxes = [];

        //row
        for (let i = 0; i < 4; i++) {

            //column
            for (let j = 0; j < 4; j++) {

                let x = SelectTeamsState.X * j + Background.WIDTH / 7.4;
                let y = SelectTeamsState.Y * i + Background.HEIGHT / 7.9;
                let dimensions = Background.FLAG_SIZE * 2.5;

                hitboxes.push(new Hitbox(x, y, dimensions, dimensions, 'blue'));
            }
        }

        return hitboxes;
    }

    renderText() {
        context.fillStyle = 'white';
        context.font = this.font;
        context.textAlign = 'center';

        if (!this.playerTeamSelected) {
            context.fillText(`Pick your team!   |   Team picked: ${this.countries[this.currentSelection].toUpperCase()}`, Background.WIDTH / 2, 100);
            context.fillText(`Press [enter] to continue`, Background.WIDTH / 2, Background.HEIGHT / 1.05);

        }
        else {
            context.fillText(`Pick your opponent's team!    |    Team picked: ${this.countries[this.currentSelection].toUpperCase()}`, Background.WIDTH / 2, 100);
            context.fillText(`Press [enter] to start!`, Background.WIDTH / 2, Background.HEIGHT / 1.05);
        }

    }

    renderCountryFlags() {

        //row
        for (let i = 0; i < 4; i++) {

            //column
            for (let j = 0; j < 4; j++) {

                this.countryFlags[i * 4 + j].render(SelectTeamsState.X * j + Background.WIDTH / 8, SelectTeamsState.Y * i + Background.HEIGHT / 9, SelectTeamsState.FLAG_SCALE);
            }
        }
    }

    renderHitboxes() {

        //row
        for (let i = 0; i < 4; i++) {

            //column
            for (let j = 0; j < 4; j++) {

                let x = SelectTeamsState.X * j + Background.WIDTH / 7.4;
                let y = SelectTeamsState.Y * i + Background.HEIGHT / 7.9;
                let dimensions = Background.FLAG_SIZE * 2.5;

                context.save();
                context.lineWidth = 7;
                context.strokeStyle = 'red';
                context.beginPath();
                context.rect(x, y, dimensions, dimensions);
                context.stroke();
                context.closePath();
                context.restore();
            }
        }
    }
}

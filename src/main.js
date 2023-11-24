/**
 * Game Name: 
 * World Cup 2022
 *
 * Authors: 
 * Jeremy Oroc
 *
 * Brief description:
 * It's the World Cup 2022 Finals. The player's favorite team is playing against the player's least favorite team. 
 * Both teams are tied in score after the normal time and extra time have expired, therefore they must do a penalty shoot-out. 
 * For the penalty shots, each team must shoot five penalties. 
 * Determined to win, the player must beat their opponent team in this sports genre game by scoring more goals than them.
 *
 * Asset sources
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import VictoryState from "./states/VictoryState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import SelectTeamsState from "./states/SelectTeamsState.js";
import RecentGamesStates from "./states/RecentGamesState.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.SelectTeams, new SelectTeamsState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.RecentGames, new RecentGamesStates());
stateMachine.add(GameStateName.Play, new PlayState());

stateMachine.change(GameStateName.TitleScreen);

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();

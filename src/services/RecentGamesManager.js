import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { MAX_RECENT_GAMES } from "../globals.js";
import OpponentFactory from "./OpponentFactory.js";

/**
 * This class is responsible for reading and writing the high scores
 * of our game to and from the browser's local storage. Local storage
 * is a simple way to store small key/value pairs (kind of like cookies)
 * for a particular domain on your browser.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
export default class RecentGamesManager {

	static loadRecentGames() {
		/**
		 * Since the high scores are being saved as a string containing JSON,
		 * we must parse the string into a valid JavaScript object in order
		 * to manipulate it.
		 */
		const recentGames = JSON.parse(localStorage.getItem('recentGames')) ?? [];

		if (recentGames.length === 0) {
            
			// If there are no scores, we want to populate the scores array with placeholders.
			let player = new Player('por')
			let opponent = OpponentFactory.createInstance('mar');

			for (let i = 0; i < MAX_RECENT_GAMES; i++) {
				recentGames.push({ player: player, opponent: opponent});
			}

			/**
			 * Since the high scores are represented as a JavaScript object,
			 * we must turn the object into a string in order to be able to
			 * save it using local storage.
			 */
			localStorage.setItem('recentGames', JSON.stringify(recentGames));
		}

		return recentGames;
	}

	static addRecentGame(player, opponent) {
		let recentGames = RecentGamesManager.loadRecentGames();

		// Add the new score to the high scores array.
        recentGames.unshift({ player: player, opponent: opponent })

		/**
		 * Only keep the top 10 scores.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
		 */
		recentGames = recentGames.slice(0, MAX_RECENT_GAMES);

		/**
		 * Since the high scores are represented as a JavaScript object,
		 * we must turn the object into a string in order to be able to
		 * save it using local storage.
		 */
		localStorage.setItem('recentGames', JSON.stringify(recentGames));
	}
}

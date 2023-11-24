import Opponent from "../entities/Opponent.js";
import ImageName from "../enums/ImageName.js";

export default class OpponentFactory {

    static createInstance(country) {

        //country, chanceOfAttack, chanceOfDefense
        switch (country) {
            case ImageName.Netherlands:
                return new Opponent(country, 0.45, 0.4);
            case ImageName.UnitedStates:
                return new Opponent(country, 0.4, 0.35);
            case ImageName.Argentina:
                return new Opponent(country, 0.55, 0.5);
            case ImageName.Australia:
                return new Opponent(country, 0.35, 0.4);
            case ImageName.Japan:
                return new Opponent(country, 0.45, 0.35);
            case ImageName.Croatia:
                return new Opponent(country, 0.55, 0.5);
            case ImageName.Brazil:
                return new Opponent(country, 0.5, 0.4);
            case ImageName.Korea:
                return new Opponent(country, 0.4, 0.35);
            case ImageName.England:
                return new Opponent(country, 0.45, 0.4);
            case ImageName.Senegal:
                return new Opponent(country, 0.35, 0.4);
            case ImageName.France:
                return new Opponent(country, 0.55, 0.5);
            case ImageName.Poland:
                return new Opponent(country, 0.4, 0.35);
            case ImageName.Morocco:
                return new Opponent(country, 0.45, 0.6);
            case ImageName.Spain:
                return new Opponent(country, 0.4, 0.35);
            case ImageName.Portugal:
                return new Opponent(country, 0.5, 0.5);
            case ImageName.Switzerland:
                return new Opponent(country, 0.4, 0.35);
        }
    }
}

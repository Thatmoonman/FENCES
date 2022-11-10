import Player from "./Player"

export default class HumanPlayer extends Player {
    constructor(color) {
        // super(fences, fences)
        super(color, color)

    }
}
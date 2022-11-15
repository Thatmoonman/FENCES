import Player from "./Player"

export default class HumanPlayer extends Player {
    constructor(color, fences, totalFences, movesUntilNewFence, token) {
        super(
            color, color, 
            fences, fences, 
            totalFences, totalFences,
            movesUntilNewFence, movesUntilNewFence, 
            token, token
        )
        this.selector
    }

}
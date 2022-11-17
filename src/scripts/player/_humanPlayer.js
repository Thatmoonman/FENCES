import Player from "./Player"

export default class HumanPlayer extends Player {
    constructor(color, fences, totalFences, movesUntilNewFence, token, moves) {
        super(
            color, color, 
            fences, fences, 
            totalFences, totalFences,
            movesUntilNewFence, movesUntilNewFence, 
            token, token
        )
        this.selectorIcon
        this.onceperturn = true
    }

}
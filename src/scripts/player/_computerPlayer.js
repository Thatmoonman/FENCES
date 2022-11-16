import Player from "./Player";


export default class ComputerPlayer extends Player {
    constructor(color, fences, totalFences, movesUntilNewFence, token, moves) {
        super(
            color, color, 
            fences, fences,
            totalFences, totalFences,
            movesUntilNewFence, movesUntilNewFence, 
            token, token
            )

        this.watchPlayer = {
            "moves": 0,
            "fences": 0
        }

        this.goal
    }

    computerTurnLogic() {
        let moveChance = .6
        let moveDifferential = this.watchPlayer["moves"] - this.watchPlayer["fences"]

        if (moveDifferential === 0) {
            moveChance += 0
        } else if (moveDifferential === 1) {
            moveChance -= .1
        } else if (moveDifferential === 2) {
            moveChance -= .2
        } else if (moveDifferential === 3) {
            moveChance -= .3
        } else if (moveDifferential === -1) {
            moveChance += .1
        } else if (moveDifferential === -2) {
            moveChance += .2
        } else if (moveDifferential === -3) {
            moveChance += .3
        }
        
        let logic = Math.random() * 1
        if (logic < moveChance) {
            return "move"
        } else {
            return "fence"
        }
    }
}
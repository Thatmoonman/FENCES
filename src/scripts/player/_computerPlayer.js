import Player from "./Player";


export default class ComputerPlayer extends Player {
    constructor(color, fences, totalFences, movesUntilNewFence, token) {
        super(
            color, color, 
            fences, fences,
            totalFences, totalFences,
            movesUntilNewFence, movesUntilNewFence, 
            token, token)
    }

    playTurn() {
        /*logic for choosing whether to move or fence
        HELPER FUNC NEED:
            maze solver
            move token
            place fence
        */

        //FOR DEV
        return "move"
    }
}
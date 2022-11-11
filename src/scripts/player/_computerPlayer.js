import Player from "./Player";


export default class ComputerPlayer extends Player {
    constructor(color, fences, movesUntilNewFence, token) {
        super(
            color, color, 
            fences, fences, 
            movesUntilNewFence, movesUntilNewFence, 
            token, token)
    }
}
import Player from "./Player";


export default class ComputerPlayer extends Player {
    constructor(color) {
        // super(fences, fences)
        super(color, color)
    }
}
import Fence from "../piece/_Fence"
import Token from "../piece/_Token"

export default class Player {
    constructor(color) {
        this.color = color
        this.fences = []
        this.totalFences = 0
        this.token = new Token(color, null, this)
        this.movesUntilNewFence = 5
    }

    addFence() {
        let fence = new Fence(this.color)
        this.fences.push(fence)
        this.totalFences += 1
        return true
    }

    playTurn() {
        console.log("NOT SELECTING COMPUTER PLAYER")
    }
}
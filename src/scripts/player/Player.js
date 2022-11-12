import Fence from "../piece/_Fence"
import Token from "../piece/_Token"

export default class Player {
    constructor(color) {
        this.color = color
        this.fences = []
        this.token = new Token(color, null, this)
        this.movesUntilNewFence = 0
    }

    addFence() {
        let fence = new Fence(this.color)
        this.fences.push(fence)
        this.movesUntilNewFence = this.totalFences() + 1 
        return true
    }

    totalFences() {
        return this.fences.length
    }

    playTurn() {
        console.log("NOT SELECTING COMPUTER PLAYER")
    }
}
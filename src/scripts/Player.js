import Fence from "./_Fence"
import Token from "./_Token"

export default class Player {
    constructor(color) {
        this.color = color
        this.fences = []
        this.token = new Token(color)
        this.totalFences = 0
        this.movesUntilNextFence = 0
    }

    addFence() {
        let fence = new Fence(this.color)
        this.fences.push(fence)
        this.totalFences++
        this.movesUntilNextFence = this.totalFences + 1
    }
}
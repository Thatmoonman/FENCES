import Piece from "./Piece"

export default class Token extends Piece {
    constructor() {
        super(color, color)
    }

    myToken(player) {
        return this.color === player.color
    }
}
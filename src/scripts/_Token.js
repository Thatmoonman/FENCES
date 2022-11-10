import Piece from "./Piece"

export default class Token extends Piece {
    constructor() {
        super(color, color)
        super(pos, pos)
    }

    myToken(player) {
        return this.color === player.color
    }
}
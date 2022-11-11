import Piece from "./Piece"

export default class Token extends Piece {
    constructor(color, pos) {
        super(color, color, pos, pos)
    }

    myToken(player) {
        return this.color === player.color
    }

    setPos(pos) {
        this.pos = pos
    }

}
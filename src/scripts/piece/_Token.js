import Piece from "./Piece"

export default class Token extends Piece {
    constructor(color, pos, player) {
        super(color, color, pos, pos)
        this.player = player
    }

    myToken(player) {
        return this.color === player.color
    }

    setPos(pos) {
        this.pos = pos
    }

}
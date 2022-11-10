const Piece = require("./Piece")

export default class Token extends Piece {
    constructor(player=true) {
        super(color, color)
        this.player = player
    }
}
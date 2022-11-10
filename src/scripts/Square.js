const Piece = require("./Piece")

class Square {
    constructor(pos, type) {
        this.pos = pos
        this.type = type
        this.holds = []
    }

    token() {
        return this.holds[0].toString()
    }
}

module.exports = Square
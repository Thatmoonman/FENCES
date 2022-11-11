import Piece from "./Piece";

export default class Fence extends Piece {
    constructor(color, dir="left") {
        super(color, color)
        this.dir = dir
        this.startPos = null
        this.endPos = null
    }

    changeDir(dir) {
        this.dir = dir
    }

    setStartPos(pos) {
        this.startPos = pos
    }

    getEndPos(startPos, dir) {
        dirCipher = {
            "up": [0, 2],
            "down": [0, -2],
            "left": [-2, 0],
            "right": [2, 0]
        }

        let posX = startPos[0]
        let posY = startPos[1]
        let dirX = dirCipher[dir][0]
        let dirY = dirCipher[dir][1]

        return [posX + dirX, posY + dirY]
    }
}
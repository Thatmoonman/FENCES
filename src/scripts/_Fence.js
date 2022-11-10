import Piece from "./Piece";

export default class Fence extends Piece() {
    constructor(dir="left") {
        super(color, color)
        this.dir = dir
        super(startPos, pos)
        this.endPos = getEndPos(pos, dir)
    }

    changeDir(dir) {
        this.dir = dir
    }

    getEndPos(pos, dir) {
        dirCipher = {
            "up": [0, 2],
            "down": [0, -2],
            "left": [-2, 0],
            "right": [2, 0]
        }

        let posX = pos[0]
        let posY = pos[1]
        let dirX = dirCipher[dir][0]
        let dirY = dirCipher[dir][1]

        return [posX + dirX, dirY, dirX]
    }
}
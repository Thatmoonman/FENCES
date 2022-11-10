const Board = require("./Board")
const Piece = require("./Piece")

class Game {
    constructor(playerColor="Red", computerColor="Blue") {
        this.board = new Board()
        this.newGame(playerColor, computerColor)
    }

    newGame(playerColor, computerColor) {
        this.board.fillGrid(playerColor, computerColor)
    }
}

let g = new Game()
g.board.render()
// console.log(g.board.board[0][8].token())

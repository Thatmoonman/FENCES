const Square = require("./Square")
const Piece = require("./Piece")

class Board {
    constructor() {
        this.grid = []
        this.buildBoard()
    }

    buildBoard() {
        for (let i = 0 ; i < 17; i++) {
            let row = []

            for (let j = 0; j < 17; j++) {

                let pos = [i, j]
                let type = ""
                let iEven = (i + 2) % 2 === 0 
                let jEven = (j + 2) % 2 === 0
                
                if (iEven && jEven) {
                    type = "token"
                } else if (iEven && !jEven || !iEven && jEven) {
                    type = "fence"
                } else {
                    type = "node"
                }
                
                let square = new Square(pos, type)
                row.push(square)
            }
            this.grid.push(row)
        }
    }

    fillGrid(playerColor, computerColor) {
        const playerToken = new Piece(playerColor)
        const computerToken = new Piece(computerColor, false)

        const computerStart = this.grid[0][8]
        computerStart.holds.push(computerToken)
        
        const playerStart = this.grid[16][8]
        playerStart.holds.push(playerToken)
    }

    render() {
        this.grid.forEach( row => {
            let renderRow = []

            row.forEach( square => {
                
                if (square.type === "token") {
                    if (square.holds.length) {
                        renderRow.push(`[${square.token()}]`)
                    } else {
                        renderRow.push("[ ]")
                    }
                } else if (square.type === "fence") {
                    renderRow.push("   ")
                } else {
                    renderRow.push(" o ")
                }
            })

            console.log(renderRow.join(""))
        })
    }
}

// const b = new Board()
// b.render()
// console.log(b.board)
// console.log(b.board[1])
// console.log(b.board[1][0])
// console.log(b.board[1][0].pos)


module.exports = Board
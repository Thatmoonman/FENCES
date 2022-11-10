import Square from "./Square"
import Piece from "./Piece"

export default class Board {
    constructor() {
        this.grid = []
        this.buildBoard()
    }

    buildBoard() {
        for (let i = 0 ; i < 17; i++) {
            let row = []

            for (let j = 0; j < 17; j++) {

                let pos = [j, i]
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

    fillGrid(humanPlayer, computerPlayer) {
        const playerToken = new Piece(humanPlayer.color)
        const computerToken = new Piece(computerPlayer.color)

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

    getSquare(pos) {
        let posX = pos[0]
        let posY = pos[1]
        return this.grid[posX][posY]
    }

    moveToken(newPos) {
        this.grid.getSquare().holds()
    }
}


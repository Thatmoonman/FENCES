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
        const playerStart = this.grid[16][8]
        const playerToken = new Piece(humanPlayer.color, [16, 8])
        playerStart.holds.push(playerToken)

        const computerStart = this.grid[0][8]
        const computerToken = new Piece(computerPlayer.color, [0, 8])
        computerStart.holds.push(computerToken)
        
    }

    render() {
        
        this.grid.forEach( (row, i) => {
            let gameBoard = document.getElementById("gameBoard")
            let renderRow = document.createElement("ul")

            row.forEach( square => {
                
                if (square.type === "token") {
                    if (square.holds.length) {
                        let tokenStart = document.createElement("li")
                        tokenStart.innerText = square.token()
                        tokenStart.setAttribute("class", "square")
                        renderRow.appendChild(tokenStart)
                    } else {
                        let emptySquare = document.createElement("li")
                        emptySquare.setAttribute("class", "square")
                        renderRow.appendChild(emptySquare)
                    }
                } else if (square.type === "fence" && i % 2 === 0) {
                    let fencePath = document.createElement("li")
                    fencePath.setAttribute("class", "verticalFence")
                    renderRow.appendChild(fencePath)
                } else if (square.type === "fence") {
                    let fencePath = document.createElement("li")
                    fencePath.setAttribute("class", "horizontalFence")
                    renderRow.appendChild(fencePath)
                } else {
                    let fenceNode = document.createElement("li")
                    fenceNode.setAttribute("class", "node")
                    renderRow.appendChild(fenceNode)
                }
            })
            gameBoard.appendChild(renderRow)
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


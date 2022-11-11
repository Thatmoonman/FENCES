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
        const playerStart = this.getSquare([8, 16])
        humanPlayer.token.pos = playerStart
        const playerToken = humanPlayer.token
        playerStart.addToken(playerToken)

        const computerStart = this.getSquare([8, 0])
        computerPlayer.token.pos = computerStart
        const computerToken = computerPlayer.token
        computerStart.addToken(computerToken)
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
                        tokenStart.setAttribute("data-pos", square.pos)
                        renderRow.appendChild(tokenStart)
                    } else {
                        let emptySquare = document.createElement("li")
                        emptySquare.setAttribute("class", "square")
                        emptySquare.setAttribute("data-pos", square.pos)
                        renderRow.appendChild(emptySquare)
                    }
                } else if (square.type === "fence" && i % 2 === 0) {
                    let fencePath = document.createElement("li")
                    fencePath.setAttribute("class", "verticalFence")
                    fencePath.setAttribute("data-pos", square.pos)
                    renderRow.appendChild(fencePath)
                } else if (square.type === "fence") {
                    let fencePath = document.createElement("li")
                    fencePath.setAttribute("class", "horizontalFence")
                    fencePath.setAttribute("data-pos", square.pos)
                    renderRow.appendChild(fencePath)
                } else {
                    let fenceNode = document.createElement("li")
                    fenceNode.setAttribute("class", "node")
                    fenceNode.setAttribute("data-pos", square.pos)
                    renderRow.appendChild(fenceNode)
                }
            })
            gameBoard.appendChild(renderRow)
        })
    }

    getSquare(pos) {
        let posY = pos[0]
        let posX = pos[1]
        return this.grid[posX][posY]
    }

}


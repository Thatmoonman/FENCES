import Fence from "../piece/_Fence"
import Square from "./Square"

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
                        let tokenStart = this.buildSpace("li", "playerSquare", square.pos)
                        tokenStart.innerText = square.token()
                        renderRow.appendChild(tokenStart)
                    } else {
                        let emptySquare = this.buildSpace("li", "square", square.pos)
                        renderRow.appendChild(emptySquare)
                    }
                } else if (square.type === "fence" && i % 2 === 0) {
                    let fenceSpace = this.buildSpace("li", "verticalFence", square.pos)
                    renderRow.appendChild(fenceSpace)                    
                } else if (square.type === "fence") {
                    let fenceSpace = this.buildSpace("li", "horizontalFence", square.pos)
                    renderRow.appendChild(fenceSpace)                    
                } else {
                    let nodeSpace = this.buildSpace("li", "node", square.pos)
                    renderRow.appendChild(nodeSpace)                   
                }
            })
            gameBoard.appendChild(renderRow)
        })
    }

    buildSpace(ele, classAttr, pos) {
        let newEle = document.createElement(`${ele}`)
        newEle.setAttribute("class", classAttr)
        newEle.setAttribute("data-pos", pos)
        return newEle
    }

    getSquare(pos) {
        let posY = parseInt(pos[0])
        let posX = parseInt(pos[1])
        
        return this.grid[posX][posY]
    }

    validMoveToken(pos) {
        const startPos = [parseInt(pos[0]), parseInt(pos[1])]
        
        const fencePlacements = [[1,0], [-1, 0], [0, 1], [0, -1]]
        const validMovements = [[2, 0], [-2, 0], [0, 2], [0, -2]]
        const fenceJumpPlacements = [[3, 0], [-3, 0], [0, 3], [0, -3]]
        const validJumpMovements = [[4, 0], [-4, 0], [0, 4], [0, -4]]

        const validMoves = []
        
        for (let i = 0; i < 4; i++) {

            let fencePos = [
                startPos[0] + fencePlacements[i][0],
                startPos[1] + fencePlacements[i][1]
            ]
            let fenceJumpPos = [
                startPos[0] + fenceJumpPlacements[i][0],
                startPos[1] + fenceJumpPlacements[i][1]
            ]
            let movePos = [
                startPos[0] + validMovements[i][0],
                startPos[1] + validMovements[i][1]
            ]
            let jumpPos = [
                startPos[0] + validJumpMovements[i][0],
                startPos[1] + validJumpMovements[i][1]
            ]

            let inbounds = true
            let jumpInbounds = true
            
            for (let j = 0; j < 2; j++) {
                if (movePos[j] < 0 || movePos[j] > 16) {
                    inbounds = false
                    jumpInbounds = false
                } else if (jumpPos[j] < 0 || jumpPos[j] > 16) {
                    jumpInbounds = false;
                }
            }

            if (inbounds && this.getSquare(fencePos).filled()) {
                continue;
            } else if (inbounds && !this.getSquare(movePos).filled()) {
                validMoves.push(movePos)
            } else if (jumpInbounds && !this.getSquare(fenceJumpPos).filled()) {
                validMoves.push(jumpPos)
            }

        }
        return validMoves
    }

    validMoveFence() {}
        //if fence move, dupes grid, places fence, and checkes that grid is still solveable for both players.
        // #gridDup(grid), #solveforPlayer(player)
    

}


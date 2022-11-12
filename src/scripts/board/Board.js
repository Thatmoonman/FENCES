import Fence from "../piece/_Fence"
import HumanPlayer from "../player/_humanPlayer"
import Square from "./Square"

export default class Board {
    constructor(humanPlayer, computerPlayer) {
        this.grid = []
        this.players = [humanPlayer, computerPlayer]
        this.buildBoard()
    }

    buildBoard() {
        
        for (let i = 0; i < 17; i++) {
            let row = []
            
            for (let j = 0; j < 17; j++) {
                
                let edgeNodesHold = 0
                let pos = [j, i]
                let type = ""
                let iEven = (i + 2) % 2 === 0 
                let jEven = (j + 2) % 2 === 0
                
                if (iEven && jEven) {
                    type = "token"
                } else if (iEven && !jEven || !iEven && jEven) {
                    type = "fence"
                } else if (
                    i === 1 && j === 1 
                    || i === 1 && j === 15 
                    || i === 15 && j === 1
                    || i === 15 && j === 15
                    ) {
                        type = "node"
                        edgeNodesHold = 2
                } else if (i === 1 || i === 15 || j === 1 || j === 15) {
                    type = "node"
                    edgeNodesHold = 1
                } else {
                    type = "node"
                }
                
                let square = new Square(pos, type)
        
                for (let i = 0; i < edgeNodesHold; i++) {     
                    square.addToken("BLOCK")
                }
                    
                
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
                    if (square.holds.length) {
                        fenceSpace.style.backgroundColor = square.holds[0]
                    }
                    renderRow.appendChild(fenceSpace)             
                } else if (square.type === "fence") {
                    let fenceSpace = this.buildSpace("li", "horizontalFence", square.pos)
                    if (square.holds.length) {
                        fenceSpace.style.backgroundColor = square.holds[0]
                    }
                    renderRow.appendChild(fenceSpace)                    
                } else {
                    let nodeSpace = this.buildSpace("li", "node", square.pos)
                    renderRow.appendChild(nodeSpace)                   
                }
            })
            gameBoard.appendChild(renderRow)
        })
    

        this.players.forEach( player => {
            let fenceBox

            if (player instanceof HumanPlayer) {
                fenceBox = document.getElementById("humanPlayerFences")
            } else {
                fenceBox = document.getElementById("computerPlayerFences")
            }

            while (fenceBox.firstChild) {
                fenceBox.removeChild(fenceBox.firstChild)
            }
            
            let fences = player.fences.length
            
            for (let i = 0; i < fences; i++) {
                let fence = document.createElement("li")
                fence.style.backgroundColor = player.color
                fenceBox.appendChild(fence)
            }
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

    nodeFree(nodePos) {
        const node = this.getSquare(nodePos)
        if (node.holds.length < 4) {
            return true
        } else {
            return false
        }
    }


    validMoveFence(nodePos) {
        
        const fencePlacements = [
            [[1, 0], [3, 0]],
            [[-1, 0], [-3, 0]],
            [[0, 1], [0, 3]],
            [[0, 1], [0, -3]] 
        ]

        const midNodePlacements = [
            [2, 0], [-2, 0], [0, 2], [0, -2]
        ]

        const endNodePlacements = [
            [4, 0], [-4, 0], [0, 4], [0, -4]
        ]
        
        const validFences = []

        for (let i = 0; i < 4; i++) {

            let fencePlacement = [
                [nodePos[0] + fencePlacements[i][0][0],
                nodePos[1] + fencePlacements[i][0][1]],
                [nodePos[0] + fencePlacements[i][1][0],
                nodePos[1] + fencePlacements[i][1][1]]
            ]

            let midNode = [
                nodePos[0] + midNodePlacements[i][0],
                nodePos[1] + midNodePlacements[i][1]
            ]

            let endNode = [
                nodePos[0] + endNodePlacements[i][0],
                nodePos[1] + endNodePlacements[i][1]
            ]
           

            let inbounds = true
            let free = true
            let notCrossing = true
            let solvable = true
            let validFence

            if (endNode[0] < 0 || endNode[0] > 16 || endNode[1] < 0 || endNode[1] > 16) {
                inbounds = false
            } else if (this.getSquare(fencePlacement[0]).filled() || this.getSquare(fencePlacement[1]).filled()) {
                free = false
            } else if (this.getSquare(midNode).holds.includes("MID")) {
                notCrossing = false
            } else if (!this.solvable(nodePos, fencePlacement)){
                   solvable = false
            }

            if (inbounds && free && notCrossing && solvable) {
                validFence = {
                    "fences": fencePlacement,
                    "midNode": midNode,
                    "endNode": endNode
                }
                validFences.push(validFence)
            }
        }
    
        return validFences
    }
        //if fence move, dupes grid, places fence, and checkes that grid is still solveable for both players.
        // #gridDup(grid), #solveforPlayer(player)

    solvable(nodePos, fencePlacement) {
        return true
    }

}


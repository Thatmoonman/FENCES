import PolyTreeNode from "./polytreenode"

export default class MazePath {
    constructor(startPos, endPos, grid) {
        this.grid = grid
        this.startPos = startPos
        this.endPos = endPos
        this.rootNode = new PolyTreeNode(startPos)
        this.consideredPositions = []
        
        this.buildMoveTree(this.rootNode)
    }

    buildMoveTree(rootNode) {
        const moves = [rootNode]

        while (moves.length) {
            let currentNode = moves.shift()
            let currentChildren = this.newMovePositions(currentNode.value)
    
            currentChildren.forEach(child => {
                if (!this._alreadyConsidered(child)) {
                    let childNode = new PolyTreeNode(child)
                    currentNode.addChildren(childNode)
                    moves.push(childNode)
                }
            })
        }
        return this.rootNode
    }

    newMovePositions(pos) {
        let newPos = this.validMoves(pos)
        newPos = newPos.filter(pos => !this._alreadyConsidered(pos))
        this.consideredPositions.push(pos)
        return newPos
    }

    validMoves(startPos) {
        const fenceCheck = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        const moves = [[2, 0], [-2, 0], [0, 2], [0, -2]]
 
        let fenceCheckMoves = fenceCheck.map( pos => {
            return [pos[0] + startPos[0], pos[1] + startPos[1]]
        })
        
        let possibleValidMoves = moves.map( pos => {
            return [pos[0] + startPos[0], pos[1] + startPos[1]]
        })

        let newValidMoves = []

        for (let i = 0; i < 4; i++) {
            let onboard = true
            let nofence = true
            let unvisitted = true

            let pos = possibleValidMoves[i]
            let fence = fenceCheckMoves[i]

            if (pos[0] < 0 || pos[1] < 0 || pos[0] > 16 || pos[1] > 16) {
                onboard = false     //move is off the board  
            } else if (fence[0] >= 0 && fence[1] >= 0 && fence[0] <= 16 && fence[1] <= 16 && !this._at(fence)) {
                nofence = false //fence in the way
            } else if (this._alreadyConsidered(pos)) {
                unvisitted = false //already visitted
            }
 
            if (onboard && nofence && unvisitted) {
                newValidMoves.push(pos)
            }
        }

        return newValidMoves
    }

    findDFS(target) {
        return this.rootNode.dfs(target)
    }

    findBFS(target) {
        return this.rootNode.bfs(target)
    }

    //Find symbol at pos in grid
    _at(pos) {
        return this.grid[pos[1]][pos[0]]
    }

    //check if pos has been visitted already
    _alreadyConsidered(pos) {
        for (let i = 0; i < this.consideredPositions.length; i++) {
            if (this.consideredPositions[i][0] === pos[0] && this.consideredPositions[i][1] === pos[1]) {
                    return true
            }
        }
        return false
    }

    _atEnd(pos) {
        return this.endPos[0] === pos[0] && this.endPos[1] === pos[1]
    }
}
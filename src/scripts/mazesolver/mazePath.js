import PolyTreeNode from "./polytree"

export default class MazePath {
    constructor(startPos, endPos, grid) {
        this.grid = grid
        this.startPos = startPos
        this.endPos = endPos
        this.rootNode = new PolyTreeNode(startPos)
        this.consideredPositions = []
        
        this.buildMoveTree(this.rootNode)
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
            function fence() {
                return this._at(fenceCheckMoves[i])
            }

            if (pos[0] < 0 || pos[1] < 0 || pos[0] > 16 || pos[1] > 16) {
                onboard = false     //move is on the board  
            } else if (fence[0] >= 0 && !fence() || fence[1] >= 0 && !fence() || fence[0] > 16 && !fence() || fence[1] > 16 && !fence()) {
                nofence = false     //there is no fence blocking
            } else if (this._alreadyConsidered(pos)) {
                unvisitted = false //already visitted
            }
 
            if (onboard && nofence && unvisitted) {
                newValidMoves.push(pos)
            }
        }

        return newValidMoves
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

    tracePathBack() {

    }

    findDFS(target) {
        return this.rootNode.dfs(target)
    }

    findBFS(target) {

    }

    //Find symbol at pos in grid
    _at(pos1, pos2=[0,0]) {
        let newPos = [pos1[0] + pos2[0], pos1[1] + pos2[1]]
        return this.grid[newPos[0]][newPos[1]]
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
import PolyTreeNode from "./polytree"

export default class MazePath {
    constructor(startPos) {
        this.startPos = startPos
        this.rootNode = new PolyTreeNode(startPos)
        this.consideredPositions = [startPos]
        this.buildMoveTree(this.rootNode)
    }

    validMoves(startPos) {
        const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        let newValidMoves = moves.map( pos => {
            return [pos[0] + startPos[0], pos[1] + startPos[1]]
        })

        newValidMoves = newValidMoves.filter(pos => {
            pos[0] >= 0 && pos[1] >= 0 && pos[1] <= 16 && pos[1] <= 16
        })

        return newValidMoves
    }

    

    buildMoveTree(rootNode) {

        const moves = [rootNode]

        while (moves.length) {
            let currentNode = moves.shift()
            let currentChildren = newMovePositions(currentNode.value)
            currentChildren.forEach(child => {
                let childNode = new PolyTreeNode(child)
                currentNode.addChildren(childNode)
                moves.push(childNode)
            })

        }

    }

    newMovePositions(pos) {
        let newPos = this.validMoves(pos)
        newPos = newPos.filter(pos => !this.consideredPositions.includes(pos))
        this.consideredPositions.push(pos)
        return newPos
    }

    tracePathBack() {

    }

    findDFS() {

    }

    findBFS() {
        
    }

}
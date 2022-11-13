import HumanPlayer from "../player/_humanPlayer"
import MazePath from "./mazePath"

export default class MazeSolver {
    constructor(currentPlayer, opponent, grid) {
        this.grid = grid
        this.currentPlayer = currentPlayer
        this.opponent = opponent

        const startPos = currentPlayer.token.getPos()
        const endPosArray = this.getEndPos(currentPlayer)

        this.canSolve = this.isSolvable(startPos, endPosArray)
    }

    getEndPos(player) {
        if (player instanceof HumanPlayer) {
            return [
                [0,0],[2,0],
                [4,0],[6,0],
                [8,0],[10,0],
                [12,0],[14,0],
                [16,0]
            ]
        } else {
            return [
                [0,16],[2,16],
                [4,16],[6,16],
                [8,16],[10,16],
                [12,16],[14,16],
                [16,16]
            ]
        }
    }

    isSolvable(startPos, endPosArray) {
        let endPos
        
        for (let i = 0; i < endPosArray.length; i++) {
            let tree = new MazePath(startPos, endPosArray[i], this.grid)
            endPos = tree.findDFS(endPosArray[i])
            if (endPos) break;
        }

        return !!endPos
    }


        
   
        /*iterate through every position ***can stop once you find one path to end***
            iterate through moves, checking for valid move; 
            valid move means on board, filled with "X" no 0 (truthy not falsy), and not already visitted
            if valid move, continue recursive call on move pos until end is reached or no more possible moves
            continue up and down each branch (dfs) until end is found, then return TRUE
        */
        

    /*DFS: 
        STACK: ARRAY with push/pop
        -> push until we hit an end
        --> end means no empty squares that have not been visited yet
    */

    // _at(pos1, pos2=[0,0]) {
    //     let newPos = [pos1[0] + pos2[0], pos1[1] + pos2[1]]
    //     return this.grid[newPos[1]][newPos[0]]
    // }

    // _compareArrays(pos1, pos2) {
    //     return parseInt(pos1[0]) === parseInt(pos2[0]) && parseInt(pos1[1]) === parseInt(pos2[1])
    // }

}


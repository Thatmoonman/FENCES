import HumanPlayer from "../player/_humanPlayer"

export default class MazeSolver {
    constructor(currentPlayer, opponent, grid) {
        this.grid = grid
        this.currentPlayer = currentPlayer
        this.opponent = opponent

        const startPos = currentPlayer.token.getPos()
        const endPosArray = this.getEndPos(currentPlayer)

        this.canSolve = this.isSolvable(startPos, endPosArray, this.grid)
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
        
        for (let i = 0; i < endPosArray.length; i++) {
            let tree = this.buildTree(startPos, endPosArray[i])
            if (tree) return tree
        }

        //if dfs tree from start to end ==> return true, else false
        
    }

    buildTree(startPos, endPos, parent=null, children=[]) {
        if (this._compareArrays(startPos, endPos)) return "true"
        
        const moves = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ]

        
        let left = this._at(startPos, moves[0]) 
        

        

        /*iterate through every position ***can stop once you find one path to end***
            iterate through moves, checking for valid move; 
            valid move means on board, filled with "X" no 0 (truthy not falsy), and not already visitted
            if valid move, continue recursive call on move pos until end is reached or no more possible moves
            continue up and down each branch (dfs) until end is found, then return TRUE
        */
        
    }

    /*DFS: 
        STACK: ARRAY with push/pop
        -> push until we hit an end
        --> end means no empty squares that have not been visited yet
    */

    _at(pos1, pos2=[0,0]) {
        let newPos = [pos1[0] + pos2[0], pos1[1] + pos2[1]]
        return this.grid[newPos[1]][newPos[0]]
    }

    _compareArrays(pos1, pos2) {
        return parseInt(pos1[0]) === parseInt(pos2[0]) && parseInt(pos1[1]) === parseInt(pos2[1])
    }

    equals
}


//REFACTOR BELOW INTO OWN CODE
class TreeNode {
    constructor(key, value = key, parent = null) {
        this.key = key
        this.value = value
        this.parent = parent
        this.children = []
    }

    get isLeaf() {
        return this.children.length === 0
    }

    get hasChildren() {
        return !this.isleaf()
    }
}

class Tree {
    constructor(key, value = key) {
        this.root = new TreeNode(key, value)
    }

    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.children.length) {
          for (let child of node.children) {
            yield* this.preOrderTraversal(child);
          }
        }
      }

    *postOrderTraversal(node = this.root) {
        if (node.children.length) {
          for (let child of node.children) {
            yield* this.postOrderTraversal(child);
          }
        }
        yield node;
      }
    
    insert(parentNodeKey, key, value = key) {
        for (let node of this.preOrderTraversal()) {
          if (node.key === parentNodeKey) {
            node.children.push(new TreeNode(key, value, node));
            return true;
          }
        }
        return false;
      }
    
    remove(key) {
        for (let node of this.preOrderTraversal()) {
          const filtered = node.children.filter(c => c.key !== key);
          if (filtered.length !== node.children.length) {
            node.children = filtered;
            return true;
          }
        }
        return false;
    }
    
    find(key) {
        for (let node of this.preOrderTraversal()) {
          if (node.key === key) return node;
        }
        return undefined;
    }
}
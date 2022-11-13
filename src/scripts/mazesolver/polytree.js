
export default class PolyTreeNode {
    constructor(value) {
        this.value = value
        this.parent = null
        this.children = []
    }

    addChildren(childNode) {
        if (!this._childrenIncludes(childNode.value)) {
            childNode.parent = this
            this.children.push(childNode)
        }
    }

    dfs(targetValue) {
        if (this.value === targetValue) return this

        this.children.forEach( child => {
            let currentChild = this.dfs.call(child, targetValue)
            if (currentChild) {
                return currentChild
            } else {
                return null
            }
        })
    }

    bfs(targetValue) {
        treeQueue = [this]

        while (treeQueue.length) {
            let currentNode = treeQueue.shift()
            if (currentNode.value === targetValue) {
                return currentNode
            } else {
                treeQueue.concat(currentNode.children)
            }
        }

        return null
    }


    tracePathBack() {
        let currentNode = this
        let path = [currentNode.value]

        while (currentNode.parent) {
            currentNode = currentNode.parent
            path.unshift(currentNode.value)
        }

        return path
    }

    _childrenIncludes(pos) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i][0] === pos[0] && this.children[i][1] === pos[1]) {
                    return true
            }
        }
        return false
    }

}
    
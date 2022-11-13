
export default class PolyTreeNode {
    constructor(value) {
        this.value = value
        this.parent = null
        this.children = []
    }

    addChildren(childNode) {
        if (!children.include(childNode)) {
            childNode.parent = this
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


}
    
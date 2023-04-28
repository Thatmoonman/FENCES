
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
        if (this._compareArrays(this.value, targetValue)) return this
        const stack = [this]

        while (stack.length) {
            let current = stack.pop()
            if (this._compareArrays(current.value, targetValue)) return this
            for (let child of current.children) {
                stack.push(child)
            }
        }

        // for (let i = 0; i < this.children.length; i++) {
        //     let child = this.children[i]
        //     let currentChild = this.dfs.call(child, targetValue)
        //     if (currentChild) return currentChild
        // }

        return undefined
    }

    bfs(targetValue) {
        let treeQueue = [this]

        while (treeQueue.length) {
            let currentNode = treeQueue.shift()
            
            if (this._compareArrays(currentNode.value, targetValue)) {
                return this.tracePathBack(currentNode)
            } else {
                currentNode.children.forEach( child => treeQueue.push(child))
            }
        }
    }


    tracePathBack(currentNode) {
        let path = [currentNode.value]

        while (currentNode.parent) {
            currentNode = currentNode.parent
            path.unshift(currentNode.value)
        }

        return path
    }

    _childrenIncludes(pos) {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            if (this._compareArrays(child.value, pos)) {
                    return true
            }
        }
        return false
    }

    _compareArrays(pos1, pos2) {
        return parseInt(pos1[0]) === parseInt(pos2[0]) && parseInt(pos1[1]) === parseInt(pos2[1])
    }

}
    
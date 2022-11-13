
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
        if (this.value[0] === targetValue[0] && this.value[1] === targetValue[1]) return this

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            let currentChild = this.dfs.call(child, targetValue)
            if (currentChild) return currentChild
        }


        // this.children.forEach( child => {
        //     let currentChild = this.dfs.call(child, targetValue)
        //     console.log(currentChild)
        //     if (currentChild) {
        //         return currentChild
        //     } 
        // })

        return undefined
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
    
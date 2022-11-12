

function findShortestPath(grid, startNode, endNode) {
    let distances = {}
    distances[endNode] = "infinity"
    distances = Object.assign(distances, grid[startNode])

    let parents = { endNode: null };
    for (let child in grid[startNode]) {
        parents[child] = startNode;
    }

    let visited = []

    let node = shortestDistanceNode(distances, visited);

    while(node) {
        let distance = distances[node];
        let children = graph[node]; 

        for (let child in children) {
            if (String(child) === String(startNode)) {
                continue;
             } else {
                let newdistance = distance + children[child];
            
                if (!distances[child] || distances[child] > newdistance) {
                    distances[child] = newdistance;
                    parents[child] = node;     
                }
            }
        }
        visited.push(node);
        node = shortestDistanceNode(distances, visited);
    }

    let shortestPath = [endNode];
    let parent = parents[endNode];
    
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    
    shortestPath.reverse();
    
    let results = {
        distance: distances[endNode],
        path: shortestPath,
    };

    return results;
}
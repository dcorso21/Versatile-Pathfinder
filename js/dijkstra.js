function dijkstra_solve(grid) {
    // Get Start
    let inQueue = [startNode.id],
        visited = [];

    function findNeighbors(cellId){
        let neighbors = [];
        

    }

    while (true) {
        for (let i = 0; i < inQueue.length; i++) {
            let node = inQueue.shift(),
                nx = node[1],
                ny = node[4];
            if (grid[ny][nx] === "end"){
                // End of algo
                return
            } else if (grid[ny][nx] === "wall") continue;
            visited.push(node)
            inQueue.concat(findNeighbors(node))
        }
    }

    // First, visit first node
    // then assess if it is the end
    // Then add neighbors to be processed
}

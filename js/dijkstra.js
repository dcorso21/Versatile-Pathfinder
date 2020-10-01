function dijkstra_solve(grid) {
    let inQueue = [startNode.id],
        visited = [],
        linkPrevious = {},
        newNeighbors;

    while (inQueue.length > 0) {
        let node = inQueue.shift(),
            [nx, ny] = parseID(node);

        if (grid[ny][nx] === "end") {
            visited.push(node);
            return [visited, shortestPath(node, linkPrevious)];
        } else if (grid[ny][nx] === "wall") {
            continue;
        }
        visited.push(node);
        [inQueue, linkPrevious] = findNeighbors(
            nx,
            ny,
            visited,
            linkPrevious,
            inQueue
        );
    }
    return [visited, []];
}

function shortestPath(node, linkPrevious) {
    let path = [endNode.id];
    while (true) {
        path.unshift(linkPrevious[node]);
        node = linkPrevious[node];
        if (node === startNode.id) return path;
    }
}

function findNeighbors(nx, ny, visited, linkPrevious, inQueue) {
    let up = [nx, ny + 1],
        down = [nx, ny - 1],
        right = [nx + 1, ny],
        left = [nx - 1, ny],
        neighbors = [up, down, right, left];
    for (let i = 0; i < neighbors.length; i++) {
        let id = formatID(neighbors[i][0], neighbors[i][1]),
            cond1 = !visited.includes(id), // None already visited
            cond2= !inQueue.includes(id), // No duplicates
            cond3 = cellIDs.includes(id);  // In cell
            cond4 = !wallIDs.includes(id);  // Not a wall

        if (cond1 && cond2 && cond3) {
            linkPrevious[id] = formatID(nx, ny);
            inQueue.push(id);
        }
    }
    return [inQueue, linkPrevious];
}
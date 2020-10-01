let NODES_INFO = {};
function aStarSolve(grid) {
    NODES_INFO = {};
    //Initialize the first node
    nodeInfo(undefined, startNode.id, true);
    console.log(NODES_INFO[startNode.id]);
    let inQueue = [startNode.id],
        visited = [],
        linkPrevious = {};

    while (inQueue.length > 0) {
        let node = inQueue.reduce((acc, element) => {
            console.log(NODES_INFO[acc]);
            if (NODES_INFO[acc].f < NODES_INFO[element].f) return acc;
            return element;
        });
        console.log("Q: ", inQueue);
        console.log("N: ", node);
        inQueue = inQueue.filter((el) => el !== node);
        let [nx, ny] = NODES_INFO[node].position;

        if (grid[ny][nx] === "end") {
            visited.push(node);
            return [visited, shortestPath(node, linkPrevious)];
        }
        visited.push(node);
        [inQueue, linkPrevious] = findNeighborsAStar(
            nx,
            ny,
            visited,
            linkPrevious,
            inQueue
        );
    }
    return [visited, []];
}

function nodeInfo(prevNode, positionID, start = false) {
    info = {
        position: parseID(positionID),
        previousNode: prevNode,
    };
    let hval =
        (info.position[0] - parseID(endNode.id)[0]) ** 2 +
        (info.position[1] - parseID(endNode.id)[1]) ** 2;

    info.h = hval;
    if (start) {
        info.g = Number(1);
        info.f = hval;
    } else {
        info.g = NODES_INFO[prevNode].g + 1;
        info.f = hval + info.g;
    }
    return (NODES_INFO[positionID] = info);
}

function findNeighborsAStar(nx, ny, visited, linkPrevious, inQueue) {
    let up = [nx, ny + 1],
        down = [nx, ny - 1],
        right = [nx + 1, ny],
        left = [nx - 1, ny],
        neighbors = [up, down, right, left];
    for (let i = 0; i < neighbors.length; i++) {
        let id = formatID(neighbors[i][0], neighbors[i][1]),
            cond1 = !visited.includes(id), // None already visited
            cond2 = !inQueue.includes(id), // No duplicates
            cond3 = cellIDs.includes(id); // In cell
        cond4 = !wallIDs.includes(id); // Not a wall

        if (cond1 && cond2 && cond3) {
            linkPrevious[id] = formatID(nx, ny);
            inQueue.push(id);
            algoInfo.commonInfo(algorithm, currentNode, prevNode)
        }
    }
    return [inQueue, linkPrevious];
}

function pickNextNode(currentNode, inQueue, algorithm) {
    let node;
    switch (algorithm) {
        case "dijkstras":
            node = inQueue.shift(); //simply
        case "astar":
            let node = inQueue.reduce((acc, element) => {
                if (NODES_INFO[acc].f < NODES_INFO[element].f) return acc;
                return element;
            });
            inQueue = inQueue.filter((el) => el !== node);
        case "greedy":
            let node = inQueue.reduce((acc, element) => {
                if (NODES_INFO[acc].f < NODES_INFO[element].f) return acc;
                return element;
            });
            inQueue = inQueue.filter((el) => el !== node);
    }
    return [nextNode, inQueue];
}

/**
 * Namespace for info needed per each algorithm
 */
class algoInfo {
    static commonInfo(algorithm, currentNodeID, prevNodeID) {
        let info = {
            previousNode: prevNodeID,
            position: parseID(nodeID),
        };
        let algos = {
            "dijkstras":() => (this.dijkstras(info)),
            "astar":() => (this.astar(info)),
        }
        algos(algorithm)()
    }
    static dijkstras(info) {
        NODES_INFO[nodeID] = info;
    }
    static astar(info) {
        let hval =
        (info.position[0] - parseID(endNode.id)[0]) ** 2 +
        (info.position[1] - parseID(endNode.id)[1]) ** 2;
        
        info.h = hval;
        if (start) {
            info.g = Number(1);
            info.f = hval;
        } else {
            info.g = NODES_INFO[prevNode].g + 1;
            info.f = hval + info.g;
        }
        NODES_INFO[nodeID] = info;
    }
}

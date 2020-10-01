let NODES_INFO = {};

function findPath() {
    console.log("starting");
    NODES_INFO = {};
    node = startNode.id;
    algoInfo.commonInfo(node, undefined, (start = true));
    let inQueue = [node],
        visited = [];

    while (!!node) {
        visited.push(node);
        if (NODES_INFO[node].gridVal === "end") {
            return [visited, createSolution()];
        }
        inQueue = lookForNeighbors(node, visited, inQueue);
        [node, inQueue] = pickNextNode(inQueue);
    }
    return [visited, []];
}

function lookForNeighbors(node, visited, inQueue) {
    let [nx, ny] = NODES_INFO[node].position,
        up = [nx, ny + 1],
        down = [nx, ny - 1],
        right = [nx + 1, ny],
        left = [nx - 1, ny],
        neighbors = [up, down, right, left];

    validNeighbors = neighbors.filter((cell) => {
        let id = formatID(cell[0], cell[1]),
            cond1 = !visited.includes(id), // None already visited
            cond2 = !inQueue.includes(id), // No duplicates
            cond3 = cellIDs.includes(id), // In cell
            cond4 = !wallIDs.includes(id); // Not a wall

        if (cond1 && cond2 && cond3 && cond4) return true;
        return false;
    });

    validNeighbors = validNeighbors.map((cell) => {
        let formatted = formatID(...cell);
        algoInfo.commonInfo(formatted, node);
        return formatted;
    });

    return inQueue.concat(validNeighbors);
}

function pickNextNode(inQueue) {
    if (!inQueue.length) return [undefined, []];
    let nextNode;
    switch (algorithm) {
        case "dijkstras":
            nextNode = inQueue.shift(); //simply
            break;
        case "astar":
            if (inQueue.length === 1) {
                nextNode = inQueue[0];
                inQueue = [];
            } else {
                nextNode = inQueue.reduce((acc, element) => {
                    if (NODES_INFO[acc].f < NODES_INFO[element].f) return acc;
                    return element;
                });
                inQueue = inQueue.filter((el) => el !== nextNode);
            }
            break;
    }
    return [nextNode, inQueue];
}

function createSolution() {
    let node = endNode.id,
        solution = [node];
    while (!!node) {
        solution.unshift(NODES_INFO[node].previousNode);
        node = NODES_INFO[node].previousNode;
        if (node == startNode.id) break;
    }
    return solution;
}

/**
 * Namespace for info needed per each algorithm
 */
class algoInfo {
    static commonInfo(nodeID, prevNodeID, start = false) {
        let info = {
            position: parseID(nodeID),
            previousNode: prevNodeID,
        };
        info.gridVal = grid[info.position[1]][info.position[0]];

        let algos = {
            dijkstras: () => this.dijkstras(info, nodeID, start),
            astar: () => this.astar(info, nodeID, prevNodeID, start),
        };
        console.log(algos[algorithm]);
        algos[algorithm]();
    }
    static dijkstras(info, nodeID, start) {
        NODES_INFO[nodeID] = info;
    }
    static astar(info, nodeID, prevNodeID, start) {
        let [endX, endY] = parseID(endNode.id);

        info.h =
            (info.position[0] - endX) ** 2 + (info.position[1] - endY) ** 2;
        if (start) {
            info.g = 0;
            info.f = info.h;
        } else {
            info.g = NODES_INFO[prevNodeID].g + 1;
            info.f = info.h + info.g;
        }
        NODES_INFO[nodeID] = info;
    }
}

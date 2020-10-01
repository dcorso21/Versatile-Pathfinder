let NODES_INFO = {};

function findPath() {
    console.log("starting");
    NODES_INFO = {};
    node = startNode.id;
    AlgoHub.commonInfo(node, undefined, (start = true));
    let inQueue = [node],
        visited = [];

    while (!!node) {
        visited.push(node);
        if (NODES_INFO[node].gridVal === "end") {
            return [visited, createSolution()];
        }
        inQueue = lookForNeighbors(node, visited, inQueue);
        [node, inQueue] = !inQueue.length
            ? [undefined, []]
            : AlgoHub.algoRoute("pickNext", inQueue);
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
        AlgoHub.commonInfo(formatted, node);
        return formatted;
    });

    return inQueue.concat(validNeighbors);
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
class AlgoHub {
    /**
     *
     * @param {String} action - recordNode || pickNext
     * @param {Object} argument - object passed to function
     */
    static algoRoute(action, argument) {
        algos = {
            dijkstras: () => this.dijkstras()[action](argument),
            astar: () => this.astar()[action](argument),
        };
        algos[algorithm]();
    }
    static commonInfo(nodeID, prevNodeID, start = false) {
        let info = {
            position: parseID(nodeID),
            previousNode: prevNodeID,
            id: nodeID,
            start: start,
        };
        info.gridVal = grid[info.position[1]][info.position[0]];

        this.algoRoute("recordNode", info);
    }
    static dijkstras(info) {
        return {
            recordNode: (info) => {
                NODES_INFO[info.nodeID] = info;
            },
            pickNext: (inQueue) => {
                return [inQueue.shift(), inQueue];
            },
        };
    }
    static astar(info) {
        return {
            recordNode: (info) => {
                let [endX, endY] = parseID(endNode.id);
                info.h =
                    (info.position[0] - endX) ** 2 +
                    (info.position[1] - endY) ** 2;
                if (start) {
                    info.g = 0;
                    info.f = info.h;
                } else {
                    info.g = NODES_INFO[info.prevNodeID].g + 1;
                    info.f = info.h + info.g;
                }
                NODES_INFO[info.nodeID] = info;
            },
            pickNext: (inQueue) => {
                if (inQueue.length === 1) {
                    return [inQueue[0], []];
                } else {
                    let nextNode = inQueue.reduce((acc, element) => {
                        if (NODES_INFO[acc].f < NODES_INFO[element].f)
                            return acc;
                        return element;
                    });
                    inQueue = inQueue.filter((el) => el !== nextNode);
                    return [nextNode, inQueue];
                }
            },
        };
    }
}

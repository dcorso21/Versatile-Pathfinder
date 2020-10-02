let NODES_INFO = {};

/**
 * Namespace for functions that directly solve the path.
 */
class Solver {
    /**
     * Main function to solve path.
     */
    static findPath() {
        NODES_INFO = {};
        // console.log(Object.keys(NODES_INFO).length);
        let node = startNode.id;
        let inQueue = [node],
            visited = [];
        AlgoHub.commonInfo(node, undefined, true);
    
        while (!!node) {
            visited.push(node);
            if (NODES_INFO[node].gridVal === "end") {
                return [visited, this.createSolution()];
            }
            inQueue = this.lookForNeighbors(node, visited, inQueue);
            [node, inQueue] = !inQueue.length
                ? [undefined, []]
                : AlgoHub.algoRoute("pickNext", inQueue);
        }
        return [visited, []];
    }
    
    /**
     * 
     * @param {String} node - Current Node id
     * @param {Object} visited - List of visited cells
     * @param {Object} inQueue - List of cells to visit
     */
    static lookForNeighbors(node, visited, inQueue) {
        let [nx, ny] = NODES_INFO[node].position,
            up = [nx, ny + 1],
            down = [nx, ny - 1],
            right = [nx + 1, ny],
            left = [nx - 1, ny],
            neighbors = [up, down, right, left];
    
        let validNeighbors = neighbors.filter((cell) => {
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
    
    /**
     * Creates solution `object` by looping back through previous nodes
     */
    static createSolution() {
        let node = endNode.id,
            solution = [node];
        while (!!node) {
            solution.unshift(NODES_INFO[node].previousNode);
            node = NODES_INFO[node].previousNode;
            if (node == startNode.id) break;
        }
        return solution;
    }
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
        let algos = {
            dijkstras: () => this.dijkstras()[action](argument),
            astar: () => this.astar()[action](argument),
            greedy: () => this.greedy()[action](argument),
            dfSearch: () => this.dfSearch()[action](argument),
        };
        
        return algos[algorithm]();
    }
    /**
     * All algorithms will need some basic info on the node, this info is compiled here before going to specific algo.
     * @param {String} nodeID id of node
     * @param {String} prevNodeID id of last node
     * @param {Boolean} start whether to treat node as the start node
     */
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
    static dijkstras() {
        return {
            recordNode: (info) => {
                NODES_INFO[info.id] = info;
            },
            pickNext: (inQueue) => {
                let nextNode = inQueue.shift();
                return [nextNode, inQueue];
            },
        };
    }
    static dfSearch() {
        return {
            recordNode: (info) => {
                NODES_INFO[info.id] = info;
            },
            pickNext: (inQueue) => {
                let nextNode = inQueue.pop();
                return [nextNode, inQueue];
            },
        };
    }
    static astar() {
        return {
            recordNode: (info) => {
                let [endX, endY] = parseID(endNode.id);
                info.h =
                    Math.abs(info.position[0] - endX)  +
                    Math.abs(info.position[1] - endY) ;
                if (info.start) {
                    info.g = 0;
                    info.f = info.h;
                } else {
                    info.g = NODES_INFO[info.previousNode].g + 1;
                    info.f = info.h + info.g;
                }
                NODES_INFO[info.id] = info;
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
    static greedy() {
        return {
            recordNode: (info) => {
                let [endX, endY] = parseID(endNode.id);
                info.h =
                    (info.position[0] - endX) ** 2 +
                    (info.position[1] - endY) ** 2;
                if (info.start) {
                    info.g = 0;
                    info.f = info.h;
                } else {
                    info.g = NODES_INFO[info.previousNode].g + 1;
                    info.f = info.h + info.g;
                }
                NODES_INFO[info.id] = info;
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

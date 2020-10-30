let select = (name) => document.querySelector(name),
    selectAll = (name) => document.querySelectorAll(name),
    cells,
    NODES_INFO,
    startIcon,
    endIcon,
    startNode,
    endNode,
    cellIDs = [],
    wallIDs = [],
    grid = [],
    algorithm = "dijkstras";

window.onload = () => {
    // console.log(document);
    Render.createDivGrid();
    Render.setStart();
    Render.setEnd();
    UI.enableAllUI();
};

class Render {
    static refreshCellandWallIDs() {
        wallIDs = [];
        cells = [...selectAll(".cell")];
        // console.log(cells);
        cells.map((c, i) => {
            cellIDs.push(c.id);
            if (c.classList.contains("wall")) {
                wallIDs.push(cells[i].id);
            }
        });
    }

    static resetSolvedAndVisited() {
        [...cells].map((c) => {
            let forRemoval = [
                "solution",
                "visited",
                "visited-start-end",
                "solution-start-end",
            ];
            forRemoval.map((e) => {
                c.classList.remove(e);
            });
        });
        Fetch.pullGrid();
    }
    static createDivGrid() {
        let divGrid = document.getElementsByClassName("grid")[0],
            squareSize = 31,
            wHeight = Math.floor(window.innerHeight / squareSize),
            wWidth = Math.floor((window.innerWidth * 2) / 3 / squareSize);

        for (let y = 0; y < wHeight; y++) {
            let row = document.createElement("div");
            row.classList.add("row");
            for (let x = 0; x < wWidth; x++) {
                let div = document.createElement("div");
                div.classList.add("cell");
                div.id = `(${x}, ${y})`;
                row.appendChild(div);
            }
            divGrid.appendChild(row);
        }
    }
    static setStart() {
        startIcon = document.getElementsByClassName("starticon")[0];
        let x = 8,
            y = 9,
            startCell = document.getElementById(`(${x}, ${y})`);
        startCell.classList.add("start");
        startCell.appendChild(startIcon);
        startIcon.style.display = "inline";
    }

    static setEnd() {
        endIcon = document.getElementsByClassName("endicon")[0];
        let x = 32 - 9,
            y = 9,
            endCell = document.getElementById(`(${x}, ${y})`);
        endCell.classList.add("end");
        endCell.appendChild(endIcon);
        endIcon.style.display = "inline";
    }

    static solveAndDraw() {
        Render.refreshCellandWallIDs();
        Render.resetSolvedAndVisited();
        Fetch.pullGrid();
        Fetch.findStartandFinish();
        let visited, path;
        [visited, path] = Solver.findPath();
        let timeBetween = 15, //ms
            offset = visited.length * timeBetween;

        Render.drawVisited(visited, timeBetween);
        Render.drawSolution(path, timeBetween, offset);
        return;
    }

    static drawVisited(visited, timeBetween, offset) {
        visited.map((e, i) => {
            setTimeout(() => {
                let visitedCell = document.getElementById(e);
                if (
                    visitedCell.classList.contains("start") ||
                    visitedCell.classList.contains("end")
                ) {
                    visitedCell.classList.add("visited-start-end");
                } else {
                    visitedCell.classList.add("visited");
                }
            }, timeBetween * i);
        });
    }

    static drawSolution(path, timeBetween, offset) {
        path.map((e, i) => {
            setTimeout(() => {
                let solutionCell = document.getElementById(e),
                    vClass = "visited",
                    sClass = "solution";

                if (
                    solutionCell.classList.contains("start") ||
                    solutionCell.classList.contains("end")
                ) {
                    vClass = "visited-start-end";
                    sClass = "solution-start-end";
                }
                if (!solutionCell.classList.contains("wall")) {
                    solutionCell.classList.remove(vClass);
                    solutionCell.classList.add(sClass);
                }
            }, timeBetween * 3 * i + offset);
        });
    }

    static resetWalls() {
        Render.refreshCellandWallIDs();
        console.log("here");
        wallIDs.map((e) => {
            let d = document.getElementById(e);
            d.classList.remove("wall");
        });
        Render.refreshCellandWallIDs();
        Fetch.pullGrid();
    }
}

class Fetch {
    static pullGrid() {
        grid = [];
        let rows = document.querySelectorAll(".row");
        for (let i = 0; i < rows.length; i++) {
            let row = [];
            for (let j = 0; j < rows[i].childNodes.length; j++) {
                let cell = rows[i].childNodes[j];
                if (cell.classList.contains("start")) {
                    row.push("start");
                } else if (cell.classList.contains("end")) {
                    row.push("end");
                } else if (cell.classList.contains("wall")) {
                    row.push("wall");
                } else row.push("blank");
            }
            grid.push(row);
        }
    }
    static findStartandFinish() {
        startNode = document.getElementsByClassName("start")[0];
        endNode = document.getElementsByClassName("end")[0];
    }
    static cellBelow(cell) {
        let [x, y] = Solver.parseID(cell.id);
        return document.getElementById(Solver.formatID([x, y - 1]));
    }
    static getAlgo() {
        let algo = select("#algo-select").value;
        algorithm = algo;
    }
}

class UI {
    static enableAllUI() {
        UI.enableDrawWalls();
        UI.enableButtons();
        UI.enableDragStartandEnd();
        UI.enableAlgoChoice();
    }

    static enableDrawWalls() {
        cells = document.querySelectorAll(".cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("mousemove", (e) => {
                let cond1 = e.buttons === 1,
                    cond2 = !e.target.classList.contains("start"),
                    cond3 = !e.target.classList.contains("end"),
                    cond4 = e.target.classList.contains("cell");

                if (cond1 && cond2 && cond3 && cond4) {
                    e.target.className = "cell wall";
                }
            });
            cells[i].addEventListener("click", (e) => {
                let cond1 = !e.target.classList.contains("start"),
                    cond2 = !e.target.classList.contains("end"),
                    cond3 = e.target.classList.contains("cell");
                if (cond1 && cond2 && cond3) {
                    e.target.classList.toggle("wall");
                }
            });
        }
    }

    static enableButtons() {
        let startBtn = document.getElementsByClassName("begin-algo")[0],
            resetBtn = document.getElementsByClassName("reset")[0],
            clearWalls = select(".clear-walls");

        console.log(clearWalls);
        startBtn.addEventListener("click", Render.solveAndDraw);
        resetBtn.addEventListener("click", Render.resetSolvedAndVisited);
        clearWalls.addEventListener("click", Render.resetWalls);
    }

    static enableDragStartandEnd() {
        let draggedIcon,
            icons = [startIcon, endIcon];

        icons.map((icon) => {
            icon.ondragstart = (e) => {
                // let img = e.target.cloneNode(true);
                // e.dataTransfer.setDragImage(img, 25, h * 5);
                draggedIcon = e.target;
                requestAnimationFrame(() => {
                    draggedIcon.classList.add("hide-while-dragged");
                });
            };
            icon.ondragend = (e) => {
                e.srcElement.classList.remove("hide-while-dragged");
            };
        });

        [...cells].map((cell) => {
            cell.ondragover = (e) => {
                e.preventDefault();
                Fetch.findStartandFinish();
                let cls, node;
                switch (draggedIcon.id) {
                    case "starticon":
                        cls = "start";
                        node = startNode;
                        break;
                    case "endicon":
                        cls = "end";
                        node = endNode;
                        break;
                }
                node.classList.remove(cls);
                // console.log("sss ", e.target);
                e.target.classList.add(cls);
            };
            cell.ondrop = (e) => {
                e.preventDefault();
                e.target.appendChild(draggedIcon);
            };
        });
    }

    static enableAlgoChoice() {
        let algoChoice = select("#algo-select");
        algoChoice.onchange = () => {
            Fetch.getAlgo();
            let descs = selectAll(".algo-desc");
            console.log(descs);
            [...descs].map((d) => {
                d.style.display = "none";
                d.classList.remove('fade-in')
                
                if (d.classList.contains(algorithm)) {
                    d.style.display = "block";
                    d.classList.add('fade-in')
                }
            });
        };
    }
}

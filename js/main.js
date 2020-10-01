function formatID(nx, ny) {
    return `(${nx}, ${ny})`;
}

function parseID(id) {
    let gap = id.indexOf(" "),
        x = Number(id.slice(1, gap - 1)),
        y = Number(id.slice(gap + 1, id.length - 1));
    return [x, y];
}

function createDivGrid() {
    let divGrid = document.getElementsByClassName("grid")[0];
    for (let y = 0; y < 19; y++) {
        let row = document.createElement("div");
        row.classList.add("row");
        for (let x = 0; x < 32; x++) {
            let div = document.createElement("div");
            div.classList.add("cell");
            div.id = `(${x}, ${y})`;
            row.appendChild(div);
        }
        divGrid.appendChild(row);
    }
}

function pullGrid() {
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

function setStart() {
    let x = 8,
        y = 9,
        startIcon = document.getElementsByClassName("starticon")[0],
        startCell = document.getElementById(`(${x}, ${y})`);
    startCell.classList.add("start");
    startCell.appendChild(startIcon);
}

function setEnd() {
    let x = 32 - 9,
        y = 9,
        endIcon = document.getElementsByClassName("endicon")[0],
        endCell = document.getElementById(`(${x}, ${y})`);
    endCell.classList.add("end");
    endCell.appendChild(endIcon);
}

function enableDrawWalls() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("mousemove", (e) => {
            let cond1 = e.buttons === 1,
                cond2 = !e.target.classList.contains("start"),
                cond3 = !e.target.classList.contains("end");
            if (cond1 && cond2 && cond3) {
                e.target.classList.add("wall");
            }
        });
    }
}

function refreshCellandWallIDs() {
    for (let i = 0; i < cells.length; i++) {
        cellIDs.push(cells[i].id);
        if (cells[i].classList.contains("wall")) {
            wallIDs.push(cells[i].id);
        }
    }
}

createDivGrid();

let cells = document.querySelectorAll(".cell");
let cellIDs = [];
let wallIDs = [];
let grid = [];

pullGrid();
setStart();
setEnd();

let startNode = document.getElementsByClassName("start")[0];
let endNode = document.getElementsByClassName("end")[0];
let btn = document.getElementsByClassName("btn")[0];
let algorithm = "dfSearch";

enableDrawWalls();

btn.addEventListener("click", () => {
    refreshCellandWallIDs();
    pullGrid();
    let [visited, path] = Solver.findPath();
    function drawVisited() {
        return new Promise((resolve) => {
            for (let i = 0; i <= visited.length; i++) {
                if (i === visited.length) {
                    setTimeout(() => {
                        drawSolution();
                    }, 15 * i + 30);
                    return;
                }
                setInterval(() => {
                    let visitedCell = document.getElementById(visited[i]);
                    if (!visitedCell.classList.contains("solution")) {
                        visitedCell.className = "cell visited";
                    }
                }, i * 15);
            }
            resolve(5);
        });
    }
    function drawSolution() {
        for (let i = 0; i < path.length; i++) {
            let solutionCell = document.getElementById(path[i]);
            setInterval(() => {
                solutionCell.className = "cell solution";
            }, i * 35);
        }
    }

    drawVisited();
    return;
});

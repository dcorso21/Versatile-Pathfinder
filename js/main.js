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
                e.target.className = "cell wall";
            }
        });
        cells[i].addEventListener("click", (e) => {
            let cond1 = !e.target.classList.contains("start"),
                cond2 = !e.target.classList.contains("end");
            if (cond1 && cond2) {
                e.target.classList.toggle("wall");
            }
        });
    }
}

function refreshCellandWallIDs() {
    wallIDs = []
    for (let i = 0; i < cells.length; i++) {
        cellIDs.push(cells[i].id);
        if (cells[i].classList.contains("wall")) {
            wallIDs.push(cells[i].id);
        } else {
            cells[i].classList.remove("solution");
            cells[i].classList.remove("visited");
        }
    }
}

function resetWalls() {
    wallIDs.map((e) => {
        let d = document.getElementById(e)
        d.classList.remove("wall")
    })
    refreshCellandWallIDs()
    pullGrid()
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
let startBtn = document.getElementsByClassName("begin-algo")[0];
let resetBtn = document.getElementsByClassName("reset")[0];
let algorithm = "dijkstras";

enableDrawWalls();

startBtn.addEventListener("click", solveAndDraw);
resetBtn.addEventListener("click", resetWalls);

function solveAndDraw() {
    refreshCellandWallIDs();
    pullGrid();
    let visited, path;
    [visited, path] = Solver.findPath();
    let timeBetween = 15, //ms
        offset = visited.length * timeBetween;

    drawVisited(visited, timeBetween);
    drawSolution(path, timeBetween, offset);
    return;
}

function drawVisited(visited, timeBetween, offset) {
    visited.map((e, i) => {
        setTimeout(() => {
            let visitedCell = document.getElementById(e),
                cond1 = !visitedCell.classList.contains("solution"),
                cond2 = !visitedCell.classList.contains("wall");
            if (cond1 && cond2) {
                visitedCell.classList.add("visited");
                // drawVisited(e);
            }
        }, timeBetween * i);
    });
}

function drawSolution(path, timeBetween, offset) {
    path.map((e, i) => {
        setTimeout(() => {
            let solutionCell = document.getElementById(e);
            if (!solutionCell.classList.contains("wall")) {
                solutionCell.classList.remove("visited");
                solutionCell.classList.add("solution");
            }
        }, timeBetween * 3 * i + offset);
    });
}

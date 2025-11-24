export class Renderer {
constructor(container) {
this.container = container;
this.container.style.position = "relative";
this.container.style.userSelect = "none";
}


createGrid(size) {
this.container.innerHTML = "";
for (let r = 0; r < size; r++) {
const row = document.createElement("div");
row.className = "row";
for (let c = 0; c < size; c++) {
const cell = document.createElement("div");
cell.className = "cell";
row.appendChild(cell);
}
this.container.appendChild(row);
}
}


render(grid) {
const rows = this.container.children;


for (let r = 0; r < grid.length; r++) {
const cols = rows[r].children;
for (let c = 0; c < grid[r].length; c++) {
const tileVal = grid[r][c];
const cell = cols[c];
cell.textContent = tileVal === 0 ? "" : tileVal;
cell.className = "cell";
if (tileVal > 0) cell.classList.add(`cell-${tileVal}`);
}
}
}
}

const n1 = 5, n2 = 4, n3 = 2, n4 = 5;

const seed = n1 * 1000 + n2 * 100 + n3 * 10 + n4;
const n = 10 + n3;
const k = 1.0 - n3 * 0.02 - n4 * 0.005 - 0.25;
document.getElementById("info").textContent =
`Variant: ${seed}, n = ${n}, k = ${k.toFixed(4)}, layout: triangle`;
function makeRng(seed) {
let current = seed;
return () => {
current = (1664525 * current + 1013904223) % 4294967296;
return current / 4294967296;
};
}
const rng = makeRng(seed);
const dirMatrix = [];
for (let i = 0; i < n; i++) {
dirMatrix[i] = [];
for (let j = 0; j < n; j++) {
const value = rng() * 2.0;
dirMatrix[i][j] = value * k >= 1.0 ? 1 : 0;
}
}
const undirMatrix = Array.from(
{ length: n },
() => new Array(n).fill(0)
);
for (let i = 0; i < n; i++) {
for (let j = 0; j < n; j++) {
if (dirMatrix[i][j] === 1) {
undirMatrix[i][j] = 1;
undirMatrix[j][i] = 1;
}
}
}
const cx = 370;
const cy = 250;
const triR = 200;
const NODE_R = 18;
const points = [];
const triangleAngles = [
-Math.PI / 2,
-Math.PI / 2 + (2 * Math.PI) / 3,
-Math.PI / 2 + (4 * Math.PI) / 3
];
const corners = triangleAngles.map(angle => ({
x: cx + triR * Math.cos(angle),
y: cy + triR * Math.sin(angle)
}));
const perSide = Math.floor(n / 3);
const extra = n % 3;
const sideCounts = [
perSide + (extra > 0 ? 1 : 0),
perSide + (extra > 1 ? 1 : 0),
perSide
];
for (let side = 0; side < 3; side++) {
const from = corners[side];
const to = corners[(side + 1) % 3];
const count = sideCounts[side];
for (let i = 0; i < count; i++) {
const t = (i + 1) / (count + 1);
points.push({
x: from.x + t * (to.x - from.x),
y: from.y + t * (to.y - from.y)
});
}
}
function bezierPoint(t, x1, y1, cpx, cpy, x2, y2) {
const mt = 1 - t;
return {
x: mt * mt * x1 + 2 * mt * t * cpx + t * t * x2,
y: mt * mt * y1 + 2 * mt * t * cpy + t * t * y2
};
}
function getControlPoint(x1, y1, x2, y2, side) {
const mx = (x1 + x2) / 2;
const my = (y1 + y2) / 2;
const dist = Math.hypot(x2 - x1, y2 - y1);
return {
cpx: mx - ((y2 - y1) / dist) * 40 * side,
cpy: my + ((x2 - x1) / dist) * 40 * side
};
}
function drawLoop(ctx, x, y, directed = true) {
const loopR = 14;
const ox = x + NODE_R * 0.7;
const oy = y - NODE_R * 0.7;
ctx.beginPath();
ctx.arc(ox, oy, loopR, 0, 2 * Math.PI);
ctx.stroke();
if (directed) {
const a = Math.PI / 4;
const tx = ox + loopR * Math.cos(a);
const ty = oy + loopR * Math.sin(a);
const angle = a + Math.PI / 2;
ctx.beginPath();
ctx.moveTo(tx, ty);
ctx.lineTo(
tx - 10 * Math.cos(angle - Math.PI / 6),
ty - 10 * Math.sin(angle - Math.PI / 6)
);
ctx.lineTo(
tx - 10 * Math.cos(angle + Math.PI / 6),
ty - 10 * Math.sin(angle + Math.PI / 6)
);
ctx.closePath();
ctx.fill();
}
}
function drawArrow(ctx, x1, y1, x2, y2, side) {
const { cpx, cpy } = getControlPoint(x1, y1, x2, y2, side);
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.quadraticCurveTo(cpx, cpy, x2, y2);
ctx.stroke();
const angle = Math.atan2(y2 - cpy, x2 - cpx);
const endX = x2 - NODE_R * Math.cos(angle);
const endY = y2 - NODE_R * Math.sin(angle);
ctx.beginPath();
ctx.moveTo(endX, endY);
ctx.lineTo(
endX - 12 * Math.cos(angle - Math.PI / 6),
endY - 12 * Math.sin(angle - Math.PI / 6)
);
ctx.lineTo(
endX - 12 * Math.cos(angle + Math.PI / 6),
endY - 12 * Math.sin(angle + Math.PI / 6)
);
ctx.closePath();
ctx.fill();
}
function drawLine(ctx, x1, y1, x2, y2) {
const { cpx, cpy } = getControlPoint(x1, y1, x2, y2, 1);
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.quadraticCurveTo(cpx, cpy, x2, y2);
ctx.stroke();
}
function drawNodes(ctx, color) {
ctx.font = "bold 14px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
for (let i = 0; i < n; i++) {
const { x, y } = points[i];
ctx.beginPath();
ctx.arc(x, y, NODE_R, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();
ctx.strokeStyle = color;
ctx.lineWidth = 2;
ctx.stroke();
ctx.fillStyle = color;
ctx.fillText(i + 1, x, y);
}
}
function renderMatrix(matrix, table) {
for (let i = 0; i < n; i++) {
const row = table.insertRow();
for (let j = 0; j < n; j++) {
const cell = row.insertCell();
cell.textContent = matrix[i][j];
if (matrix[i][j] === 1) {
cell.className = "one";
}
}
}
}
const dirCtx = document.getElementById("dirCanvas").getContext("2d");
dirCtx.strokeStyle = "#000000";
dirCtx.fillStyle = "#000000";
dirCtx.lineWidth = 1.5;
for (let i = 0; i < n; i++) {
for (let j = 0; j < n; j++) {
if (dirMatrix[i][j] !== 1) continue;
const { x: x1, y: y1 } = points[i];
const { x: x2, y: y2 } = points[j];
if (i === j) {
drawLoop(dirCtx, x1, y1, true);
} else {
const side =
dirMatrix[j][i] === 1 && i > j
? -1
: 1;
drawArrow(dirCtx, x1, y1, x2, y2, side);
}
}
}
drawNodes(dirCtx, "#000000");
const undirCtx = document.getElementById("undirCanvas").getContext("2d");
undirCtx.strokeStyle = "#000000";
undirCtx.fillStyle = "#000000";
undirCtx.lineWidth = 1.5;
for (let i = 0; i < n; i++) {
for (let j = i; j < n; j++) {
if (undirMatrix[i][j] !== 1) continue;
const { x: x1, y: y1 } = points[i];
const { x: x2, y: y2 } = points[j];
if (i === j) {
drawLoop(undirCtx, x1, y1, false);
} else {
drawLine(undirCtx, x1, y1, x2, y2);
}
}
}
drawNodes(undirCtx, "#000000");
renderMatrix(
dirMatrix,
document.getElementById("tDir")
);
renderMatrix(
undirMatrix,
document.getElementById("tUndir")
);

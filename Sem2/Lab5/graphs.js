const n1 = 5, n2 = 4, n3 = 2, n4 = 5;
const seed = n1 * 1000 + n2 * 100 + n3 * 10 + n4;
const n = 10 + n3;
const k = 1.0 - n3 * 0.01 - n4 * 0.005 - 0.15;

document.getElementById("info").textContent =
  `Variant: ${seed}, n = ${n}, k = ${k.toFixed(4)}, placement: triangle`;

function makeRng(seed) {
  let current = seed;
  return () => {
    current = (1664525 * current + 1013904223) % 4294967296; // 4294967296 = 2^32
    return current / 4294967296;
  };
}
const rng = makeRng(seed);

const dirMatrix = [];
for (let i = 0; i < n; i++) {
  dirMatrix[i] = [];
  for (let j = 0; j < n; j++) {
    const val = rng() * 2.0;
    dirMatrix[i][j] = val * k >= 1.0 ? 1 : 0;
  }
}

const cx = 370,
  cy = 295;
const triR = 200;
const NODE_R = 16;
const points = [];

const triAngles = [
  -Math.PI / 2,
  -Math.PI / 2 + (2 * Math.PI) / 3,
  -Math.PI / 2 + (4 * Math.PI) / 3,
];
const corners = triAngles.map((a) => ({
  x: cx + triR * Math.cos(a),
  y: cy + triR * Math.sin(a),
}));

const perSide = Math.floor(n / 3);
const extra = n % 3;
const sideCounts = [
  perSide + (extra > 0 ? 1 : 0),
  perSide + (extra > 1 ? 1 : 0),
  perSide,
];

for (let side = 0; side < 3; side++) {
  const from = corners[side];
  const to = corners[(side + 1) % 3];
  const count = sideCounts[side];

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    points.push({
      x: from.x + t * (to.x - from.x),
      y: from.y + t * (to.y - from.y),
    });
  }
}

function bezierPoint(t, x1, y1, cpx, cpy, x2, y2) {
  const mt = 1 - t;
  return {
    x: mt * mt * x1 + 2 * mt * t * cpx + t * t * x2,
    y: mt * mt * y1 + 2 * mt * t * cpy + t * t * y2,
  };
}

function findEdgeT(x1, y1, cpx, cpy, x2, y2, ox, oy, r, fromEnd) {
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t = fromEnd ? 1 - i / steps : i / steps;
    const p = bezierPoint(t, x1, y1, cpx, cpy, x2, y2);
    if (Math.hypot(p.x - ox, p.y - oy) >= r) return t;
  }
  return fromEnd ? 0 : 1;
}

function getControlPoint(x1, y1, x2, y2, side) {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return {
    cpx: mx - ((y2 - y1) / dist) * 40 * side,
    cpy: my + ((x2 - x1) / dist) * 40 * side,
  };
}

function drawArrow(ctx, x1, y1, x2, y2, side, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const { cpx, cpy } = getControlPoint(x1, y1, x2, y2, side);

  const tStart = findEdgeT(x1, y1, cpx, cpy, x2, y2, x1, y1, NODE_R, false);
  const tEnd = findEdgeT(x1, y1, cpx, cpy, x2, y2, x2, y2, NODE_R, true);

  const ps = bezierPoint(tStart, x1, y1, cpx, cpy, x2, y2);
  const pe = bezierPoint(tEnd, x1, y1, cpx, cpy, x2, y2);

  const pb = bezierPoint(tEnd - 0.01, x1, y1, cpx, cpy, x2, y2);
  const angle = Math.atan2(pe.y - pb.y, pe.x - pb.x);

  ctx.beginPath();
  ctx.moveTo(ps.x, ps.y);
  ctx.quadraticCurveTo(cpx, cpy, pe.x, pe.y);
  ctx.stroke();

  const size = 11;
  ctx.beginPath();
  ctx.moveTo(pe.x, pe.y);
  ctx.lineTo(
    pe.x - size * Math.cos(angle - Math.PI / 6),
    pe.y - size * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    pe.x - size * Math.cos(angle + Math.PI / 6),
    pe.y - size * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2) {
  const { cpx, cpy } = getControlPoint(x1, y1, x2, y2, +1);

  const tStart = findEdgeT(x1, y1, cpx, cpy, x2, y2, x1, y1, NODE_R, false);
  const tEnd = findEdgeT(x1, y1, cpx, cpy, x2, y2, x2, y2, NODE_R, true);

  const ps = bezierPoint(tStart, x1, y1, cpx, cpy, x2, y2);
  const pe = bezierPoint(tEnd, x1, y1, cpx, cpy, x2, y2);

  ctx.beginPath();
  ctx.moveTo(ps.x, ps.y);
  ctx.quadraticCurveTo(cpx, cpy, pe.x, pe.y);
  ctx.stroke();
}

function drawLoop(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const loopR = 13;
  const ox = x + NODE_R * 0.65,
    oy = y - NODE_R * 0.65;

  ctx.beginPath();
  ctx.arc(ox, oy, loopR, 0, 2 * Math.PI);
  ctx.stroke();

  const a = 0.1 * Math.PI;
  const tx = ox + loopR * Math.cos(a),
    ty = oy + loopR * Math.sin(a);
  const angle = a + Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(
    tx - 9 * Math.cos(angle - Math.PI / 6),
    ty - 9 * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    tx - 9 * Math.cos(angle + Math.PI / 6),
    ty - 9 * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
}

function drawEdges(ctx, matrix, color) {
  ctx.lineWidth = 1.5;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== 1) continue;
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[j];
      if (i === j) {
        drawLoop(ctx, x1, y1, color);
      } else {
        const side = matrix[j][i] === 1 && i > j ? -1 : +1;
        drawArrow(ctx, x1, y1, x2, y2, side, color);
      }
    }
  }
}

function drawNodes(ctx, nodeColors) {
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const { x, y } = points[i];
    const color = nodeColors[i];

    ctx.beginPath();
    ctx.arc(x, y, NODE_R, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = color === "white" || color === "#1851fd" ? "#000" : "#fff";
    ctx.fillText(i + 1, x, y);
  }
}

function renderMatrix(matrix, tableEl) {
  for (let i = 0; i < n; i++) {
    const row = tableEl.insertRow();
    for (let j = 0; j < n; j++) {
      const td = row.insertCell();
      td.textContent = matrix[i][j];
      if (matrix[i][j] === 1) td.className = "one";
    }
  }
}

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let nodeColorsB = new Array(n).fill("white");
let nodeColorsD = new Array(n).fill("white");

const bTree = [];
const dTree = [];
for (let i = 0; i < n; i++) {
  bTree[i] = new Array(n).fill(0);
  dTree[i] = new Array(n).fill(0);
}

let activeMode = "bfs";

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEdges(ctx, dirMatrix, "#ccc");
  const tree = activeMode === "bfs" ? bTree : dTree;
  ctx.lineWidth = 2.5;
  drawEdges(ctx, tree, "#1a6bbd");
  ctx.lineWidth = 1.5;
  const colors = activeMode === "bfs" ? nodeColorsB : nodeColorsD;
  drawNodes(ctx, colors);
}

redraw();
renderMatrix(dirMatrix, document.getElementById("tDir"));

function findStart(visited) {
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    for (let j = 0; j < n; j++) {
      if (dirMatrix[i][j] === 1) return i;
    }
  }
  return -1;
}

let bVisited = new Array(n).fill(false);
let bQueue = [];
let bOrder = [];
let bLog = [];
let bDone = false;

function initBFS() {
  bVisited = new Array(n).fill(false);
  bQueue = [];
  bOrder = [];
  bLog = [];
  bDone = false;

  const start = findStart(bVisited);
  if (start === -1) {
    document.getElementById("bProtocol").textContent =
      "No vertices with outgoing edges.";
    bDone = true;
    return;
  }

  bQueue.push(start);
  bVisited[start] = true;
  nodeColorsB[start] = "#1851fd";

  bLog.push(`BFS start. Starting vertex: ${start + 1}`);
  bLog.push(`Queue: [${bQueue.map((v) => v + 1).join(", ")}]`);

  redraw();
  document.getElementById("bProtocol").textContent = bLog.join("\n");
}

function bNextStep() {
  if (bDone) return;
  activeMode = "bfs";

  if (bQueue.length === 0) {
    const next = findStart(bVisited);
    if (next === -1) {
      bDone = true;
      document.getElementById("btnBStep").disabled = true;
      bLog.push("\nBFS completed!");
      bLog.push(
        `Visit order: ${bOrder.map((v) => v + 1).join(" → ")}`,
      );
      document.getElementById("bProtocol").textContent = bLog.join("\n");
      showBResults();
      return;
    }
    bQueue.push(next);
    bVisited[next] = true;
    nodeColorsB[next] = "#1851fd";
    bLog.push(
      `\nUnvisited vertices remain. Continue from vertex ${next + 1}`,
    );
    bLog.push(`Queue: [${bQueue.map((v) => v + 1).join(", ")}]`);
    redraw();
    document.getElementById("bProtocol").textContent = bLog.join("\n");
    return;
  }

  const current = bQueue.shift();
  bOrder.push(current);
  nodeColorsB[current] = "#0cd7ff";

  bLog.push(`\nStep ${bOrder.length}: processing vertex ${current + 1}`);

  const added = [];
  for (let j = 0; j < n; j++) {
    if (dirMatrix[current][j] !== 1) continue;
    if (j === current) continue;

    if (!bVisited[j]) {
      bVisited[j] = true;
      bQueue.push(j);
      nodeColorsB[j] = "#1851fd";
      added.push(j + 1);

      bTree[current][j] = 1;
    }
  }

  if (added.length > 0) {
    bLog.push(`  Added to queue: ${added.join(", ")}`);
  } else {
    bLog.push(`  No new vertices added`);
  }
  bLog.push(`  Queue: [${bQueue.map((v) => v + 1).join(", ")}]`);

  redraw();
  document.getElementById("bProtocol").textContent = bLog.join("\n");
}

function resetBFS() {
  for (let i = 0; i < n; i++) {
    nodeColorsB[i] = "white";
    for (let j = 0; j < n; j++) bTree[i][j] = 0;
  }
  document.getElementById("btnBStep").disabled = false;
  document.getElementById("bResults").style.display = "none";
  document.getElementById("bProtocol").textContent =
    'Click "Next Step" to start traversal';
  redraw();
  initBFS();
}

function showBResults() {
  document.getElementById("bResults").style.display = "block";

  let vectorText = "Vertex → visit order:\n";
  for (let i = 0; i < bOrder.length; i++) {
    vectorText += `  vertex ${bOrder[i] + 1} → ${i + 1}\n`;
  }

  const notVisited = [];
  for (let i = 0; i < n; i++) {
    if (!bVisited[i]) notVisited.push(i + 1);
  }
  if (notVisited.length > 0)
    vectorText += `  (not visited: ${notVisited.join(", ")})`;

  document.getElementById("bVector").textContent = vectorText;
  renderMatrix(bTree, document.getElementById("tBTree"));
}

let dVisited = new Array(n).fill(false);
let dStack = [];
let dParent = new Array(n).fill(-1);
let dOrder = [];
let dLog = [];
let dDone = false;
let dStep = 0;

function initDFS() {
  dVisited = new Array(n).fill(false);
  dStack = [];
  dParent = new Array(n).fill(-1);
  dOrder = [];
  dLog = [];
  dDone = false;

  const start = findStart(dVisited);
  if (start === -1) {
    document.getElementById("dProtocol").textContent =
      "No vertices with outgoing edges.";
    dDone = true;
    return;
  }

  dStack.push(start);
  dVisited[start] = true;
  nodeColorsD[start] = "#1851fd";

  dLog.push(`DFS start. Starting vertex: ${start + 1}`);
  dLog.push(`Stack: [${dStack.map((v) => v + 1).join(", ")}]`);

  activeMode = "dfs";
  redraw();
  document.getElementById("dProtocol").textContent = dLog.join("\n");
}

function dNextStep() {
  if (dDone) return;
  activeMode = "dfs";

  if (dStack.length === 0) {
    const next = findStart(dVisited);
    if (next === -1) {
      dDone = true;
      document.getElementById("btnDStep").disabled = true;
      dLog.push("\nDFS completed!");
      dLog.push(
        `Visit order: ${dOrder.map((v) => v + 1).join(" → ")}`,
      );
      document.getElementById("dProtocol").textContent = dLog.join("\n");
      showDFSResults();
      return;
    }
    dStack.push(next);
    dVisited[next] = true;
    nodeColorsD[next] = "#1851fd";
    dLog.push(`\nContinue from vertex ${next + 1}`);
    dLog.push(`Stack: [${dStack.map((v) => v + 1).join(", ")}]`);
    redraw();
    document.getElementById("dProtocol").textContent = dLog.join("\n");
    return;
  }

  const current = dStack[dStack.length - 1];

  let found = -1;
  for (let j = 0; j < n; j++) {
    if (dirMatrix[current][j] === 1 && j !== current && !dVisited[j]) {
      found = j;
      break;
    }
  }

  if (found !== -1) {
    dVisited[found] = true;
    dParent[found] = current;
    dStack.push(found);
    nodeColorsD[found] = "#1851fd";
    dTree[current][found] = 1;

    dStep++;
    dLog.push(
      `\nStep ${dStep}: from vertex ${current + 1} go to ${found + 1}`,
    );
    dLog.push(`  Stack: [${dStack.map((v) => v + 1).join(", ")}]`);
  } else {
    dStack.pop();
    dOrder.push(current);
    nodeColorsD[current] = "#0cd7ff";

    dStep++;
    dLog.push(`\nStep ${dStep}: return from vertex ${current + 1}`);
    dLog.push(`  Stack: [${dStack.map((v) => v + 1).join(", ")}]`);
  }

  redraw();
  document.getElementById("dProtocol").textContent = dLog.join("\n");
}

function resetDFS() {
  nodeColorsD = new Array(n).fill("white");
  for (let i = 0; i < n; i++) dTree[i] = new Array(n).fill(0);
  document.getElementById("btnDStep").disabled = false;
  document.getElementById("dResults").style.display = "none";
  document.getElementById("dProtocol").textContent =
    'Click "Next Step" to start DFS';
  activeMode = "dfs";
  redraw();
  initDFS();
}

function showDFSResults() {
  document.getElementById("dResults").style.display = "block";

  let text = "Vertex → visit order:\n";
  for (let i = 0; i < dOrder.length; i++) {
    text += `  vertex ${dOrder[i] + 1} → ${i + 1}\n`;
  }
  const notVisited = [];
  for (let i = 0; i < n; i++) {
    if (!dVisited[i]) notVisited.push(i + 1);
  }
  if (notVisited.length > 0)
    text += `  (not visited: ${notVisited.join(", ")})`;

  document.getElementById("dVector").textContent = text;
  renderMatrix(dTree, document.getElementById("tDTree"));
}

initBFS();
initDFS(); 

// Breadth-first search finds a shortest path in an unweighted graph.
export function bfs(graph, start, goal) {
  if (!graph.hasVertex(start) || !graph.hasVertex(goal)) return { path: [], visited: [], queueTrace: [] };
  const queue = [start], previous = new Map([[start, null]]);
  const visited = [], queueTrace = [];
  while (queue.length) {
    const current = queue.shift();
    visited.push(current);
    queueTrace.push({ removed: current, remaining: [...queue] });
    if (current === goal) break;
    for (const next of graph.neighbors(current)) {
      if (!previous.has(next)) { previous.set(next, current); queue.push(next); }
    }
  }
  if (!previous.has(goal)) return { path: [], visited, queueTrace };
  const path = [];
  for (let at = goal; at !== null; at = previous.get(at)) path.unshift(at);
  return { path, visited, queueTrace };
}
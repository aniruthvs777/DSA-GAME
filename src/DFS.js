// DFS explores one branch deeply before backtracking.
export function dfs(graph, start) {
  if (!graph.hasVertex(start)) return [];
  const visited = [], seen = new Set(), stack = [start];
  while (stack.length) {
    const current = stack.pop();
    if (seen.has(current)) continue;
    seen.add(current); visited.push(current);
    const neighbors = graph.neighbors(current);
    for (let i = neighbors.length - 1; i >= 0; i--) if (!seen.has(neighbors[i])) stack.push(neighbors[i]);
  }
  return visited;
}
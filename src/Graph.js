// Walkable coordinates are graph vertices. Edges connect valid neighbors.
export class Graph {
  constructor() { this.adjacency = new Map(); }
  addVertex(id) { if (!this.adjacency.has(id)) this.adjacency.set(id, []); }
  addEdge(a, b) {
    this.addVertex(a); this.addVertex(b);
    if (!this.adjacency.get(a).includes(b)) this.adjacency.get(a).push(b);
    if (!this.adjacency.get(b).includes(a)) this.adjacency.get(b).push(a);
  }
  neighbors(id) { return this.adjacency.get(id) || []; }
  hasVertex(id) { return this.adjacency.has(id); }
}
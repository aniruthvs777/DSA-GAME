# Viva Questions and Answers

1. **What is a 2D array?** An array containing rows and columns; this project uses it to represent maze tiles.
2. **Why use a graph?** It models which walkable cells are connected.
3. **What is a vertex?** A node in a graph; here it represents a traversable grid cell.
4. **What is an edge?** A connection between adjacent walkable cells.
5. **What is BFS?** Breadth-first search explores neighbors level by level.
6. **Why does BFS find a shortest path here?** Each movement edge has equal cost, so the first discovered route to a goal uses the fewest edges.
7. **What is BFS complexity?** O(V + E) time and O(V) space.
8. **What is DFS?** Depth-first search explores one branch before backtracking.
9. **BFS vs DFS?** BFS is useful for shortest paths in unweighted graphs; DFS is useful for exploration and reachability.
10. **What is a stack?** A LIFO structure: last in, first out.
11. **How is Stack used?** Each successful move stores a snapshot; Undo pops it.
12. **What is a queue?** A FIFO structure: first in, first out.
13. **How is Queue used?** It processes scheduled dungeon events in order.
14. **What is a linked list?** Nodes connected by references such as `next`.
15. **Why not use an array for artifacts?** The exercise specifically demonstrates node-based insertion, searching, removal, and traversal.
16. **What does `next` store?** A reference to the next node, or `null` at the end.
17. **What is LocalStorage?** Browser storage that keeps small string values across refreshes.
18. **Why use JSON?** It converts a JavaScript object to a string for storage and back.
19. **What does Undo restore?** Player position, grid, inventory, key/switch/door state, treasure, and move count.
20. **How do you run tests?** Run `npm test` in the project directory with Node.js installed.

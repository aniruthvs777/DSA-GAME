# Algorithms and Data Structures

## Grid representation
The maze is a two-dimensional array of characters. `#` is a wall, `.` is a path, `P` is the initial player position, `K` a key, `D` a locked door, `S` a switch, `T` treasure, and `E` the exit. Row/column coordinates identify each cell.

## Graph representation
Each traversable cell is a vertex identified as `"row,column"`. An edge connects two orthogonally adjacent traversable cells. Walls are omitted. A closed door is omitted until unlocked.

## BFS pseudocode
```text
queue = [start]
previous[start] = null
while queue is not empty:
    current = remove front of queue
    if current == goal: stop
    for each neighbor:
        if neighbor not visited:
            previous[neighbor] = current
            enqueue neighbor
reconstruct path by following previous from goal to start
```
BFS is O(V + E) time and O(V) space for a graph with V vertices and E edges.

## DFS pseudocode
```text
stack = [start]
while stack not empty:
    current = pop stack
    if current was not visited:
        mark visited
        push unvisited neighbors
```
DFS is O(V + E) time and O(V) space.

## Stack
`push` adds a move snapshot; `pop` removes the newest snapshot. Both are O(1) amortized for JavaScript arrays.

## Queue
`enqueue` adds to the back and `dequeue` removes from the front. This simple implementation uses an array; `shift()` is O(n), suitable for this small game.

## Singly linked list
Each artifact node contains an id, display name, icon, and `next` pointer. Search/removal/traversal are O(n); insertion at the tail is O(n) in this simple version.

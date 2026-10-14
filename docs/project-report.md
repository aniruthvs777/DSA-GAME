# Project Report: Treasure Quest — The Lost Dungeon

## Abstract
Treasure Quest is a browser-based maze adventure designed to demonstrate core data structures and graph traversal algorithms through gameplay.

## Introduction
Maze games provide a visual setting for grid representation, pathfinding, movement history, and inventory management.

## Problem statement
A basic maze can be playable but may not demonstrate how DSA techniques solve practical problems.

## Objectives
Build a responsive 2D game; use a real stack for Undo, queue for scheduled events, linked list for artifacts, graph traversal for route hints, and LocalStorage for progress.

## Existing system and limitations
A simple grid maze typically offers limited feedback and little explicit connection to DSA.

## Proposed system
Five handcrafted chambers introduce keys, doors, switches, treasure, and exits. A DSA Lab explains the underlying structures.

## Requirements
Modern browser; VS Code Live Server or another local HTTP server. Node.js is required only to run tests.

## System design
`index.html` provides screens, `style.css` handles responsive styling, `script.js` coordinates gameplay, and `src/` contains independent modules.

## Module descriptions
- `levels.js`: handcrafted maps.
- `Stack.js`: movement snapshots.
- `Queue.js`: FIFO game events.
- `LinkedList.js`: artifact nodes.
- `Graph.js`, `BFS.js`, `DFS.js`: graph representation and traversal.
- `storage.js`: LocalStorage progress.

## DSA integration
The maze is a 2D array. Walkable cells become graph vertices. BFS calculates a shortest path to the next objective. Undo uses a stack. Artifacts are stored in a singly linked list. Scheduled dungeon pulses demonstrate FIFO queue processing.

## Testing
Run `npm test`. The included automated tests exercise the DSA modules. Complete the manual test cases in `test-cases.md` before presenting the project.

## Results
The source provides the core game screens, five map definitions, DSA modules, persistence, and test cases. Actual browser acceptance should be confirmed on the target computer before claiming all gameplay paths are verified.

## Limitations
BFS hints are not animated cell-by-cell. The Queue is used for scheduled events rather than enemy behavior. More thorough end-to-end browser tests are future work.

## Future enhancements
Animated BFS exploration, more rigorous map solvability tests, keyboard-accessible tile descriptions, and a browser automation suite.

## Conclusion
The project connects common DSA concepts to visible game mechanics while keeping the implementation small enough for a student to explain.

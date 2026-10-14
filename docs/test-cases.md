# Test Cases

| ID | Preconditions | Steps | Expected result |
|---|---|---|---|
| TC-01 | Project served locally | Open index.html | Main menu appears |
| TC-02 | Level 1 active | Press an arrow key toward a wall | Player does not move |
| TC-03 | Level active | Move successfully, then Undo | Previous position and reversible state return |
| TC-04 | Level active | Request the third hint | BFS route is highlighted when a route exists |
| TC-05 | Key level active | Reach key | Key enters linked-list inventory |
| TC-06 | Level with switch active | Step onto switch | Switch activates |
| TC-07 | Campaign active | Complete level | Score is shown and next level unlocks |
| TC-08 | Progress saved | Refresh browser | Unlocked levels and best scores persist |
| TC-09 | DSA Lab open | Run BFS / DFS demo | Traversal output appears |
| TC-10 | Node.js installed | Run `npm test` | Built-in test runner executes DSA tests |

Automated tests cover Stack, Queue, Linked List, Graph, BFS, DFS, and level definitions. Browser-only behaviors still require manual verification.

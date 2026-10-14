import test from "node:test";
import assert from "node:assert/strict";
import { Stack } from "../src/Stack.js";
import { Queue } from "../src/Queue.js";
import { LinkedList } from "../src/LinkedList.js";
import { Graph } from "../src/Graph.js";
import { bfs } from "../src/BFS.js";
import { dfs } from "../src/DFS.js";
import { LEVELS } from "../src/levels.js";

test("Stack follows last-in, first-out",()=>{const s=new Stack();assert.equal(s.pop(),undefined);s.push(1);s.push(2);assert.equal(s.pop(),2);assert.equal(s.peek(),1);});
test("Queue follows first-in, first-out",()=>{const q=new Queue();q.enqueue("a");q.enqueue("b");assert.equal(q.front(),"a");assert.equal(q.dequeue(),"a");assert.equal(q.dequeue(),"b");assert.equal(q.isEmpty(),true);});
test("Linked list inserts, searches, removes, traverses",()=>{const l=new LinkedList();l.insert("a","Key");l.insert("b","Gem");assert.equal(l.search("b").name,"Gem");assert.equal(l.remove("a"),true);assert.deepEqual(l.toArray().map(x=>x.id),["b"]);assert.equal(l.remove("missing"),false);});
test("Graph connects vertices both ways",()=>{const g=new Graph();g.addEdge("a","b");assert.deepEqual(g.neighbors("a"),["b"]);assert.deepEqual(g.neighbors("b"),["a"]);});
test("BFS returns a shortest path",()=>{const g=new Graph();g.addEdge("A","B");g.addEdge("A","C");g.addEdge("B","D");g.addEdge("C","D");const result=bfs(g,"A","D");assert.equal(result.path.length,3);assert.equal(result.path[0],"A");assert.equal(result.path.at(-1),"D");});
test("DFS visits all connected vertices",()=>{const g=new Graph();g.addEdge("A","B");g.addEdge("B","C");assert.deepEqual(new Set(dfs(g,"A")),new Set(["A","B","C"]));});
test("Five handcrafted levels are defined",()=>{assert.equal(LEVELS.length,5);for(const level of LEVELS){assert.ok(level.grid.length>0);assert.ok(level.grid.some(row=>row.includes("P")));assert.ok(level.grid.some(row=>row.includes("E")));}});

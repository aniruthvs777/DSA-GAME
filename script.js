import { LEVELS } from "./src/levels.js";
import { Stack } from "./src/Stack.js";
import { Queue } from "./src/Queue.js";
import { LinkedList } from "./src/LinkedList.js";
import { Graph } from "./src/Graph.js";
import { bfs } from "./src/BFS.js";
import { dfs } from "./src/DFS.js";
import { loadProgress, saveProgress, clearProgress } from "./src/storage.js";

const $ = id => document.getElementById(id);
const screens = ["menuScreen","gameScreen","completeScreen","levelsScreen","infoScreen","settingsScreen"];
let progress = loadProgress(), currentLevel = 0, grid = [], player = {r:1,c:1}, start = {r:1,c:1};
let moveHistory = new Stack(), artifacts = new LinkedList(), eventQueue = new Queue();
let moves = 0, hints = 0, treasure = 0, seconds = 0, timerId = null, startedAt = 0;
let hasKey = false, switchOn = false, doorOpen = false, paused = false, pathCells = [], soundOn = false;
let soundEnabled = false, reducedMotion = false, currentScore = 0;
const DIRS = {up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
const posId = (r,c) => `${r},${c}`;
function showScreen(id) { screens.forEach(s => $(s).classList.toggle("hidden", s !== id)); }
function formatTime(s) { return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }
function say(text) { $("message").textContent = text; $("boardStatus").textContent = text.length > 28 ? "New field note" : text; }
function playTone(freq=660) {
  if (!soundEnabled) return;
  try { const ctx = new AudioContext(), osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value=freq; gain.gain.value=.035; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.09); osc.onended=()=>ctx.close(); } catch {}
}
function parseLevel(index) {
  const level = LEVELS[index];
  grid = level.grid.map(row => row.split(""));
  for (let r=0;r<grid.length;r++) for(let c=0;c<grid[r].length;c++) if(grid[r][c]==="P"){player={r,c};grid[r][c]=".";}
  start = {...player}; hasKey=false; switchOn=false; doorOpen=false; moves=0; hints=0; treasure=0; seconds=0; currentScore=0; paused=false; pathCells=[];
  moveHistory.clear(); artifacts.clear(); eventQueue.clear();
}
function startLevel(index) {
  if (index >= LEVELS.length) { showScreen("menuScreen"); return; }
  if (index + 1 > progress.unlocked) { say("That level is still locked."); return; }
  currentLevel=index; parseLevel(index); showScreen("gameScreen");
  $("levelNumber").textContent=`LEVEL ${String(index+1).padStart(2,"0")}`;
  $("levelTitle").textContent=LEVELS[index].title; $("objective").textContent=LEVELS[index].objective;
  $("objectiveDetail").textContent=LEVELS[index].detail; $("hidePathBtn").classList.add("hidden");
  startedAt=Date.now(); clearInterval(timerId); timerId=setInterval(()=>{if(!paused){seconds=Math.floor((Date.now()-startedAt)/1000);$("timer").textContent=formatTime(seconds);}},1000);
  say("Use WASD or arrow keys to explore."); render();
}
function tileAt(r,c) { return grid[r]?.[c] ?? "#"; }
function buildGraph() {
  const graph=new Graph();
  for(let r=0;r<grid.length;r++) for(let c=0;c<grid[r].length;c++){
    const tile=tileAt(r,c); if(tile==="#" || (tile==="D"&&!doorOpen)) continue;
    if(tile==="K"&&!hasKey) { /* key cell is walkable */ }
    graph.addVertex(posId(r,c));
    for(const [dr,dc] of Object.values(DIRS)){const nr=r+dr,nc=c+dc,nt=tileAt(nr,nc);if(nt!=="#"&&nt!==undefined&&(nt!=="D"||doorOpen||hasKey))graph.addEdge(posId(r,c),posId(nr,nc));}
  }
  return graph;
}
function render() {
  const board=$("board"); board.innerHTML=""; const cols=grid[0].length; board.style.setProperty("--cols",cols);
  for(let r=0;r<grid.length;r++) for(let c=0;c<grid[r].length;c++){
    const tile=tileAt(r,c), cell=document.createElement("div"); cell.className="tile";
    if(tile==="#") {cell.classList.add("wall");cell.textContent="";}
    else {
      cell.classList.add("path");
      if(tile==="D"&&!doorOpen){cell.classList.add("door");cell.textContent="🚪";}
      if(tile==="K"&&!hasKey)cell.textContent="🗝️";
      if(tile==="S"&&!switchOn)cell.textContent="⚑";
      if(tile==="T")cell.textContent="💎";
      if(tile==="E"){cell.classList.add("exit");cell.textContent="◇";}
    }
    if(pathCells.includes(posId(r,c)) && !(player.r===r&&player.c===c))cell.classList.add("hint-path");
    if(player.r===r&&player.c===c){cell.textContent="🧙";cell.style.background="#194956";cell.style.borderColor="#55d9e8";}
    board.appendChild(cell);
  }
  $("moves").textContent=moves; $("timer").textContent=formatTime(seconds); $("score").textContent=scoreNow();
  const objectives=(hasKey||!LEVELS[currentLevel].keyRequired?1:0)+(switchOn||!LEVELS[currentLevel].switchRequired?1:0);
  const total=(LEVELS[currentLevel].keyRequired?1:0)+(LEVELS[currentLevel].switchRequired?1:0);
  $("progressBar").style.width=(total?objectives/total*100:100)+"%"; $("progressText").textContent=`${objectives} / ${total} required items complete`;
  $("inventory").innerHTML=artifacts.toArray().map(a=>`<span class="artifact">${a.icon} ${a.name}</span>`).join("")||'<span class="muted">Nothing collected yet.</span>';
}
function scoreNow(){return Math.max(0,1000 + treasure*150 - moves*5 - seconds*2 - hints*40);}
function move(direction) {
  if(paused) return;
  const [dr,dc]=DIRS[direction]||[0,0],nr=player.r+dr,nc=player.c+dc,tile=tileAt(nr,nc);
  if(tile==="#"||tile===undefined){say("A solid wall blocks that way.");playTone(180);return;}
  if(tile==="D"&&!doorOpen){if(!hasKey&&!switchOn){say("The door is sealed. Find a key or activate the switch.");return;}doorOpen=true;grid[nr][nc]=".";say("The key turns. The door opens!");playTone(820);}
  const snapshot={player:{...player},grid:grid.map(row=>row.slice()),hasKey,switchOn,doorOpen,treasure,artifacts:artifacts.toArray(),moves};
  moveHistory.push(snapshot); player={r:nr,c:nc};moves++;pathCells=[];
  if(tile==="K"&&!hasKey){hasKey=true;grid[nr][nc]=".";artifacts.insert("key","Dungeon Key","🗝️");say("Key collected. A locked door may now open.");playTone(720);}
  if(tile==="S"&&!switchOn){switchOn=true;grid[nr][nc]=".";say("Switch activated! The ancient mechanism clicks.");playTone(590);}
  if(tile==="T"){treasure++;grid[nr][nc]=".";artifacts.insert(`gem-${currentLevel}-${nr}-${nc}`,"Crystal","💎");say("Crystal collected: bonus points earned.");playTone(900);}
  // Queue drives a visible, predictable event: every valid move schedules a dungeon pulse.
  eventQueue.enqueue({type:"pulse",move:moves});
  const event=eventQueue.dequeue(); if(event && !["K","S","T"].includes(tile)) say(tile==="D"?"Doorway cleared.": "The dungeon pulse settles. Keep exploring.");
  render();
  if(tile==="E") {
    const level=LEVELS[currentLevel];
    if((level.keyRequired&&!hasKey)||(level.switchRequired&&!switchOn)){say("The exit seal is still active. Complete the required objective first.");return;}
    completeLevel();
  }
}
function restoreArtifacts(items){artifacts.clear();items.forEach(a=>artifacts.insert(a.id,a.name,a.icon));}
function undo() {
  const old=moveHistory.pop(); if(!old){say("Nothing to undo yet.");return;}
  player=old.player;grid=old.grid;hasKey=old.hasKey;switchOn=old.switchOn;doorOpen=old.doorOpen;treasure=old.treasure;moves=old.moves;restoreArtifacts(old.artifacts);pathCells=[];
  say("Undone. Your previous position and inventory are restored.");render();
}
function currentObjectiveTarget(){
  const level=LEVELS[currentLevel];
  if(level.keyRequired&&!hasKey){return findTile("K");}
  if(level.switchRequired&&!switchOn){return findTile("S");}
  return findTile("E");
}
function findTile(tile){for(let r=0;r<grid.length;r++)for(let c=0;c<grid[r].length;c++)if(grid[r][c]===tile)return {r,c};return null;}
function requestHint(){
  hints++;
  if(hints%3===1){const level=LEVELS[currentLevel];say(level.keyRequired&&!hasKey?"Clue: look for a small golden key before approaching the exit.":level.switchRequired&&!switchOn?"Clue: a switch marked ⚑ controls the old mechanism.":"Clue: follow the corridors to the diamond exit.");}
  else if(hints%3===2){const target=currentObjectiveTarget();if(!target){say("Explore the corridors and look for the exit.");return;}const dr=target.r-player.r,dc=target.c-player.c;const direction=Math.abs(dr)>Math.abs(dc)?(dr<0?"up":"down"):(dc<0?"left":"right");say(`Try moving ${direction.toUpperCase()} toward your next objective.`);}
  else {
    const target=currentObjectiveTarget();if(!target){say("No route target found.");return;}
    const graph=buildGraph(),result=bfs(graph,posId(player.r,player.c),posId(target.r,target.c));
    if(!result.path.length){say("No valid route is available from here. Check your objectives and opened doors.");return;}
    pathCells=result.path;$("hidePathBtn").classList.remove("hidden");say(`BFS found a valid route of ${result.path.length-1} steps to your next objective.`);render();
  }
  render();
}
function completeLevel(){
  clearInterval(timerId);const score=scoreNow();progress.bestScores[currentLevel]=Math.max(progress.bestScores[currentLevel]||0,score);
  progress.bestTimes[currentLevel]=Math.min(progress.bestTimes[currentLevel]??Infinity,seconds);
  progress.totalScore=Object.values(progress.bestScores).reduce((a,b)=>a+b,0);
  progress.unlocked=Math.max(progress.unlocked,Math.min(LEVELS.length,currentLevel+2));
  const done=Object.keys(progress.bestScores).length;
  if(done>=1&&!progress.achievements.includes("first"))progress.achievements.push("first");
  if(treasure>=3&&!progress.achievements.includes("collector"))progress.achievements.push("collector");
  if(done===LEVELS.length&&!progress.achievements.includes("explorer"))progress.achievements.push("explorer");
  saveProgress(progress);$("finalScore").textContent=score;$("finalMoves").textContent=moves;$("finalTime").textContent=formatTime(seconds);$("finalTreasure").textContent=treasure;
  $("completeTitle").textContent=currentLevel===LEVELS.length-1?"The Lost Dungeon is yours!":"A path well travelled."; $("nextBtn").textContent=currentLevel===LEVELS.length-1?"Campaign Complete":"Next Level →";$("nextBtn").disabled=currentLevel===LEVELS.length-1;
  playTone(990);showScreen("completeScreen");
}
function showLevels(){
  $("levelCards").innerHTML=LEVELS.map((l,i)=>{const unlocked=i<progress.unlocked,score=progress.bestScores[i];return `<button class="level-card ${unlocked?"":"locked"}" data-level="${i}" ${unlocked?"":"disabled"}><span class="chapter">CHAPTER ${String(i+1).padStart(2,"0")}</span><h3>${l.title}</h3><p>${l.objective}</p><div class="level-state">${score!==undefined?`✓ Best score: ${score}`:unlocked?"◇ Ready to explore":"🔒 Locked"}</div></button>`;}).join("");
  $("levelCards").querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>startLevel(Number(b.dataset.level))));showScreen("levelsScreen");
}
function showInfo(kind){
  const content={
    how:["FIELD GUIDE","How to Play",`<h3>Controls</h3><ul><li>Move with <code>W A S D</code> or the arrow keys.</li><li>On phones, use the directional pad under the board.</li><li>Collect required keys and activate switches before reaching the exit.</li><li>Undo reverses your last successful move, including collected items.</li><li>Hints cycle through a clue, a direction, and a BFS path. Each hint use reduces score by 40.</li></ul><h3>Scoring</h3><p>Score = max(0, 1000 + 150 × treasure − 5 × moves − 2 × seconds − 40 × hints). Completing a level records your score and unlocks the next chapter.</p>`],
    dsa:["LEARN BY EXPLORING","DSA Lab",`<h3>Data structures inside this game</h3><ul><li><b>2D array:</b> each row of the maze is an array of tile symbols.</li><li><b>Graph:</b> each traversable cell is a vertex; adjacent traversable cells are edges.</li><li><b>BFS:</b> finds a shortest path on the current graph for hints.</li><li><b>DFS:</b> visits one branch deeply before backtracking.</li><li><b>Stack:</b> movement snapshots are pushed and popped for Undo.</li><li><b>Queue:</b> valid moves schedule a dungeon pulse event; the oldest event is processed first.</li><li><b>Singly linked list:</b> collected artifacts are connected through node references.</li></ul><div class="demo-row"><button class="primary" id="bfsDemo">Run BFS demo</button><button class="secondary" id="dfsDemo">Run DFS demo</button><div id="algoOutput" class="demo-output">Run an algorithm to see its traversal.</div></div><h3>Linked list structure</h3><div class="demo-output">HEAD → [Key] → [Crystal] → null<br><small>In gameplay, these are actual nodes linked by each node's <code>next</code> reference.</small></div><h3>Stack and Queue demo</h3><div class="demo-row"><button class="secondary" id="stackDemo">Push / Pop stack</button><button class="secondary" id="queueDemo">Enqueue / Dequeue</button><div id="structureOutput" class="demo-output">Try a demonstration.</div></div>`],
  };
  const data=content[kind];$("infoEyebrow").textContent=data[0];$("infoTitle").textContent=data[1];$("infoContent").innerHTML=data[2];showScreen("infoScreen");
  if(kind==="dsa"){
    $("bfsDemo").onclick=()=>{const g=sampleGraph(),res=bfs(g,"1,1","3,5");$("algoOutput").textContent=`BFS visited ${res.visited.length} cells. Shortest path (${res.path.length-1} steps): ${res.path.join(" → ")}`;};
    $("dfsDemo").onclick=()=>{const order=dfs(sampleGraph(),"1,1");$("algoOutput").textContent=`DFS visit order: ${order.join(" → ")}`;};
    let st=new Stack(),q=new Queue();
    $("stackDemo").onclick=()=>{st.push("Key");st.push("Crystal");const removed=st.pop();$("structureOutput").textContent=`Pushed Key, Crystal; popped ${removed}. Stack now: ${st.items.join(", ")||"empty"}`;};
    $("queueDemo").onclick=()=>{q.enqueue("Pulse A");q.enqueue("Pulse B");const removed=q.dequeue();$("structureOutput").textContent=`Enqueued A then B; dequeued ${removed}. Front: ${q.front()}`;};
  }
}
function sampleGraph(){const g=new Graph(),rows=["#######","#.....#","#.###.#","#.....#","#######"];for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++)if(rows[r][c]==="."){g.addVertex(posId(r,c));for(const [dr,dc]of Object.values(DIRS)){const nr=r+dr,nc=c+dc;if(rows[nr]?.[nc]===".")g.addEdge(posId(r,c),posId(nr,nc));}}return g;}
function restart(){if(confirm("Restart this level? Your current moves will be lost."))startLevel(currentLevel);}
function togglePause(){paused=!paused;$("pauseBtn").textContent=paused?"▶ Resume":"Ⅱ Pause";say(paused?"Paused. Take your time.":"Adventure resumed.");}
$("startBtn").onclick=()=>startLevel(Math.min(progress.unlocked-1,0));
$("continueBtn").onclick=()=>startLevel(Math.max(0,Math.min(LEVELS.length-1,progress.unlocked-1)));
$("levelsBtn").onclick=showLevels;
$("howBtn").onclick=()=>showInfo("how");
$("dsaBtn").onclick=()=>showInfo("dsa");
$("settingsBtn").onclick=()=>showScreen("settingsScreen");
$("homeLink").onclick=e=>{e.preventDefault();clearInterval(timerId);showScreen("menuScreen");};
$("pauseBtn").onclick=togglePause;$("undoBtn").onclick=undo;$("hintBtn").onclick=requestHint;$("restartBtn").onclick=restart;
$("menuBtn").onclick=()=>{clearInterval(timerId);showScreen("menuScreen");};
$("hidePathBtn").onclick=()=>{pathCells=[];$("hidePathBtn").classList.add("hidden");render();say("Suggested path hidden.");};
$("nextBtn").onclick=()=>startLevel(currentLevel+1);$("replayBtn").onclick=()=>startLevel(currentLevel);$("completeMenuBtn").onclick=()=>showScreen("menuScreen");
document.querySelectorAll("[data-home]").forEach(b=>b.onclick=()=>showScreen("menuScreen"));
document.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>move(b.dataset.move));
document.addEventListener("keydown",e=>{if($("gameScreen").classList.contains("hidden"))return;const key=e.key.toLowerCase(),map={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};if(map[key]){e.preventDefault();move(map[key]);}if(key==="escape")togglePause();});
$("soundBtn").onclick=()=>{soundEnabled=!soundEnabled;$("soundBtn").textContent=`♫ Sound: ${soundEnabled?"On":"Off"}`;$("soundToggle").checked=soundEnabled;playTone(600);};
$("soundToggle").onchange=e=>{soundEnabled=e.target.checked;$("soundBtn").textContent=`♫ Sound: ${soundEnabled?"On":"Off"}`;};
$("motionToggle").onchange=e=>{reducedMotion=e.target.checked;document.body.classList.toggle("reduced",reducedMotion);};
$("resetSaveBtn").onclick=()=>{if(confirm("Reset all unlocked levels and saved scores? This cannot be undone.")){clearProgress();progress=loadProgress();showLevels();}};
showScreen("menuScreen");

// # wall, . path, P player, K key, D locked door, S switch, T treasure, E exit.
export const LEVELS = [
  { title:"The Forgotten Entrance", objective:"Find the key and reach the exit.", detail:"Collect the key (🗝), then step onto the exit (◇).", keyRequired:true, grid:[
    "#########","#P..#..E#","#.#.#.#.#","#.#...#.#","#.###.#.#","#K....T.#","#########"
  ]},
  { title:"The Locked Corridor", objective:"Collect the key to unlock the bronze door.", detail:"The bronze door blocks the direct corridor. Find the key first.", keyRequired:true, grid:[
    "##########","#P...#...E#".slice(0,10),"#.#D.#.#.#","#.#..K...#","#.####.#.#","#......T.#","##########"
  ]},
  { title:"The Switch Room", objective:"Activate the switch before leaving.", detail:"Find and activate the switch (⚑). The switch opens the route to the exit.", keyRequired:false, switchRequired:true, grid:[
    "##########","#P....#..E#".slice(0,10),"#.#.#.#..#","#...#....#","###S###..#","#T.......#","##########"
  ]},
  { title:"The Treasure Vault", objective:"Reach the exit; treasure is optional.", detail:"Treasure earns bonus points. Plan an efficient route to the exit.", keyRequired:false, grid:[
    "############","#P..#.....E#","#.#.#.###..#","#.#...T....#","#.#####.##.#","#T......T..#","############"
  ]},
  { title:"The Lost Dungeon", objective:"Collect the key, activate the switch, and escape.", detail:"Collect the key and activate the switch. Treasure is optional.", keyRequired:true, switchRequired:true, grid:[
    "###########","#P..#....E#","#.#.#.##..#","#.#K...#..#","#.###D.#..#","#...#..S..#","#T..#...T.#","###########"
  ]}
];
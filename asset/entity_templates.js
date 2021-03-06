Game.EntityGenerator = new Game.Generator('entities',Game.Entity);

Game.EntityGenerator.learn({
  name: 'avatar',
  chr:'S',
  fg:'#dda',
  sightRadius: 100,//maybe issues here
  maxHp: 15,
  attackAvoid: 1,
  attackDamage: 2,
  swappable: false, //not working
  mixins: ["PlayerActor", "PlayerMessager", "WalkerCorporeal", "Sight", "MapMemory", "HitPoints", "Chronicle", "MeleeAttacker", "MeleeDefender", "Inventory"]
});

Game.EntityGenerator.learn({
  name: 'Weakened Cellar Troll',
  chr:'T', //T
  fg:'#aaa',
  maxHp: 4,
  attackDamage: 3,
  sightRadius: 5,
  mixins: ["HitPoints","Sight", "AlertableChaserActor", "WalkerCorporeal", "MeleeAttacker","MeleeDefender"]
});

Game.EntityGenerator.learn({
  name: 'Cellar Troll',
  chr:'T',
  fg:'#cc0000', //red
  maxHp: 8,
  attackDamage: 3,
  sightRadius: 5,
  mixins: ["HitPoints","Sight", "AlertableChaserActor", "WalkerCorporeal", "MeleeAttacker","MeleeDefender"]
});

Game.EntityGenerator.learn({
  name: 'cave wyrm',
  chr:'~',
  fg:'#3385ff', //blue #0000e6
  maxHp: 5,
  sightRadius: 4,
  attackDamage: 2,
  wanderChaserActionDuration: 1200,
  attackActionDuration: 3000,
  mixins: ["HitPoints", "Sight", "WanderChaserActor", "WalkerCorporeal", "MeleeAttacker"]
});

Game.EntityGenerator.learn({
  name: 'creepy wraith',
  chr:'W',
  fg:'#8a00e6', //purple
  maxHp: 8,
  sightRadius: 4,
  attackDamage: 4,
  wanderChaserActionDuration: 1200,
  attackActionDuration: 3000,
  mixins: ["HitPoints", "Sight", "WanderChaserActor", "WalkerCorporeal", "MeleeAttacker"]
});

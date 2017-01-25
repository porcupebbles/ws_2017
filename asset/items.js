Game.ItemGenerator = new Game.Generator('items',Game.Item);

Game.ItemGenerator.learn({
  name: 'rock',
  chr:'@',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Misc,
});

Game.ItemGenerator.learn({
  name: 'rusty dagger',
  chr:'t',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Weapon,
  Damage: 3,
  Durability: 3,
  mixins: ["MeleeAttack"]
});

Game.ItemGenerator.learn({
  name: 'leather cuirass',
  chr:'H',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Armor,
  maxHp: 5,
  currentHp: 5,
  mixins: ["Armor"]
});

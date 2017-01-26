Game.ItemGenerator = new Game.Generator('items',Game.Item);

Game.ItemGenerator.learn({
  name: 'rock',
  chr:'@',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Misc,
  mixins: ["Useless"]
});

Game.ItemGenerator.learn({
  name: 'healing potion',
  chr:'p',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Misc,
  healingAmount: 10,
  mixins: ["Healing"]
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
  name: 'Pugnacious Polearm',
  chr:'P',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Weapon,
  Damage: 5,
  Durability: 2,
  mixins: ["MeleeAttack"]
});
Game.ItemGenerator.learn({
  name: 'Swell Sword',
  chr:'!',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Weapon,
  Damage: 4,
  Durability: 4,
  mixins: ["MeleeAttack"]
});
Game.ItemGenerator.learn({
  name: 'Mace (*not* pepper)',
  chr:'?',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Weapon,
  Damage: 3,
  Durability: 3,
  mixins: ["MeleeAttack"]
});

Game.ItemGenerator.learn({
  name: 'leather mail',
  chr:'m',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Armor,
  maxHp: 7,
  currentHp: 7,
  mixins: ["Armor"]
});
Game.ItemGenerator.learn({
  name: 'bucket helmet',
  chr:'h',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Armor,
  maxHp: 3,
  currentHp: 3,
  mixins: ["Armor"]
});
Game.ItemGenerator.learn({
  name: 'ring of protection',
  chr:'m',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Armor,
  maxHp: 5,
  currentHp: 5,
  mixins: ["Armor"]
});
Game.ItemGenerator.learn({
  name: 'pair of plate pants',
  chr:'m',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Armor,
  maxHp: 6,
  currentHp: 6,
  mixins: ["Armor"]
});

Game.ItemGenerator.learn({
  name: 'teleportation stone',
  chr:'*',//String.fromCharCode(174),
  fg:Game.Item.DEFAULT_COLOR_Misc,
  mixins: ["Teleporting"]
});

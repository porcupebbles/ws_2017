Game.ItemMixin = {};

Game.ItemMixin.MeleeAttack = {
  META: {
    mixinName: 'MeleeAttack',
    mixinGroup: 'CombatItems',
    listeners: {
      'attack': function(){
        this.setDurability(Game.util.calcBreak(this.getDurability()));
        if(this.getDurability() == 0){
          //send alert here
        }
        return this.attr._MeleeAttack_attr.Damage;
      },

    },
    stateNamespace: '_MeleeAttack_attr',
    stateModel: {
      Damage: 1,
      Durability: 1
    }
  },
  getDamage: function(){
    return this.attr._MeleeAttack_attr.Damage;
  },
  setDamage: function(new_dam){
    this.attr._MeleeAttack_attr.Damage = new_dam;
  },
  getDurability: function(){
    return this.attr._MeleeAttack_attr.Durability;
  },
  setDurability: function(new_dur){
    this.attr._MeleeAttack_attr.Durability = new_dur;
  }
},

Game.ItemMixin.Armor = {
  META: {
    mixinName: 'Armor',
    mixinGroup: 'CombatItems',
    listeners: {

    },
    stateNamespace: '_Armor_attr',
    stateModel: {
      MaxHp: 1,
      currentHp: 1
    },
    getMaxHp: function(){
      return this.attr._Armor_attr.MaxHp;
    },
    getCurrentHp: function(){
      return this.attr._Armor_attr.currentHp;
    },
    takeHit: function(amt){
      if(this.attr._Armor_attr.currentHp >= amt){
        this.attr._Armor_attr.currentHp -= amt;
        return 0;
      }
      //destroy this
      return amt - this.attr._Armor_attr.currentHp;
    }
  }
}

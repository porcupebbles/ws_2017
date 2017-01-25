Game.ItemMixin = {};

Game.ItemMixin.MeleeAttack = {
  META: {
    mixinName: 'MeleeAttack',
    mixinGroup: 'CombatItems',
    listeners: {
      'prepare_attack': function(evtData){
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
      'used': function(evtData){
        if(Game.messageCounters.armor == 1){
          Game.Message.send("Sven wonders what you want him to do with this armor. Sven is already wearing it. What more do you want of Sven?");
          Game.messageCounters.armor = 2;
        }else if(Game.messageCounters.armor == 2){
          Game.Message.send("Sven thinks armor is for wearing. Please enlighten Sven if you know something Sven doesn't");
          Game.messageCounters.armor = 3;
        }else if (Game.messageCounters.armor == 3){
          Game.Message.send("Sven thinks you aren't that bright. Maybe next time Sven asks you to \"use\" your shirt");
          Game.Message.send("What does that mean? Sven doesn't know and Sven doesn't care");
          Game.messageCounters.armor = 4;
        }else{
          Game.Message.send("Sven can't use Armor");
        }
      },
      'hit_took': function(evtData){
        return this.takeHit(evtData.damageAmount);
      }

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
      if(Game.messageCounters.armor == 1){
        Game.Message.send("Sven wonders what you want him to do with this armor. Sven is already wearing it. What more do you want of Sven?");
        Game.messageCounters.armor = 2;
      }else if(Game.messageCounters.armor == 2){
        Game.Message.send("Sven thinks armor is for wearing. Please enlighten Sven if you know something Sven doesn't");
        Game.messageCounters.armor = 3;
      }else if (Game.messageCounters.armor == 3){
        Game.Message.send("Sven thinks you aren't that bright. Maybe next time Sven asks you to \"use\" your shirt");
        Game.Message.send("What does that mean? Sven doesn't know and Sven doesn't care");
        Game.messageCounters.armor = 4;
      }else{
        Game.Message.send("Sven can't use Armor");
      }
      Game.Message.send("Sven is saddened by the loss of his " + this.getName());
      this.destroy();

      return amt - this.attr._Armor_attr.currentHp;
    }
  }
}

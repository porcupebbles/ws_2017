Game.ItemMixin = {};

Game.ItemMixin.MeleeAttack = {
  META: {
    mixinName: 'MeleeAttack',
    mixinGroup: 'CombatItems',
    listeners: {
      'prepare_attack': function(evtData){
        this.setDurability(Game.util.calcBreak(this.getDurability()));
        if(this.getDurability() == 0){
          this.destroy();
          Game.Message.send("Sven's trusty "+this.getName() + " has broken");
        }
        return {weaponAttack:this.attr._MeleeAttack_attr.Damage};
      }

    },
    stateNamespace: '_MeleeAttack_attr',
    stateModel: {
      Damage: 1,
      Durability: 1
    },
    init: function (template) {
      this.attr._MeleeAttack_attr.Damage = template.Damage || 1;
      this.attr._MeleeAttack_attr.Durability = template.Durability || 1;
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
        return {damageLeft: this.takeHit(evtData.damageAmount)};
      }

    },
    stateNamespace: '_Armor_attr',
    stateModel: {
      MaxHp: 1,
      currentHp: 1
    },
    init: function (template) {
      this.attr._Armor_attr.MaxHp = template.maxHp || 1;
      this.attr._Armor_attr.currentHp = template.currentHp || 1;
    }
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
    if(Game.messageCounters.armor_loss < 5){
      Game.Message.send("Sven is saddened by the loss of his " + this.getName());
      Game.messageCounters.armor_loss = Game.messageCounters+1;
    }else{
      Game.Message.send("Sven's " + this.getName()+ " broke. He's kind of over it.");
    }

    this.destroy();

    return amt - this.attr._Armor_attr.currentHp;
  }

};
Game.ItemMixin.MeleeAttack = {
  META: {
    mixinName: 'MeleeAttack',
    mixinGroup: 'CombatItems',
    listeners: {
      'prepare_attack': function(evtData){
        this.setDurability(Game.util.calcBreak(this.getDurability()));
        if(this.getDurability() == 0){
          this.destroy();
          Game.Message.send("Sven's trusty "+this.getName() + " has broken");
        }
        return {weaponAttack:this.attr._MeleeAttack_attr.Damage};
      }

    },
    stateNamespace: '_MeleeAttack_attr',
    stateModel: {
      Damage: 1,
      Durability: 1
    },
    init: function (template) {
      this.attr._MeleeAttack_attr.Damage = template.Damage || 1;
      this.attr._MeleeAttack_attr.Durability = template.Durability || 1;
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

Game.ItemMixin.Healing = {
  META: {
    mixinName: 'Healing',
    mixinGroup: 'UseItems',
    listeners: {
      'used': function(evtData){
          Game.Message.send("Sven feels the power of the " + this.getName()+ " rush through him. he is rejuvenated");
          return {healing: this.heal()};
      },


    },
    stateNamespace: '_Healing_attr',
    stateModel: {
      healingAmount: 1
    },
    init: function (template) {
      this.attr._Healing_attr.healingAmount = template.healingAmount || 1;
    }
  },
  heal: function(){
    var healing = this.attr._Healing_attr.healingAmount;
    this.destroy();
    return healing;
  },
  getHealingAmount: function(){
    return this.attr._Healing_attr.healingAmount;
  }

};
Game.ItemMixin.Teleporting = {
  META: {
    mixinName: 'Teleporting',
    mixinGroup: 'UseItems',
    listeners: {
      'used': function(evtData){
        if(Game.UIMode.gamePlay.getCurrentRoom()){
          Game.Message.send("Sven is a little disoriented");
          var current = Game.UIMode.gamePlay.getCurrentRoom();
          Game.getAvatar().setPos({x:current.getRandomWalkableLocation().x+current.getPos().x, y:current.getRandomWalkableLocation().y+current.getPos().y});
          Game.UIMode.gamePlay.setCameraToAvatar();
          Game.getMap().updateEntityLocation(Game.getAvatar());
          this.destroy();
        }else{
          Game.Message.send("Sven can't teleport in hallways. It could be dangerous");
        }
      },


    },
    stateNamespace: '_Teleporting_attr',
    stateModel: {
    },
    init: function (template) {
    }
  }
};
Game.ItemMixin.Useless = {
  META: {
    mixinName: 'Useless',
    mixinGroup: 'Useless',
    listeners: {
      'used': function(evtData){
          Game.Message.send("Sven can't do jack-diddly with a "+ this.getName());
          Game.Message.send("Sven does need a pet though...")
      },


    },
    stateNamespace: '_Useless_attr',
    stateModel: {
    },
    init: function (template) {
    }
  }
};

Game.EntityMixin = {};

// Mixins have a META property is is info about/for the mixin itself and then all other properties. The META property is NOT copied into objects for which this mixin is used - all other properies ARE copied in.

Game.EntityMixin.PlayerMessager = {
  META: {
    mixinName: 'PlayerMessager',
    mixinGroup: 'PlayerMessager',
    listeners: {
      'walkForbidden': function(evtData) {
        Game.Message.send('you can\'t walk into the '+evtData.target.getName());
        Game.renderMessage();
      },

      'attackAvoided': function(evtData) {
        Game.Message.send('you avoided the '+evtData.attacker.getName());
        Game.renderMessage();
      },
      'attackMissed': function(evtData) {
        Game.Message.send('you missed the '+evtData.recipient.getName());
        Game.renderMessage();
      },
      'dealtDamage': function(evtData) {
        Game.Message.send('you hit the '+evtData.damagee.getName()+' for '+evtData.damageAmount);
        Game.renderMessage();
      },
      'madeKill': function(evtData) {
        Game.Message.send('you killed the '+evtData.entKilled.getName());
        Game.renderMessage();
      },
      'damagedBy': function(evtData) {
        Game.Message.send('the '+evtData.damager.getName()+' hit you for '+evtData.damageAmount);
        Game.renderMessage();
      },
      'killed': function(evtData) {
        Game.Message.send('you were killed by the '+evtData.killedBy.getName());
        Game.renderMessage();
      }
    }
  }
//    Game.Message.send(msg);
};

//this is questionable honestly
Game.EntityMixin.Inventory = {
  META: {
    mixinName: 'Inventory',
    mixinGroup: 'item_handling',
    stateNamespace: '_Inventory_attr',
    stateModel: {
      inventory: [],
      equippedWeapon: null
    },
    listeners:{
      'getExtraDamage': function(){
        return this
      }
    }
  },
  removeItem: function(item){
    for(var i = 0; i<this.attr._Inventory_attr.inventory.length; i++){
      if(item == this.attr._Inventory_attr.inventory[i]){
        var theItem = this.attr._Inventory_attr.inventory[i];
        this.attr._Inventory_attr.inventory.splice(i, 1);
        return theItem;
      }
    }
    return null;
  },
  removeItemAt: function(index){
    if(this.attr._Inventory_attr.inventory.length >= (index-1)){
      var theItem = this.attr._Inventory_attr.inventory[i];
      this.attr._Inventory_attr.inventory.splice(index, 1);
      return theItem;
    }
    return null;
  },
  getWeaponAttack: function(){
    // if(this.attr._Inventory_attr.equippedWeapon){
    //   return this.attr._Inventory_attr.equippedWeapon;
    // }
    // return this.attr._Inventory_attr.equippedWeapon;
  }
},

Game.EntityMixin.PlayerActor = {
  META: {
    mixinName: 'PlayerActor',
    mixinGroup: 'Actor',
    stateNamespace: '_PlayerActor_attr',
    stateModel:  {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    init: function (template) {
      Game.Scheduler.add(this,true,1);
    },
    listeners: {
      'actionDone': function(evtData) {
        Game.Scheduler.setDuration(this.getCurrentActionDuration());
        this.setCurrentActionDuration(this.getBaseActionDuration()+Game.util.randomInt(-5,5));
        setTimeout(function() {Game.TimeEngine.unlock();},1); // NOTE: this tiny delay ensures console output happens in the right order, which in turn means I have confidence in the turn-taking order of the various entities
        Game.renderMessage();
        // console.log("end player acting");
      },
      'madeKill': function(evtData) {
        var self = this;
        setTimeout(function() { // NOTE: this tiny delay ensures event calls happen in the right order (yes, this is a bit of a hack... might be better to make a postChronicalKill event, though that's also a bit of a hack...)
          var victoryCheckResp = self.raiseSymbolActiveEvent('calcKillsOf',{entityName:'attack slug'});
          if (Game.util.compactNumberArray_add(victoryCheckResp.killCount) >= 3) {
            Game.switchUIMode(Game.UIMode.gameWin);
          }
        },1);
      },
      'killed': function(evtData) {
        //Game.TimeEngine.lock();
        Game.switchUiMode(Game.UIMode.gameLose);
      }
    }
  },
  getBaseActionDuration: function () {
    return this.attr._PlayerActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._PlayerActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._PlayerActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._PlayerActor_attr.currentActionDuration = n;
  },
  isActing: function (state) {
    if (state !== undefined) {
      this.attr._PlayerActor_attr.actingState = state;
    }
    return this.attr._PlayerActor_attr.actingState;
  },
  act: function () {
    // console.log("begin player acting");
    // console.log("player pre-lock engine lock state is "+Game.TimeEngine._lock);
    if (this.isActing()) { return; } // a gate to deal with JS timing issues
    this.isActing(true);
    //Game.refresh();
    Game.renderMain();
    Game.renderAvatar();
    Game.TimeEngine.lock();
    // console.log("player post-lock engine lock state is "+Game.TimeEngine._lock);
    this.isActing(false);
  }
};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker',
    listeners: {
      'adjacentMove': function(evtData) {
          // console.log('listener adjacentMove');
          // console.dir(JSON.parse(JSON.stringify(evtData)));
          var map = this.getMap();
          var dx=evtData.dx,dy=evtData.dy;
          // var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth()-1);
          // var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight()-1);
          var targetX = this.getX() + dx;
          var targetY = this.getY() + dy;
          if ((targetX < 0) || (targetX >= map.getWidth()) || (targetY < 0) || (targetY >= map.getHeight())) {
            this.raiseSymbolActiveEvent('walkForbidden',{target:Game.Tile.nullTile});
            return {madeAdjacentMove:false};
          }

          //picking up items here

          if (map.getEntity(targetX,targetY)) { // can't walk into spaces occupied by other entities
            this.raiseSymbolActiveEvent('bumpEntity',{actor:this,recipient:map.getEntity(targetX,targetY)});
            // NOTE: should bumping an entity always take a turn? might have to get some return data from the event (once event return data is implemented)
            return {madeAdjacentMove:true};
          }
          var targetTile = map.getTile(targetX,targetY);
          if (targetTile.isWalkable()) {
            this.setPos(targetX,targetY);
            var myMap = this.getMap();
            if (myMap) {
              myMap.updateEntityLocation(this);
            }
            return {madeAdjacentMove:true};
          } else {
            this.raiseSymbolActiveEvent('walkForbidden',{target:targetTile});
          }
          return {madeAdjacentMove:false};
      }
    }
  }
};



Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0,
      killLog:{},
      deathMessage:''
    },
    listeners: {
      'actionDone': function(evtData) {
        this.trackTurnCount();
      },
      'madeKill': function(evtData) {
        // console.log('chronicle kill');
        this.addKill(evtData.entKilled);
      },
      'killed': function(evtData) {
        this.attr._Chronicle_attr.deathMessage = 'killed by '+evtData.killedBy.getName();
      },
      'calcKillsOf': function (evtData) {
        return {killCount:this.getKillsOf(evtData.entityName)};
      }
    }
  },
  trackTurnCount: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  },
  getKills: function () {
    return this.attr._Chronicle_attr.killLog;
  },
  getKillsOf: function (entityName) {
    return this.attr._Chronicle_attr.killLog[entityName] || 0;
  },
  clearKills: function () {
    this.attr._Chronicle_attr.killLog = {};
  },
  addKill: function (entKilled) {
    var entName = entKilled.getName();
    // console.log('chronicle kill of '+entName);
    if (this.attr._Chronicle_attr.killLog[entName]) {
      this.attr._Chronicle_attr.killLog[entName]++;
    } else {
      this.attr._Chronicle_attr.killLog[entName] = 1;
    }
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 1,
      curHp: 1
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;
    },
    listeners: {
      'attacked': function(evtData) {
        // console.log('HitPoints attacked');

        this.takeHits(evtData.attackDamage);
        this.raiseSymbolActiveEvent('damagedBy',{damager:evtData.attacker,damageAmount:evtData.attackDamage});
        evtData.attacker.raiseSymbolActiveEvent('dealtDamage',{damagee:this,damageAmount:evtData.attackDamage});
        if (this.getCurHp() <= 0) {
          this.raiseSymbolActiveEvent('killed',{entKilled: this, killedBy: evtData.attacker});
          evtData.attacker.raiseSymbolActiveEvent('madeKill',{entKilled: this, killedBy: evtData.attacker});
        }
      },
      'killed': function(evtData) {
        // console.log('HitPoints killed');
        this.destroy();
      }
    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};

Game.EntityMixin.MeleeAttacker = {
  META: {
    mixinName: 'MeleeAttacker',
    mixinGroup: 'Attacker',
    stateNamespace: '_MeleeAttacker_attr',
    stateModel:  {
      attackHit: 1,
      attackDamage: 1,
      attackActionDuration: 1000
    },
    init: function (template) {
      this.attr._MeleeAttacker_attr.attackDamage = template.attackDamage || 1;
      this.attr._MeleeAttacker_attr.attackActionDuration = template.attackActionDuration || 1000;
    },
    listeners: {
      'bumpEntity': function(evtData) {
        console.log('MeleeAttacker bumpEntity');
        var hitValResp = this.raiseSymbolActiveEvent('calcAttackHit');
        var avoidValResp = evtData.recipient.raiseSymbolActiveEvent('calcAttackAvoid');
        Game.util.cdebug(avoidValResp);
        var hitVal = Game.util.compactNumberArray_add(hitValResp.attackHit);
        var avoidVal = Game.util.compactNumberArray_add(avoidValResp.attackAvoid);
        if (ROT.RNG.getUniform()*(hitVal+avoidVal) > avoidVal) {
          var hitDamageResp = this.raiseSymbolActiveEvent('calcAttackDamage');
          var damageMitigateResp = evtData.recipient.raiseSymbolActiveEvent('calcDamageMitigation');

          evtData.recipient.raiseSymbolActiveEvent('attacked',{attacker:evtData.actor,attackDamage:Game.util.compactNumberArray_add(hitDamageResp.attackDamage) - Game.util.compactNumberArray_add(damageMitigateResp.damageMitigation)});
        } else {
          evtData.recipient.raiseSymbolActiveEvent('attackAvoided',{attacker:evtData.actor,recipient:evtData.recipient});
          evtData.actor.raiseSymbolActiveEvent('attackMissed',{attacker:evtData.actor,recipient:evtData.recipient});
        }
        this.setCurrentActionDuration(this.attr._MeleeAttacker_attr.attackActionDuration);
      },
      'calcAttackHit': function(evtData) {
        // console.log('MeleeAttacker bumpEntity');
        return {attackHit:this.getAttackHit()};
      },
      'calcAttackDamage': function(evtData) {
        // // console.log('MeleeAttacker bumpEntity');
        // var dam = this.getAttackDamage();
        // if(this.hasMixin('Inventory')){
        //     dam = dam +
        // }
        // return {attackDamage:dam};
      }

    }
  },
  getAttackHit: function () {
    return this.attr._MeleeAttacker_attr.attackHit;
  },
  getAttackDamage: function () {
    return this.attr._MeleeAttacker_attr.attackDamage;
  }
};

Game.EntityMixin.MeleeDefender = {
  META: {
    mixinName: 'MeleeDefender',
    mixinGroup: 'Defender',
    stateNamespace: '_MeleeDefenderr_attr',
    stateModel:  {
      attackAvoid: 0,
      damageMitigation: 0
    },
    init: function (template) {
      this.attr._MeleeDefenderr_attr.attackAvoid = template.attackAvoid || 0;
      this.attr._MeleeDefenderr_attr.damageMitigation = template.damageMitigation || 0;
    },
    listeners: {
      'calcAttackAvoid': function(evtData) {
        // console.log('MeleeDefender calcAttackAvoid');
        return {attackAvoid:this.getAttackAvoid()};
      },
      'calcDamageMitigation': function(evtData) {
        // console.log('MeleeAttacker bumpEntity');
        return {damageMitigation:this.getDamageMitigation()};
      }
    }
  },
  getAttackAvoid: function () {
    return this.attr._MeleeDefenderr_attr.attackAvoid;
  },
  getDamageMitigation: function () {
    return this.attr._MeleeDefenderr_attr.damageMitigation;
  }
};

Game.EntityMixin.Sight = {
  META: {
    mixinName: 'Sight',
    mixinGroup: 'Sense',
    stateNamespace: '_Sight_attr',
    stateModel:  {
      sightRadius: 3
    },
    init: function (template) {
      this.attr._Sight_attr.sightRadius = template.sightRadius || 3;
    },
    listeners: {
      'senseForEntity': function(evtData) {
        // console.log('Sight lookForEntity');
        return {entitySensed:this.canSeeEntity(evtData.senseForEntity)};
      }
    }
  },
  getSightRadius: function () {
    return this.attr._Sight_attr.sightRadius;
  },
  setSightRadius: function (n) {
    this.attr._Sight_attr.sightRadius = n;
  },

  canSeeEntity: function(entity) {
      // If not on the same map or on different maps, then exit early
      if (!entity || this.getMapId() !== entity.getMapId()) {
          return false;
      }
      return this.canSeeCoord(entity.getX(),entity.getY());
  },
  canSeeCoord: function(x_or_pos,y) {
    var otherX = x_or_pos,otherY=y;
    if (typeof x_or_pos == 'object') {
      otherX = x_or_pos.x;
      otherY = x_or_pos.y;
    }

    // If we're not within the sight radius, then we won't be in a real field of view either.
    if (Math.max(Math.abs(otherX - this.getX()),Math.abs(otherY - this.getY())) > this.attr._Sight_attr.sightRadius) {
      return false;
    }

    var inFov = this.getVisibleCells();
    return inFov[otherX+','+otherY] || false;
  },
  getVisibleCells: function() {
      var visibleCells = {'byDistance':{}};
      for (var i=0;i<=this.getSightRadius();i++) {
          visibleCells.byDistance[i] = {};
      }
      this.getMap().getFov().compute(
          this.getX(), this.getY(),
          this.getSightRadius(),
          function(x, y, radius, visibility) {
              visibleCells[x+','+y] = true;
              visibleCells.byDistance[radius][x+','+y] = true;
          }
      );
      return visibleCells;
  },
  canSeeCoord_delta: function(dx,dy) {
      return this.canSeeCoord(this.getX()+dx,this.getY()+dy);
  }
};


Game.EntityMixin.MapMemory = {
  META: {
    mixinName: 'MapMemory',
    mixinGroup: 'MapMemory',
    stateNamespace: '_MapMemory_attr',
    stateModel:  {
      mapsHash: {}
    },
    init: function (template) {
      this.attr._MapMemory_attr.mapsHash = template.mapsHash || {};
    }
  },
  rememberCoords: function (coordSet,mapId) {
    var mapKey=mapId || this.getMapId();
    if (! this.attr._MapMemory_attr.mapsHash[mapKey]) {
      this.attr._MapMemory_attr.mapsHash[mapKey] = {};
    }
    for (var coord in coordSet) {
      if (coordSet.hasOwnProperty(coord) && (coord != 'byDistance')) {
        this.attr._MapMemory_attr.mapsHash[mapKey][coord] = true;
      }
    }
  },
  getRememberedCoordsForMap: function (mapId) {
    var mapKey=mapId || this.getMapId();
    return this.attr._MapMemory_attr.mapsHash[mapKey] || {};
  }
};


//#############################################################################
// ENTITY ACTORS / AI

Game.EntityMixin.WanderActor = {
  META: {
    mixinName: 'WanderActor',
    mixinGroup: 'Actor',
    stateNamespace: '_WanderActor_attr',
    stateModel:  {
      baseActionDuration: 1000,
      currentActionDuration: 1000
    },
    init: function (template) {
      Game.Scheduler.add(this,true, Game.util.randomInt(2,this.getBaseActionDuration()));
      this.attr._WanderActor_attr.baseActionDuration = template.wanderActionDuration || 1000;
      this.attr._WanderActor_attr.currentActionDuration = this.attr._WanderActor_attr.baseActionDuration;
    }
  },
  getBaseActionDuration: function () {
    return this.attr._WanderActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._WanderActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._WanderActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._WanderActor_attr.currentActionDuration = n;
  },
  getMoveDeltas: function () {
    return Game.util.positionsAdjacentTo({x:0,y:0}).random();
  },
  act: function () {
    Game.TimeEngine.lock();
    // console.log("begin wander acting");
    // console.log('wander for '+this.getName());
    var moveDeltas = this.getMoveDeltas();
    this.raiseSymbolActiveEvent('adjacentMove',{dx:moveDeltas.x,dy:moveDeltas.y});
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.getBaseActionDuration()+Game.util.randomInt(-10,10));
    this.raiseSymbolActiveEvent('actionDone');
    // console.log("end wander acting");
    Game.TimeEngine.unlock();
  }
};

// NOTE: could be a good route to extract the move chooser into a separate mixin - that's left as an exercise for the reader....
Game.EntityMixin.WanderChaserActor = {
  META: {
    mixinName: 'WanderChaserActor',
    mixinGroup: 'Actor',
    stateNamespace: '_WanderChaserActor_attr',
    stateModel:  {
      baseActionDuration: 1000,
      currentActionDuration: 1000
    },
    init: function (template) {
      Game.Scheduler.add(this,true, Game.util.randomInt(2,this.getBaseActionDuration()));
      this.attr._WanderChaserActor_attr.baseActionDuration = template.wanderChaserActionDuration || 1000;
      this.attr._WanderChaserActor_attr.currentActionDuration = this.attr._WanderChaserActor_attr.baseActionDuration;
    }
  },
  getBaseActionDuration: function () {
    return this.attr._WanderChaserActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._WanderChaserActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._WanderChaserActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._WanderChaserActor_attr.currentActionDuration = n;
  },
  getMoveDeltas: function () {
    var avatar = Game.getAvatar();
    var senseResp = this.raiseSymbolActiveEvent('senseForEntity',{senseForEntity:avatar});
    if (Game.util.compactBooleanArray_or(senseResp.entitySensed)) {

      // build a path instance for the avatar
      var source = this;
      var map = this.getMap();
      var path = new ROT.Path.AStar(avatar.getX(), avatar.getY(), function(x, y) {
          // If an entity is present at the tile, can't move there.
          var entity = map.getEntity(x, y);
          if (entity && entity !== avatar && entity !== source) {
              return false;
          }
          return map.getTile(x, y).isWalkable();
      }, {topology: 8});

      // compute the path from here to there
      var count = 0;
      var moveDeltas = {x:0,y:0};
      path.compute(this.getX(), this.getY(), function(x, y) {
          if (count == 1) {
              moveDeltas.x = x - source.getX();
              moveDeltas.y = y - source.getY();
          }
          count++;
      });

      return moveDeltas;
    }
    return Game.util.positionsAdjacentTo({x:0,y:0}).random();
  },
  act: function () {
    Game.TimeEngine.lock();
    // console.log("begin wander acting");
    // console.log('wander for '+this.getName());
    var moveDeltas = this.getMoveDeltas();
    this.raiseSymbolActiveEvent('adjacentMove',{dx:moveDeltas.x,dy:moveDeltas.y});
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.getBaseActionDuration()+Game.util.randomInt(-10,10));
    this.raiseSymbolActiveEvent('actionDone');
    // console.log("end wander acting");
    Game.TimeEngine.unlock();
  }
};
Game.EntityMixin.AlertableChaserActor = {
  META: {
    mixinName: 'AlertableChaserActor',
    mixinGroup: 'Actor',
    stateNamespace: '_AlertableChaserActor_attr',
    stateModel:  {
      baseActionDuration: 1000,
      currentActionDuration: 1000,
      Alert_Range: 10,
      Alerted: false
    },
    init: function (template) {
      Game.Scheduler.add(this,true, Game.util.randomInt(2,this.getBaseActionDuration()));
      this.attr._AlertableChaserActor_attr.baseActionDuration = template.AlertableChaserActionDuration || 1000;
      this.attr._AlertableChaserActor_attr.currentActionDuration = this.attr._AlertableChaserActor_attr.baseActionDuration;
    }
  },
  getAlertRange: function(){
    return this.attr._AlertableChaserActor_attr.Alert_Range;
  },
  setAlertRange: function(new_value){
    this.attr._AlertableChaserActor_attr.Alert_Range = new_value;
  },
  getAlerted: function(){
    return this.attr._AlertableChaserActor_attr.Alerted;
  },
  setAlerted: function(new_value){
    this.attr._AlertableChaserActor_attr.Alerted = new_value;
  },
  getBaseActionDuration: function () {
    return this.attr._AlertableChaserActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._AlertableChaserActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._AlertableChaserActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._AlertableChaserActor_attr.currentActionDuration = n;
  },
  getMoveDeltas: function () {
    var avatar = Game.getAvatar();
    var senseResp = this.raiseSymbolActiveEvent('senseForEntity',{senseForEntity:avatar});
    if (Game.util.compactBooleanArray_or(senseResp.entitySensed)) {

      // build a path instance for the avatar
      var source = this;
      var map = this.getMap();
      var path = new ROT.Path.AStar(avatar.getX(), avatar.getY(), function(x, y) {
          // If an entity is present at the tile, can't move there.
          var entity = map.getEntity(x, y);
          if (entity && entity !== avatar && entity !== source) {
              return false;
          }
          return map.getTile(x, y).isWalkable();
      }, {topology: 8});

      // compute the path from here to there
      var count = 0;
      var moveDeltas = {x:0,y:0};
      path.compute(this.getX(), this.getY(), function(x, y) {
          if (count == 1) {
              moveDeltas.x = x - source.getX();
              moveDeltas.y = y - source.getY();
          }
          count++;
      });

      return moveDeltas;
    }
    return Game.util.positionsAdjacentTo({x:0,y:0}).random();
  },
  canSeeCoord: function(x_or_pos,y) {
    var otherX = x_or_pos,otherY=y;
    if (typeof x_or_pos == 'object') {
      otherX = x_or_pos.x;
      otherY = x_or_pos.y;
    }

    // If we're not within the sight radius, then we won't be in a real field of view either.
    if (Math.max(Math.abs(otherX - this.getX()),Math.abs(otherY - this.getY())) > this.attr._AlertableChaserActor_attr.Alert_Range) {
      return false;
    }

    var inFov = this.getVisibleCells();
    return inFov[otherX+','+otherY] || false;
  },
  act: function () {
    Game.TimeEngine.lock();
    // console.log("begin wander acting");
    // console.log('wander for '+this.getName());
    var avatar = Game.getAvatar();
    if(!this.getAlerted() && this.canSeeCoord(avatar.getPos())){
      this.setAlerted(true);
    }

    if(this.getAlerted()){
      var moveDeltas = this.getMoveDeltas();
      this.raiseSymbolActiveEvent('adjacentMove',{dx:moveDeltas.x,dy:moveDeltas.y});
    }
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.getBaseActionDuration()+Game.util.randomInt(-10,10));
    this.raiseSymbolActiveEvent('actionDone');
    // console.log("end wander acting");
    Game.TimeEngine.unlock();
  }
};

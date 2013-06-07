/**
 * @fileoverview Creates the representation of the world and the elements
 * that belong to it. Handles worldwide forces such as gravity.
 * @author Rohan Halliyal
 * @author Jennifer Fang
 */

// Get external functions
var THREE = require('three');

var ButterOBJLoader = require('./OBJLoader.js');
var Critter = require('./critter.js');
var Environment = require('./environment.js');
var Food = require('./food.js');
var Battery = require('./battery.js');
var Soap = require('./soap.js');
var Butter = require('./butter.js');
var randomPosition = require('./random.js').randomPosition;

/**
 * Construct the game play world.
 * @constructor
 */
function World() {
  // List of all collidables. Includes all objects in below lists
  this.collidables = {};

  // Lists of objects that are in the world
  this.enviroObjs = {};
  this.players = {};
  this.critters = {};
  this.foods = {};
  this.items = {};

  /* @note We need these counters because the hashes don't have lengths */
	this.nplayers = 0;
	this.ncritters = 0;
  this.nfoods = 0;

  // Lists of IDs of objects that had state changes
  this.newCollidables = []; // all newly created collidables
  this.setCollidables = []; // all collidables that had state change
  this.delCollidables = []; // all deleted collidabls
  this.newItems = [];
  this.delItems = [];
  this.miscellaneous = []; // Currently holds broadcast messages to all players

  // needed for logic
  //  potential problem: used before set
  this.handler = null;

  // Make world environment
  this.createRoom_();
  this.currentBattery;
  this.currentSoap;
  this.currentButter;
}

/* ENVIRONMENT CREATION FUNCTIONS */

World.prototype.createRoom_ = function() {
	var env = new Environment();

   this.collidables[env.id] = env;
   this.enviroObjs[env.id] = env;
};


/* ADD/REMOVE FUNCTIONS */

/**
 * Add a player to the world.
 * @param {Player} player The new player to add to the world.
 * @return {string} The player ID.
 */
World.prototype.addPlayer = function(player) {
  // Determine which model to assign to player
  player.model = this.nplayers % 6; // magic # for # of boy textures

    this.collidables[player.id] = player;
	this.players[player.id] = player;
	this.nplayers++;

  this.handler.emit('newplayer');

  this.newCollidables.push(player.id);
	return player.id;
}

/**
 * Add a critter to the world.
 * @param {Critter} critter The new critter to add to the world.
 * @return {string} The critter ID.
 */
World.prototype.addCritter = function(critter) {
  this.collidables[critter.id] = critter;
  this.critters[critter.id] = critter;
  this.ncritters++;

  this.newCollidables.push(critter.id);
  return critter.id;
}

/**
 * Add a piece of food to the world.
 * @param {Food} food The new food to add to the world.
 * @return {string} The food ID.
 */
World.prototype.addFood = function(food) {
  this.collidables[food.id] = food;
  this.foods[food.id] = food;
  this.nfoods++;

  this.newCollidables.push(food.id);
  return food.id;
};

World.prototype.getCritterRandomPosition = function() {
    return new THREE.Vector4(Math.random() * 150 - 75,
                             1,
                             Math.random() * 150 - 75,
                             1);
}

/**
 * Spawns a given number of critters at random, unoccupied locations.
 * @param {int} numCritters The number of critters to spawn.
 */
World.prototype.spawnCritters = function(numCritters) {
  for (var i = 0; i < numCritters; i++) {
    var critter = new Critter();

	 var position = this.getCritterRandomPosition();

	 // while position is out of the environment or already occupied
	 while (! this.enviroContains(position) || this.occupied(position)) {
		 position = this.getCritterRandomPosition();
	 }

	 critter.position.copy(position);
     critter.mesh.position.copy(position);
     critter.speed = Math.random() * (0.015 - 0.005) + 0.005; // number between 0.005 and 0.02
     critter.rotation = Math.floor(Math.random() * 2); // 0 or 1
     critter.rotation_point = new THREE.Vector3(
                                        Math.random() * 50 - 25,
                                        0,
                                        Math.random() * 50 - 25);
     this.addCritter(critter);
  }
};

World.prototype.spawnItem = function(name) {
    var item;
    switch (name) {
        case "battery":
            item = new Battery();
            break;
        case "soap":
            item = new Soap();
            break;
        case "butter":
            item = new Butter();
            break;
    }
    item.position.copy(randomPosition());
    item.position.y = 0.5;
    item.mesh.matrixWorld.makeTranslation(item.position.x, 
                                          item.position.y,
                                          item.position.z);
    this.items[item.name] = item;
    this.newItems[item.name] = item;
}

World.prototype.removeItem = function(name, player_id) {
    if (this.items[name] != null) {
        this.delItems[name] = player_id;
        delete this.items[name];
        this.items[name] = null;
    }
}

World.prototype.enviroContains = function(pos) {
	return true;
}

World.prototype.occupied = function(pos) {
	return false;
}

/**
 * Remove a player from the world.
 * @param {Player} player The player to remove from the world.
 * @return {boolean} True if successfully removes, false otherwise.
 */
World.prototype.removePlayer = function(player) {
  this.delCollidables.push(player.id);
  if (delete this.collidables[player.id] &&
	    delete this.players[player.id]) {
		this.nplayers--;

    this.handler.emit('delplayer');

		return true;
	} else {
		return false;
	}
}

/**
 * Remove a critter from the world.
 * @param {Critter} critter The critter to remove from the world.
 * @return {boolean} True if successfully removes, false otherwise.
 */
World.prototype.removeCritter = function(critter) {
  this.delCollidables.push(critter.id);
  if (delete this.collidables[critter.id] &&
      delete this.critters[critter.id]) {
    this.ncritters--;

    this.handler.emit('delcritter');

    return true;
  } else {
    return false;
  }
};

/**
 * Reset the update state lists.
 */
World.prototype.resetUpdateStateLists = function() {
  this.newCollidables = [];
  this.setCollidables = [];
  this.delCollidables = [];
  this.newItems = [];
  this.delItems = [];
  this.miscellaneous = [];
};


/* WORLD MUTATOR FUNCTIONS */

World.prototype.attachHandler = function(handler) {
  this.handler = handler;
}

World.prototype.obtainBattery = function(player) {
    this.currentBattery = player;
}

World.prototype.resetBattery = function() {
    if (this.currentBattery != null) {
        this.currentBattery.resetItems();
        this.currentBattery = null;
    }
}
World.prototype.obtainSoap= function(player) {
    this.currentSoap = player;
}

World.prototype.resetSoap = function() {
    if (this.currentSoap != null) {
        this.currentSoap.resetItems();
        this.currentSoap = null;
    }
}
World.prototype.obtainButter = function(player) {
    this.currentButter = player;
}

World.prototype.resetButter = function() {
    if (this.currentButter != null) {
        this.currentButter.resetItems();
        this.currentButter = null;
    }
}

World.prototype.applyStates = function() {
    var self = this;
	for (var id in this.players) {
		// uses the player state to create the force
		this.players[id].move();
        
        // uses the player state to get closest vacuum intersectec obj
        // TODO: extend to also affect players/food?
        var critters = this.players[id].doVacuum(this.critters, this.items);
        for (var cid in critters) {
            switch (cid) {
                case "battery":
                    this.players[id].obtainBattery();
                    this.obtainBattery(this.players[id]);
                    function batteryItemFinish() {
                        self.resetBattery(); 
                    }
                    setTimeout(batteryItemFinish, 12000);
                    this.removeItem(cid, id);
                    break;
                case "soap":
                    this.players[id].obtainSoap();
                    this.obtainSoap(this.players[id]);
                    function soapItemFinish() {
                        self.resetSoap(); 
                    }
                    setTimeout(soapItemFinish, 8000);
                    this.removeItem(cid, id);
                    break;
                case "butter":
                    this.players[id].obtainButter();
                    this.obtainButter(this.players[id]);
                    function butterItemFinish() {
                        self.resetButter(); 
                    }
                    setTimeout(butterItemFinish, 6000);
                    this.removeItem(cid, id);
                    break;
                default: // by default intersect with critters
                    critters[cid].hp--;
                    var new_scale = Math.max(0.01 * critters[cid].hp, 0.08);
                    critters[cid].mesh.scale.set(new_scale, new_scale, new_scale);
                    if(critters[cid].hp <= 0 || this.players[id].hasSoapItem)
                    {
                        this.removeCritter(critters[cid]);
                        this.players[id].incVacKills();
                    }
                    break;
            }
		}
	}
	for (var id in this.critters) {
		//this.critters[id].useAI();
        this.critters[id].move();
        this.setCollidables.push(id); // make sure updated critter is sent to client
	}
}

/**
 * Apply forces to all objects that should be applied at the end of every game tick.
 */
World.prototype.applyForces = function() {
	for (var id in this.players) {
		// add gravity
		this.players[id].addGravity(); // each player has individual gravity

		// collision detection should happen in this call
		// apply forces ==> update velocity + update position
		this.players[id].applyForces(this.collidables);

    if (this.players[id].moved) {
      this.setCollidables.push(id);
    }
	}

	for (var id in this.critters) {
		// add gravity
		this.critters[id].addGravity(); // each player has individual gravity

		// collision detection should happen in this call
		// apply forces ==> update velocity + update position
		this.critters[id].applyForces(this.collidables);

    if (this.critters[id].moved) {
      this.setCollidables.push(id);
    }
	}
}

module.exports = World;

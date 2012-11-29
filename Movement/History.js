Crafty.c("History", {   
  history: function(x) {
    // want to store positions (and orientation) of object over
    // a series of previous time points
    // and then draw an entity at those positions that looks like whatever
    // entity we are ...
    this.maxNoObjects = x;
      
      return this;  
  },
  init: function() {
      this.historyArray = [];
      this.counter = 0;
      this.realCounter = 0
      this.existingClonesX = {};
      this.existingClonesY = {};
      // TODO assumes velocity - need to declare/handle that requirement
      // loop through list of items in history and draw stationary object there
      this.enterFrameFunction = function () {
        // could only create history object every 5th time step
        if(this._velocity.magnitude() >= 0.2){
          var clone = null;
          var xmatch = this.existingClonesX[this.x.toFixed(0)];
          var ymatch = this.existingClonesY[this.y.toFixed(0)];
          if(this.counter % 5 === 1){
            //debugger
            if(xmatch === undefined || (xmatch !== ymatch)){
              clone = this.clone();
              clone.velocity(this._velocity.x,this._velocity.y,0);
              clone.removeComponent('History',false);
              clone.unbind("EnterFrame");
              clone.alpha = 0.1;
              this.existingClonesX[this.x.toFixed(0)] = clone;
              this.existingClonesY[this.y.toFixed(0)] = clone;
              this.realCounter++;
              this.historyArray.push(clone);
            }
          }
          this.counter = this.counter + 1;
          
          // would be interesting if we could avoid adding new items in same places as previous ones
          if(this.realCounter > this.maxNoObjects){
            var dump = this.historyArray.shift();
            if(dump !== null && dump != undefined)
              dump.destroy();
          }

        }

      };
      this.bind("EnterFrame", this.enterFrameFunction);
      //clone.seek(null);
      return this;
  },
  historyVelocityTrace: function() {
    var str = "</br>"
    for(var i in this.historyArray){
      if(this.historyArray[i] !== null){
        str += this.historyArray[i]._velocity.x.toFixed(1);
        str += ", ";
        str += this.historyArray[i]._velocity.y.toFixed(1);
        str += "</br>";
      }
    }
    return str;
  },
  historyPositionTrace: function() {
    var str = "</br>"
    for(var i in this.historyArray){
      if(this.historyArray[i] !== null){
        str += this.historyArray[i].x.toFixed(0);
        str += ",";
        str += this.historyArray[i].y.toFixed(0);
        str += "</br>";
      }
    }
    return str;
  },
  adjustHistory: function(timeToTarget, maxSpeed, radius){
    // TODO could we look backwards through the time steps 
    // working out where we would have been and adjust the 
    // positions of the clones?

    // ideally one would start with the first element in the 
    // array and work out where we should have been on the 
    // next step, and the next step, and then get to the 
    // 5th empty element and then move that and so on
    // should work if we have access to the relevant seek and 
    // velocity code

    // and of course what would be lovely would be to have some 
    // sliders to adjust the parameters back and forth
    // not clear if Crafty can provide those for us?  perhaps jquery
    // or mootools????

    for(var i in this.historyArray){
      if(this.historyArray[i+1] !== null){
        // TODO update what the velocity should have been
        this.historyArray[i]._timeToTarget = timeToTarget;
        this.historyArray[i]._maxSpeed = maxSpeed;
        this.historyArray[i]._radius = radius;
        this.historyArray[i].update();

        this.historyArray[i+1].x = this.historyArray[i].newXPosition();
        this.historyArray[i+1].y = this.historyArray[i].newYPosition();

      }
    }
  }
});
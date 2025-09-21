class Elevator {
  constructor(){
    this.currentFloor = 0;
    this.requests = [];   // queue of Person objects or simple requests
    this.riders = [];     // people currently on elevator
    this.totalFloorsTraversed = 0;
    this.totalStops = 0;
  }

  requestPickup(person){
    this.requests.push(person);
  }

  // simple algorithm: FIFO order
  runNextRequest(){
    if (this.requests.length === 0) return;
    const person = this.requests.shift();

    //  (pickup)
    this._moveTo(person.currentFloor);
    this._stop();

    // pick t
    this.riders.push(person);

    // move to target floor
    this._moveTo(person.dropOffFloor);
    this._stop();

    // drop 
    this.riders = this.riders.filter(p => p !== person);
  }

  _moveTo(targetFloor){
    this.totalFloorsTraversed += Math.abs(this.currentFloor - targetFloor);
    this.currentFloor = targetFloor;
  }

  _stop(){
    this.totalStops += 1;
  }

   runAllRequests() {
    while (this.requests.length > 0) {
      this.runNextRequest();
    }
  }


  
  getEfficiencyReport() {
    const totalRequests = this.totalStops / 2; 
    return {
      totalRequests,
      totalStops: this.totalStops,
      totalFloorsTraversed: this.totalFloorsTraversed,
      stopsPerRequest: totalRequests > 0 ? this.totalStops / totalRequests : 0,
      floorsPerRequest: totalRequests > 0 ? this.totalFloorsTraversed / totalRequests : 0,
      avgFloorsPerStop: this.totalStops > 0 ? this.totalFloorsTraversed / this.totalStops : 0
    };
  }


  checkIdleBehavior() {
    const hour = new Date().getHours();

    if (this.riders.length === 0) {
      if (hour < 12 && this.currentFloor !== 0) {
        this._moveTo(0);
      }
    }
  }
}

module.exports = Elevator;

const { expect } = require("chai");
const  Elevator  = require("../src/elevator.cjs");
const sinon = require("sinon");
const  Person  = require("../src/person.cjs");

describe("Elevator System", () => {
  let elevator;
  let clock;

  beforeEach(() => {
    elevator = new Elevator();
  });

   afterEach(() => {
    if (clock) clock.restore(); // restore real time
  });

  it('Person A goes up.', () => {
    const elev = new Elevator();
    const alice = new Person('Alice', 2, 5);

    elev.requestPickup(alice);
    elev.runNextRequest();

    expect(elev.currentFloor).to.equal(5);
    expect(elev.totalStops).to.equal(2); 
    expect(elev.totalFloorsTraversed).to.equal(5); 
    expect(elev.riders.length).to.equal(0);
    expect(elev.requests.length).to.equal(0);
  });

  it("Person A goes down", () => {
    const elev = new Elevator();
    const alice = new Person("Alice", 5, 0);

    elev.requestPickup(alice);
    elev.runNextRequest();

    expect(elev.currentFloor).to.equal(0);
    expect(elev.totalStops).to.equal(2);           
    expect(elev.totalFloorsTraversed).to.equal(10); 
    expect(elev.riders.length).to.equal(0);
    expect(elev.requests.length).to.equal(0);
  });



  it('should handle multiple people in order', () => {
  const elev = new Elevator();
  const bob = new Person('Bob', 3, 9);
  const sue = new Person('Sue', 6, 2);

  elev.requestPickup(bob);
  elev.requestPickup(sue);

  // First: Bob
  elev.runNextRequest();
  expect(elev.currentFloor).to.equal(9);
  expect(elev.totalStops).to.equal(2); 

  // Then: Sue
  elev.runNextRequest();
  expect(elev.currentFloor).to.equal(2);
  expect(elev.totalStops).to.equal(4); 
  });

  it('Person A goes up, Person B goes up', () => {
  const elev = new Elevator();
  const A = new Person('Bob', 3, 9);
  const B = new Person('Sue', 2, 6);

  elev.requestPickup(A);
  elev.runNextRequest();

  elev.requestPickup(B);
  elev.runNextRequest();

  expect(elev.totalStops).to.equal(4); 
  expect(elev.totalFloorsTraversed).to.equal(20); 
  expect(elev.riders.length).to.equal(0);
  expect(elev.requests.length).to.equal(0);

  });


  it('Person A goes up, Person B goes down', () => {
  const elev = new Elevator();
  const A = new Person('Bob', 3, 9);
  const B = new Person('Sue', 6, 2);

  elev.requestPickup(A);
  elev.runNextRequest();

  elev.requestPickup(B);
  elev.runNextRequest();

  expect(elev.totalStops).to.equal(4); 
  expect(elev.totalFloorsTraversed).to.equal(16); 
  expect(elev.riders.length).to.equal(0);
  expect(elev.requests.length).to.equal(0);

  });

  it('Person A goes down, Person B goes up', () => {
  const elev = new Elevator();
  const A = new Person('Bob', 9, 5); 
  const B = new Person('Sue', 1, 5);

  elev.requestPickup(A);
  elev.runNextRequest();

  elev.requestPickup(B);
  elev.runNextRequest();

  expect(elev.totalStops).to.equal(4); 
  expect(elev.totalFloorsTraversed).to.equal(21); 
  expect(elev.riders.length).to.equal(0);
  expect(elev.requests.length).to.equal(0);

  });

  it('Person A goes down, Person B goes down', () => {
  const elev = new Elevator();
  const A = new Person('Bob', 8, 3); 
  const B = new Person('Sue', 3, 1); 

  elev.requestPickup(A);
  elev.runNextRequest();

  elev.requestPickup(B);
  elev.runNextRequest();

  expect(elev.totalStops).to.equal(4); 
  expect(elev.totalFloorsTraversed).to.equal(15); 
  expect(elev.riders.length).to.equal(0);
  expect(elev.requests.length).to.equal(0);

  });

  it("returns to lobby if no riders and time is before 12:00 PM", () => {
    //time: 9:00 AM
    const morning = new Date(2025, 0, 1, 9, 0, 0); 
    clock = sinon.useFakeTimers(morning);

    const alice = new Person("Alice", 2, 5);
    elevator.requestPickup(alice);
    elevator.runNextRequest();

    expect(elevator.currentFloor).to.equal(5); // back to lobby
    expect(elevator.riders.length).to.equal(0);
  });

  it("stays on last drop-off floor if no riders and time is after 12:00 PM", () => {
    // time: 3:00 PM
    const afternoon = new Date(2025, 0, 1, 15, 0, 0); 
    clock = sinon.useFakeTimers(afternoon);

    const bob = new Person("Bob", 3, 7);
    elevator.requestPickup(bob);
    elevator.runNextRequest();

    expect(elevator.currentFloor).to.equal(7); // stays at last drop-off
    expect(elevator.riders.length).to.equal(0);
  });


});

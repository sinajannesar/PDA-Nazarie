const fs = require("fs")

class PDA {
    constructor(transitions, finalStates) {
        this.transitions = transitions;
        this.finalStates = new setImmediate(finalStates);
        this.currentState = 0;
        this.stack = [];
    }

    reset() {
        this.stack = [];
        this.currentState = 0;
    }
}
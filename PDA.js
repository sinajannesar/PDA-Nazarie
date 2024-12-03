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

    processInput(input) {
        this.reset();
        for (const char of input) {
            const transition = this.transitions.find(
                (t) =>
                    t.from === this.currentState &&
                    t.symbol === char &&
                    (t.pop === "#" || this.stack[this.stack.length - 1] === t.pop)
            );

            if (!transition) return false;
            if (transition.pop !== "#") this.stack.pop();
            if (transition.push !== "#") this.stack.push(transition.push)

            this.currentState = transition.to;
        }

        return this.finalStates.has(this.currentState);
    }
}

const readline = require("readline");

class PDA {
  constructor(transitions, finalStates) {
    this.transitions = transitions;
    this.finalStates = new Set(finalStates);
    this.reset();
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
          (t.pop === "#" || this.stack.at(-1) === t.pop)
      );

      if (!transition) return false;

      if (transition.pop !== "#") this.stack.pop();
      if (transition.push !== "#") this.stack.push(transition.push);

      this.currentState = transition.to;
    }
    return this.finalStates.has(this.currentState);
  }
}

function parsePDA(content) {
  const lines = content.trim().split("\n");
  if (lines.length < 4) throw new Error("Invalid PDA configuration.");

  const finalStates = lines[3].split(" ").map(Number);
  const transitions = lines.slice(4).map((line) => {
    const [from, symbol, to, pop, push] = line.split(" ");
    return { from: +from, symbol, to: +to, pop, push };
  });

  return new PDA(transitions, finalStates);
}

function main() {
  const content = `
2
a b
1
1
0 a 1 # A
1 b 1 A #
`.trim();

  try {
    const pda = parsePDA(content);

    console.log("Enter strings to check (type 'exit' to quit):");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.on("line", (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        process.exit();
      }
      console.log(pda.processInput(input) ? "Accepted" : "Rejected");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();

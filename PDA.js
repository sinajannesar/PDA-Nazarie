const fs = require("fs");
const path = require("path");

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

function parsePDA(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8").trim().split("\n");

    
    if (content.length < 4) {
      throw new Error("File format is incomplete or incorrect.");
    }

    const alphabetCount = parseInt(content[0]);
    const alphabet = content[1].split(" ");
    const finalStateCount = parseInt(content[2]);
    const finalStates = content[3].split(" ").map(Number);

    
    if (content.length < 4 + alphabetCount) {
      throw new Error("Transitions are missing in the file.");
    }

    const transitions = content.slice(4).map((line) => {
      const [from, symbol, to, pop, push] = line.split(" ");
      return { from: +from, symbol, to: +to, pop, push };
    });

    return new PDA(transitions, finalStates);
  } catch (error) {
    console.error("Error parsing PDA file:", error.message);
    process.exit(1);
  }
}

function findInputFile(pattern) {
  const files = fs.readdirSync(__dirname);
  const matchedFile = files.find((file) => file.match(pattern));
  if (!matchedFile) {
    console.error("No input file matching the pattern found!");
    process.exit(1);
  }
  return matchedFile;
}

function main() {
  const inputFile = findInputFile(/^pda_input.*\.txt$/);
  const pda = parsePDA(path.join(__dirname, inputFile));

  console.log("Enter strings to check (type 'exit' to quit):");
  require("readline")
    .createInterface({ input: process.stdin, output: process.stdout })
    .on("line", (input) => {
      if (input.toLowerCase() === "exit") process.exit();
      console.log(pda.processInput(input) ? "Accepted" : "Rejected");
    });
}

main();

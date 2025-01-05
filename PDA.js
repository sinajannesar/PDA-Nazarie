const fs = require("fs")
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
            if (transition.push !== "#") this.stack.push(transition.push)

            this.currentState = transition.to;
        }

        return this.finalStates.has(this.currentState);
    }
}


function parsePDA(filePath) {
    const [alphabetCount, , ...lines] = fs.readFileSync(filePath, "utf8").trim().split("\n");
    const finalStates = lines[alphabetCount].split(" ").map(Number);
    const transitions = lines.slice(alphabetCount + 2).map((line) => {
        const [from, symbol, to, pop, push] = line.split(" ");
        return { from: +from, symbol, to: +to, pop, push };
    });

    return new PDA(transitions, finalStates);
}


function findInputFile(pattern) {
    const files = fs.readdirSync(__dirname);
    return files.find((file) => file.match(pattern));
}

function main() {
    const inputFile = findInputFile(/^pda_input.*\.txt$/);
    if (!inputFile) {
        console.error("Input file not found!");
        return;
    }

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

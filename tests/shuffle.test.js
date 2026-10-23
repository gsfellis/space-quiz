const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const shuffleFunction = html.match(/    function shuffleQuestions\(items\) \{\r?\n[\s\S]*?\r?\n    \}/)?.[0];

if (!shuffleFunction) {
  throw new Error("Could not find shuffleQuestions in index.html");
}

function loadShuffle(random) {
  return vm.runInNewContext(`(${shuffleFunction.trim()})`, {
    Math: { floor: Math.floor, random }
  });
}

test("shuffles a copy of the question bank without separating question data", () => {
  const bank = [
    { question: "A", answers: ["a1", "a2"], correct: 1, fact: "A fact" },
    { question: "B", answers: ["b1", "b2"], correct: 0, fact: "B fact" },
    { question: "C", answers: ["c1", "c2"], correct: 1, fact: "C fact" },
    { question: "D", answers: ["d1", "d2"], correct: 0, fact: "D fact" }
  ];
  const originalBank = bank.slice();
  const shuffleQuestions = loadShuffle(() => 0);

  const shuffled = shuffleQuestions(bank);

  assert.notEqual(shuffled, bank);
  assert.equal(shuffled.map(item => item.question).join(","), "B,C,D,A");
  assert.equal(bank.map(item => item.question).join(","), "A,B,C,D");
  assert.ok(shuffled.every(item => originalBank.includes(item)));
  assert.equal(shuffled[0].answers[0], "b1");
  assert.equal(shuffled[0].correct, 0);
  assert.equal(shuffled[0].fact, "B fact");
});

test("supports a no-swap shuffle outcome", () => {
  const bank = [{ question: "A" }, { question: "B" }, { question: "C" }];
  const shuffled = loadShuffle(() => 0.999999)(bank);

  assert.notEqual(shuffled, bank);
  assert.equal(shuffled.map(item => item.question).join(","), "A,B,C");
});

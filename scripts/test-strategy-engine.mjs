import assert from "node:assert/strict";
import { generateRaceStrategy } from "../packages/shared/dist/index.js";

const categories = ["singles-open", "singles-pro", "doubles-open", "doubles-pro", "relay", "other"];
const goalTimes = ["55:00", "1:00:00", "1:10:00", "1:20:00", "1:30:00", "1:40:00", "1:50:00", "2:00:00", "2:10:00", "2:20:00", "2:30:00"];

const expectedFormats = {
  "singles-open": "singles",
  "singles-pro": "singles",
  "doubles-open": "doubles",
  "doubles-pro": "doubles",
  relay: "relay",
  other: "singles"
};

const signatures = new Set();

for (const category of categories) {
  const categorySignatures = new Set();
  for (const goalTime of goalTimes) {
    const strategy = generateRaceStrategy({ raceCategory: category, goalTime, runningPace: "5:00/km" });
    assert.equal(strategy.format, expectedFormats[category], `${category} should generate a ${expectedFormats[category]} strategy`);
    assert.equal(strategy.goalTime, goalTime, `${category} ${goalTime} should preserve goal time`);
    assert.ok(strategy.title.includes(goalTime), `${category} ${goalTime} title should include goal time`);
    assert.equal(strategy.stationSplits.length, 8, `${category} ${goalTime} should cover all 8 stations`);
    assert.equal(strategy.stationTargets.length, 10, `${category} ${goalTime} should include 8 stations plus transitions and run total`);
    assert.ok(strategy.runPacing.some((item) => item.includes("5:00/km")), `${category} ${goalTime} should include saved running pace guidance`);

    if (strategy.format === "singles") {
      assert.ok(strategy.stationSplits.every((split) => split.athleteB === "N/A"), `${category} ${goalTime} should not show partner workload`);
    }
    if (strategy.format === "doubles") {
      assert.ok(strategy.stationSplits.some((split) => split.athleteA.includes("%") && split.athleteB.includes("%")), `${category} ${goalTime} should show split percentages`);
      assert.ok(strategy.runPacing.some((item) => item.toLowerCase().includes("both athletes")), `${category} ${goalTime} should include doubles running guidance`);
    }
    if (strategy.format === "relay") {
      assert.ok(strategy.stationSplits.some((split) => split.athleteA.toLowerCase().includes("athlete") || split.athleteB.toLowerCase().includes("athlete")), `${category} ${goalTime} should include relay handoff ownership`);
      assert.ok(strategy.runPacing.some((item) => item.toLowerCase().includes("change zone")), `${category} ${goalTime} should include relay change-zone guidance`);
    }

    const targetSignature = strategy.stationTargets.map((target) => `${target.station}:${target.target}`).join("|");
    categorySignatures.add(targetSignature);
    signatures.add(`${category}:${strategy.format}:${strategy.tier}:${targetSignature}:${strategy.runPacing.join("|")}:${strategy.stationSplits.map((split) => `${split.station}-${split.athleteA}-${split.athleteB}`).join("|")}`);
  }
  assert.equal(categorySignatures.size, goalTimes.length, `${category} should produce distinct target times for every goal-time option`);
}

for (const goalTime of goalTimes) {
  const byGoal = categories.map((category) => {
    const strategy = generateRaceStrategy({ raceCategory: category, goalTime });
    return `${strategy.format}:${strategy.stationSplits.map((split) => `${split.athleteA}/${split.athleteB}`).join("|")}`;
  });
  assert.ok(new Set(byGoal).size >= 3, `${goalTime} should produce different singles/doubles/relay strategy structures`);
}

assert.equal(signatures.size, categories.length * goalTimes.length, "Every category and goal-time case should have a unique strategy signature");
console.log(`Strategy matrix passed: ${categories.length * goalTimes.length} category/time cases.`);

import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSearch, todayInAngola, isValidDate } from "../src/lib/search-validation";
import { buildSearchParams, buildQuickBookParams } from "../src/lib/search-params";
import { flights } from "../src/lib/data/flights";

const today = "2026-10-07";
const search = { origin: "LAD", destination: "CBT", date: "2026-10-08", departureDate: "2026-10-08", returnDate: "2026-10-12", flexible: false, tripType: "oneway", legs: [] };
test("Angola dates cross midnight independently of the host timezone", () => {
  assert.equal(todayInAngola(new Date("2026-10-07T23:30:00Z")), "2026-10-08");
  assert.equal(isValidDate("2026-02-30"), false);
});
test("exact search requires different airports and a valid future date", () => {
  assert.equal(validateSearch(search, today), null);
  assert.ok(validateSearch({ ...search, origin: "" }, today));
  assert.ok(validateSearch({ ...search, destination: "LAD" }, today));
  assert.ok(validateSearch({ ...search, date: "2026-09-30" }, today));
  assert.ok(validateSearch({ ...search, date: null }, today));
  assert.equal(validateSearch({ ...search, date: null, flexible: true }, today), null);
});
test("round trip requires both dates in chronological order", () => {
  const roundtrip = { ...search, tripType: "roundtrip" };
  assert.equal(validateSearch(roundtrip, today), null);
  assert.ok(validateSearch({ ...roundtrip, returnDate: null }, today));
  assert.ok(validateSearch({ ...roundtrip, returnDate: "2026-10-07" }, today));
});
test("multi city rejects unordered or incomplete legs", () => {
  const legs = [{ id: "a", origin: "LAD", destination: "CBT", date: "2026-10-08" }, { id: "b", origin: "CBT", destination: "LAD", date: "2026-10-12" }];
  assert.equal(validateSearch({ ...search, tripType: "multicity", legs }, today), null);
  assert.ok(validateSearch({ ...search, tripType: "multicity", legs: [...legs].reverse() }, today));
  assert.ok(validateSearch({ ...search, tripType: "multicity", legs: legs.slice(0, 1) }, today));
});
test("URL keeps round trip dates and marks quick searches as flexible", () => {
  const query = new URLSearchParams(buildSearchParams({ ...search, tripType: "roundtrip", passengers: 2 }));
  assert.equal(query.get("departureDate"), search.departureDate);
  assert.equal(query.get("returnDate"), search.returnDate);
  assert.equal(new URLSearchParams(buildQuickBookParams("LAD", "CBT")).get("flexible"), "true");
});
test("demo inventory has future departures and return routes with seats", () => {
  assert.ok(flights.length > 0);
  for (const flight of flights) {
    assert.ok(new Date(`${flight.departureTime}+01:00`).getTime() > Date.now());
    assert.ok(flights.some((other) => other.origin === flight.destination && other.destination === flight.origin && other.availableSeats > 0));
    assert.equal(flight.origin === flight.destination, false);
  }
});

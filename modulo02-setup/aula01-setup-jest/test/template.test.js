import { test, expect } from "@jest/globals";

function sum(a, b) {
	return a + b;
}

test("sum two values", () => {
	expect(sum(2, 3)).toBe(5);
});

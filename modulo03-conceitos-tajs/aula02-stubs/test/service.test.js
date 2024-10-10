import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";

describe("Service Test Suite", () => {
	let _service;
	const filename = "testfile.ndjson";
	beforeEach(() => {
		_service = new Service({
			filename,
		});
	});

	describe("#read", () => {
		//criar teste para validar se o arquivo existe
		it("should throw error when file not exists", async () => {
			jest.spyOn(fs, "readFile").mockRejectedValue(
				new Error("file not exists")
			);
			expect(async () => await _service.read()).rejects.toThrow(
				new Error("file not exists")
			);
		});

		it("should return a empty array when file is empty", async () => {
			jest.spyOn(fs, "readFile").mockResolvedValue("");
			const result = await _service.read();
			expect(result).toEqual([]);
		});

		it("should return users without password when file conains users", async () => {
			const dbData = [
				{
					username: "test",
					password: "123",
					createdAt: new Date().toISOString(),
				},
				{
					username: "test2",
					password: "1234",
					createdAt: new Date().toISOString(),
				},
			];

			const fileContents = dbData
				.map((item) => JSON.stringify(item).concat("\n"))
				.join("");

			jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);

			const result = await _service.read();

			const expected = dbData.map(({ password, ...rest }) => ({
				...rest,
			}));
			expect(result).toEqual(expected);
		});
	});
});

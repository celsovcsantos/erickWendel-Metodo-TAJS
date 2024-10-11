import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import crypto from "node:crypto";
import fs from "node:fs/promises";

describe("Service Test Suite", () => {
	let _service;
	const filename = "testfile.ndjson";
	const mockedHashPwd = "hashedpassword";

	describe("#create - spies", () => {
		beforeEach(() => {
			jest.spyOn(crypto, crypto.createHash.name).mockReturnValue({
				update: jest.fn().mockReturnThis(),
				digest: jest.fn().mockReturnValue(mockedHashPwd),
			});

			jest.spyOn(fs, fs.appendFile.name).mockResolvedValue();
			_service = new Service({
				filename,
			});
		});

		it("should call appdFile with right params", async () => {
			//AAA - Arrange, Act, Assert
			const input = {
				username: "testuser",
				password: "testpassword",
			};
			const expectedCreatedAt = new Date().toISOString();
			//Arrange
			jest.spyOn(
				Date.prototype,
				Date.prototype.toISOString.name
			).mockReturnValue(expectedCreatedAt);

			//Act
			await _service.create(input);

			//Assert
			expect(crypto.createHash).toHaveBeenCalledTimes(1);
			expect(crypto.createHash).toHaveBeenCalledWith("sha256");

			const hash = crypto.createHash("sha256");
			expect(hash.update).toHaveBeenCalledWith(input.password);
			expect(hash.digest).toHaveBeenCalledWith("hex");

			const expected = JSON.stringify({
				...input,
				createdAt: expectedCreatedAt,
				password: mockedHashPwd,
			}).concat("\n");

			expect(fs.appendFile).toHaveBeenCalledWith(filename, expected);
		});
	});
});

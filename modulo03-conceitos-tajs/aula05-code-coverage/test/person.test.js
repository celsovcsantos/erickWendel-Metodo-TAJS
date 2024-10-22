import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import mapPerson from '../src/person.js';

describe('Person Test Suite', () => {
	describe('Happy path', () => {
		it('should map a person', () => {
			const personStr = '{"name": "Celso Santos", "age": 39}';
			const person = mapPerson(personStr);
			expect(person).toEqual({
				name: 'Celso Santos',
				age: 39,
				createdAt: expect.any(Date),
			});
		});
	});

	describe('What coverage doesnt tell you', () => {
		it('should not map a person when JSON is invalid', () => {
			const personStr = '{"name":';
			//const person = mapPerson(personStr);
			expect(() => mapPerson(personStr)).toThrow(
				'Unexpected end of JSON input'
			);
		});

		it('should not map a person when JSON data is invalid', () => {
			const personStr = '{}';
			const person = mapPerson(personStr);
			expect(person).toEqual({
				name: undefined,
				age: undefined,
				createdAt: expect.any(Date),
			});
		});
	});
});

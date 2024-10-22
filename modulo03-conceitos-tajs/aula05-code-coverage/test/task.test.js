import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import Task from '../src/task.js';
import { setTimeout } from 'node:timers/promises';

describe('Task Tests Suite', () => {
	let _logMock;
	let _task;

	beforeEach(() => {
		_logMock = jest.spyOn(console, console.log.name).mockImplementation();
		_task = new Task();
	});

	it('should only run tasks that are due with fake timers (fast)', async () => {
		// AAA - Arrange, Act, Assert
		// Arrange
		jest.useFakeTimers();

		const tasks = [
			{
				name: 'Task-Will_Run-In-5-Secs',
				dueAt: new Date(Date.now() + 5_000), //5 secs
				fn: jest.fn(),
			},
			{
				name: 'Task-Will_Run-In-5-Secs',
				dueAt: new Date(Date.now() + 10_000), //10 secs
				fn: jest.fn(),
			},
		];
		_task.run(200); // 200 ms
		expect(_logMock).toHaveBeenCalledWith('tasks finished!');

		// console.log("tasks", tasks);
		//console.log("logMock", _logMock);

		//expect(_logMock).toBeCalledTimes(1);

		// Act
		_task.save(tasks.at(0));
		_task.save(tasks.at(1));

		_task.run(200); // 200 ms

		//Assert
		jest.advanceTimersByTime(4000);
		expect(tasks.at(0).fn).not.toHaveBeenCalled();
		expect(tasks.at(1).fn).not.toHaveBeenCalled();

		jest.advanceTimersByTime(2000);
		expect(tasks.at(0).fn).toHaveBeenCalled();
		expect(tasks.at(1).fn).not.toHaveBeenCalled();

		jest.advanceTimersByTime(4000);
		expect(tasks.at(1).fn).toHaveBeenCalled();

		jest.useRealTimers();
	});
});

export default class Task {
	#tasks = new Set();
	save({ name, dueAt, fn }) {
		console.log(
			`Task [${name}] saved and will be executed as ${dueAt.toISOString()}`
		);
		this.#tasks.add({ name, dueAt, fn });
	}
	run(everyMs) {
		if (this.#tasks.size === 0) {
			console.log("tasks finished!");
			return;
		}
		const intervalId = setInterval(() => {
			const now = new Date();
			// console.log("now", this.#tasks.size);
			// if (this.#tasks.size === 0) {
			// 	console.log("tasks finished!");
			// 	clearInterval(intervalId);
			// 	return;
			// }

			for (const task of this.#tasks) {
				if (task.dueAt <= now) {
					task.fn();
					this.#tasks.delete(task);
				}
			}
		}, everyMs);
	}
}

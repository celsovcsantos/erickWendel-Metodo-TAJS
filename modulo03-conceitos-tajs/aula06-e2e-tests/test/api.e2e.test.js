import {
	describe,
	test,
	expect,
	jest,
	beforeAll,
	it,
	afterAll,
} from '@jest/globals';
import Person from '../src/person.js';

function waitForServerStatus(server) {
	return new Promise((resolve, reject) => {
		server.once('error', (err) => reject(err));
		server.once('listening', () => resolve());
	});
}

describe('E2E Test Suite', () => {
	describe('E2E Tests for Server in a non-test env', () => {
		let _testServer;

		afterAll((done) => {
			console.log.mockRestore();
			_testServer.close(done);
		});
		it('should start server with PORT 4000', async () => {
			const port = 4000;
			process.env.NODE_ENV = 'production';
			process.env.PORT = port;
			jest.spyOn(console, console.log.name);
			const { default: server } = await import('../src/index.js');
			_testServer = server;
			await waitForServerStatus(_testServer);

			const serverInfo = _testServer.address();
			expect(serverInfo.port).toBe(port);
			expect(console.log).toHaveBeenCalledWith(
				`server is running at ${serverInfo.address}:${serverInfo.port}`
			);
		});
	});

	describe('E2E Tests for Server', () => {
		let _testServer;
		let _testServerAddress;

		beforeAll(async () => {
			process.env.NODE_ENV = 'test';
			const { default: server } = await import('../src/index.js');
			_testServer = server.listen();
			await waitForServerStatus(_testServer);
			const serverInfo = _testServer.address();
			_testServerAddress = `http://localhost:${serverInfo.port}`;
		});

		afterAll((done) => {
			_testServer.close(done);
		});

		it('should return 404 for unsupported routes', async () => {
			const response = await fetch(`${_testServerAddress}/unsupported`, {
				method: 'POST',
			});
			expect(response.status).toBe(404);
		});

		it('should return 400 and missing file message when cpf is empty', async () => {
			const response = await fetch(`${_testServerAddress}/persons`, {
				method: 'POST',
				body: JSON.stringify({ name: 'Fulano da Silva' }),
			});
			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.validationError).toEqual('cpf is required');
		});

		it('should return 400 and missing file message when name is empty', async () => {
			const response = await fetch(`${_testServerAddress}/persons`, {
				method: 'POST',
				body: JSON.stringify({ cpf: '123.123.123-12' }),
			});
			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.validationError).toEqual('name is required');
		});

		it('should return 500 when body is invalid', async () => {
			_logMock = jest
				.spyOn(console, console.error.name)
				.mockImplementation();
			const response = await fetch(`${_testServerAddress}/persons`, {
				method: 'POST',
				body: { name: 'Fulano da Silva' },
			});
			//console.log(_logMock.mockImplementation().mock.calls);
			expect(_logMock.mockImplementation().mock.calls[0][0]).toEqual(
				'deu ruim'
			);
			expect(response.status).toBe(500);
		});

		it('should return OK when process valid person', async () => {
			_logMock = jest
				.spyOn(console, console.log.name)
				.mockImplementation();
			const person = {
				name: 'Fulano da Silva',
				cpf: '123.123.123-12',
			};

			const response = await fetch(`${_testServerAddress}/persons`, {
				method: 'POST',
				body: JSON.stringify(person),
			});

			expect(_logMock.mockImplementation().mock.calls[0][0]).toEqual(
				'registado com sucesso!!'
			);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(JSON.stringify(data)).toEqual(
				JSON.stringify({ result: 'ok' })
			);
		});

		//tempo do video 34:50
	});
});

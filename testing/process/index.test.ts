import {process1, process2, process3, process4, process5, process6} from ".";
import {duploTesting} from "../setup";

describe("process", () => {
	it("basic", async() => {
		const result = await duploTesting
		.testProcess(process1)
		.setRequestProperties({query: {info: "test"}})
		.launch();

		expect(result).toStrictEqual({processValue: "test"});
	});

	it("with checker", async() => {
		const result = await duploTesting
		.testProcess(process2)
		.mockChecker(0, {info: "more", data: "test"})
		.launch();	
	
		expect(result).toStrictEqual({processValue: "test"});

		const res2 = await duploTesting
		.testProcess(process2)
		.mockChecker(0, {info: "less", data: "test"})
		.launch();	
	
		expect(res2.info).toBe("bad.test2");
	});

	it("with process", async() => {
		const res1 = await duploTesting
		.testProcess(process3)
		.mockProcess(0, {processValue: "lala"})
		.launch();
	
		expect(res1).toStrictEqual({processValue: "lala"});
	});

	it("with options", async() => {
		const res1 = await duploTesting
		.testProcess(process4)
		.setOptions({processValue: "lala"})
		.launch();
	
		expect(res1).toStrictEqual({options: {processValue: "lala"}});

		const res2 = await duploTesting
		.testProcess(process4)
		.launch();
	
		expect(res2).toStrictEqual({options: {processValue: "toto"}});
	});

	it("with input", async() => {
		const res1 = await duploTesting
		.testProcess(process5)
		.launch();
	
		expect(res1).toStrictEqual({input: "toto"});

		const res2 = await duploTesting
		.testProcess(process6)
		.setInputFloorPickup({id: "toto"})
		.launch();
	
		expect(res2).toStrictEqual({input: "toto"});
	});
});

import {abstractRoute1, abstractRoute2, abstractRoute3, abstractRoute4, abstractRoute5} from ".";
import {duploTesting} from "../setup";

describe("abstractRoute", () => {
	it("basic", async() => {
		const result = await duploTesting
		.testAbstractRoute(abstractRoute1.abstractRoute)
		.launch();

		expect(result).toStrictEqual({abstractRouteValue: "test"});
	});

	it("with checker", async() => {
		const result = await duploTesting
		.testAbstractRoute(abstractRoute2.abstractRoute)
		.mockChecker(0, {info: "more", data: "test"})
		.launch();	
	
		expect(result).toStrictEqual({processValue: "test"});

		const res2 = await duploTesting
		.testAbstractRoute(abstractRoute2.abstractRoute)
		.mockChecker(0, {info: "less", data: "test"})
		.launch();	
	
		expect(res2.info).toBe("bad.test2");
	});

	it("with process", async() => {
		const res1 = await duploTesting
		.testAbstractRoute(abstractRoute3.abstractRoute)
		.mockProcess(0, {processValue: "lala"})
		.launch();
	
		expect(res1).toStrictEqual({processValue: "lala"});
	});

	it("with abstractRoute", async() => {
		const res1 = await duploTesting
		.testAbstractRoute(abstractRoute4.abstractRoute)
		.mockAbstractRoute({abstractRouteValue: "tata"})
		.mockChecker(0, {info: "more", data: test}, {passCatch: true})
		.mockProcess(1, {processValue: "lala"})
		.launch();
	
		expect(res1.info).toBe("good.test4");
		expect(res1.data).toBe("lala-tata");
	});

	it("with options", async() => {
		const res1 = await duploTesting
		.testAbstractRoute(abstractRoute5.abstractRoute)
		.setOptions({processValue: "lala"})
		.launch();
	
		expect(res1).toStrictEqual({options: {processValue: "lala"}});

		const res2 = await duploTesting
		.testAbstractRoute(abstractRoute5.abstractRoute)
		.launch();
	
		expect(res2).toStrictEqual({options: {processValue: "toto"}});
	});
});

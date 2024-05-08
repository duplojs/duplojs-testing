import {duploTesting} from "../setup";
import {route1, route2, route3, route4, route5} from ".";
import {CutStep, Response} from "@duplojs/duplojs";

describe("route", () => {
	it("basic", async() => {
		const res = await duploTesting
		.testRoute(route1)
		.setRequestProperties({query: {info: "test1"}})
		.launch();	
	
		expect(res.information).toBe("test1");

		const res1 = await duploTesting
		.testRoute(route1)
		.setRequestProperties({query: {info: "crach"}})
		.launch();
		
		expect(res1.information).toBe("WHAT_WAS_SENT_ERROR");
	});

	it("with checker", async() => {
		const res1 = await duploTesting
		.testRoute(route2)
		.mockChecker(0, {info: "more", data: "test"})
		.launch();	
	
		expect(res1.information).toBe("good.test2");

		const res2 = await duploTesting
		.testRoute(route2)
		.mockChecker(0, {info: "less", data: "test"})
		.launch();	
	
		expect(res2.information).toBe("bad.test2");
	});

	it("with process", async() => {
		const res1 = await duploTesting
		.testRoute(route3)
		.mockChecker(0, {info: "more", data: test}, {passCatch: true})
		.mockProcess(1, {processValue: "lala"})
		.launch();
	
		expect(res1.information).toBe("good.test3");
		expect(res1.body).toBe("lala");
	});

	it("with abstractRoute", async() => {
		const res1 = await duploTesting
		.testRoute(route4)
		.mockAbstractRoute({abstractRouteValue: "tata"})
		.mockChecker(0, {info: "more", data: test}, {passCatch: true})
		.mockProcess(1, {processValue: "lala"})
		.launch();
	
		expect(res1.information).toBe("good.test4");
		expect(res1.body).toBe("lala-tata");
	});

	it("with hook", async() => {
		const res1 = await duploTesting
		.testRoute(route5)
		.mockChecker(0, {info: "more", data: test}, {passCatch: true})
		.mockProcess(1, {processValue: "lala"})
		.launch();
	
		expect(res1.information).toBe("good.test5");
		expect(res1.body).toBe("lala");

		const res2 = await duploTesting
		.testRoute(route5)
		.hook("prepareDuplose", (route) => {
			route.steps.unshift(
				new CutStep(
					() => {
						throw new Error("test");
					}, 
					[]
				)
			);
		})
		.mockChecker(0, {info: "more", data: test}, {passCatch: true})
		.mockProcess(1, {processValue: "lala"})
		.launch();
	
		expect(res2.information).toBe("INTERNAL_SERVER_ERROR");
	});
});

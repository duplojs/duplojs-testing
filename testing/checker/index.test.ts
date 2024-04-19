import {checker1} from ".";
import {duploTesting} from "../setup";

describe("checker", () => {
	it("more info", async() => {
		const result = await duploTesting.testChecker(checker1, 1);

		expect(result).toStrictEqual({info: "more", data: "toto"});
	});

	it("more info with options", async() => {
		const result = await duploTesting.testChecker(checker1, 1, {test: "tutu"});
		
		expect(result).toStrictEqual({info: "more", data: "tutu"});
	});

	it("less info", async() => {
		const result = await duploTesting.testChecker(checker1, 0);
		
		expect(result).toStrictEqual({info: "less", data: null});
	});
});

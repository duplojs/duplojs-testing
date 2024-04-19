import {zod} from "@duplojs/duplojs";
import {duplo} from "../main";
import {BadRequestHttpException} from "@duplojs/http-exception";
import {checker1} from "../checker";

export const process1 = duplo
.createProcess("process1")
.extract({
	query: {
		info: zod.string()
	}
})
.cut(
	({pickup}) => {
		return {
			processValue: pickup("info")
		};
	},
	["processValue"]
)
.build(["processValue"]);

export const process2 = duplo
.createProcess("process2")
.check(
	checker1,
	{
		input: () => 1,
		catch: () => {
			throw new BadRequestHttpException("bad.test2");
		}, 
		result: "more",
		indexing: "processValue"
	}
)
.build(["processValue"]);

export const process3 = duplo
.createProcess("process3")
.process(
	process1,
	{
		pickup: ["processValue"]
	}
)
.build(["processValue"]);

export const process4 = duplo
.createProcess("process4")
.options({processValue: "toto"})
.build(["options"]);

export const process5 = duplo
.createProcess("process5")
.input(() => "toto")
.build(["input"]);

export const process6 = duplo
.createProcess("process5")
.input((pickup) => pickup("id"))
.build(["input"]);

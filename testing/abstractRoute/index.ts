import {BadRequestHttpException, OkHttpException} from "@duplojs/http-exception";
import {checker1} from "../checker";
import {duplo} from "../main";
import {process1} from "../process";

export const abstractRoute1 = duplo
.declareAbstractRoute("abstractRoute1")
.cut(
	() => {
		return {
			abstractRouteValue: "test"
		};
	},
	["abstractRouteValue"]
)
.build(["abstractRouteValue"]);

export const abstractRoute2 = duplo
.declareAbstractRoute("abstractRoute2")
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

export const abstractRoute3 = duplo
.declareAbstractRoute("abstractRoute3")
.process(
	process1,
	{
		pickup: ["processValue"]
	}
)
.build(["processValue"]);

export const abstractRoute4 = abstractRoute1({pickup: ["abstractRouteValue"]})
.declareAbstractRoute("abstractRoute4")
.check(
	checker1,
	{
		input: () => 1,
		catch: () => {
			
		}, 
		result: "more"
	}
)
.process(
	process1,
	{
		pickup: ["processValue"]
	}
)
.cut(() => ({}))
.handler(
	({pickup}) => {
		throw new OkHttpException("good.test4", `${pickup("processValue")}-${pickup("abstractRouteValue")}`);
	}
)
.build();

export const abstractRoute5 = duplo
.declareAbstractRoute("abstractRoute5")
.options({processValue: "toto"})
.build(["options"]);

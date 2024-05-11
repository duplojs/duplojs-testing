import {BadRequestHttpException, OkHttpException, UnauthorizedHttpException} from "@duplojs/http-exception";
import {duplo} from "../main";
import {IHaveSentThis} from "@duplojs/what-was-sent";
import {zod} from "@duplojs/duplojs";
import {checker1} from "../checker";
import {process1} from "../process";
import {abstractRoute1} from "../abstractRoute";

export const route1 = duplo
.declareRoute("GET", "/")
.extract({
	query: {
		info: zod.string().transform((v) => v)
	}
})
.cut(
	({pickup}) => {
		if(pickup("info") === "crach"){
			throw new BadRequestHttpException("crash");
		}
		return {};
	}, 
	[],
	new IHaveSentThis(BadRequestHttpException.code, "crashBad")
)
.handler(
	({pickup}) => {
		throw new OkHttpException(pickup("info"));
	},
	new IHaveSentThis(OkHttpException.code, "test1")
);

export const route2 = duplo
.declareRoute("GET", "/")
.check(
	checker1,
	{
		input: () => 1,
		catch: () => {
			throw new BadRequestHttpException("bad.test2");
		}, 
		result: "more"
	}
)
.handler(
	({pickup}) => {
		throw new OkHttpException("good.test2");
	}
);

export const route3 = duplo
.declareRoute("GET", "/")
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
.handler(
	({pickup}) => {
		throw new OkHttpException("good.test3", pickup("processValue"));
	}
);

export const route4 = abstractRoute1({pickup: ["abstractRouteValue"]})
.declareRoute("GET", "/")
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
);

export const route5 = duplo
.declareRoute("POST", "/")
.hook("onConstructRequest", () => {})
.hook("onConstructResponse", () => {})
.hook("beforeRouteExecution", () => {})
.hook("parsingBody", () => {})
.hook("serializeBody", () => {})
.hook("beforeSend", () => {})
.hook("onError", () => {})
.extract({
	body: {}
})
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
		throw new OkHttpException("good.test5", pickup("processValue"));
	}
);

export const route6 = duplo
.declareRoute("GET", "/")
.extract(
	{
		body: {
			info: zod.string().transform((v) => v)
		}
	}, 
	() => {
		throw new UnauthorizedHttpException("toto");
	}
)
.handler(
	({pickup}) => {
		throw new OkHttpException(pickup("info"));
	},
	new IHaveSentThis(OkHttpException.code, "test1")
);

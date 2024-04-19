import {Checker} from "@duplojs/duplojs";

const output = <info>(info: info, data: unknown) => ({info, data});

export async function testChecker<
	_checker extends Checker
>(
	checker: _checker, 
	input: _checker extends Checker<any, infer input> ? input : never,
	options?: _checker extends Checker<infer options> ? options : never
){

	options = {
		...checker.options,
		...options,
	} as any;

	return await checker.handler(input, output as any, options) as any as ReturnType<_checker["handler"]>;
}

import {AbstractRoute, AnyFunction, CheckerOutput, CheckerStep, CutStep, DuploInstance, Duplose, Hook, Process, ProcessStep, PromiseOrNot, Response, Route} from "@duplojs/duplojs";
import httpMocks from "node-mocks-http";
import EventEmitter from "events";
import {Request} from "@duplojs/duplojs";
import {DuploTesting} from ".";
import {duploExtends, duploInject} from "@duplojs/editor-tools";

interface MockCheckerOptions {
	passCatch?: boolean | any[]
}

export function makeTestingHooksLifeCycle<
	_duplose extends Route | Process | AbstractRoute = Route | Process | AbstractRoute,
	_request extends Request = Request,
	_response extends Response = Response,
>(){
	return {
		prepareDuplose: new Hook<[duplose: _duplose]>(1),
		prepareRequest: new Hook<[request: _request]>(1),
		prepareResponse: new Hook<[response: Response]>(1),
	};
}

export abstract class TestDuplose <
	_duplose extends Route | Process | AbstractRoute,
	_request extends Request = Request,
	_response extends Response = Response,
	_returnType extends unknown = unknown
>{
	protected defaultFloorValue: Record<any, unknown> = {};
	protected testingHooksLifeCycle = makeTestingHooksLifeCycle<_duplose>();

	constructor(
		protected duploTesting: DuploTesting,
		protected duploInstance: DuploInstance<any>,
		protected duplose: _duplose,
		originalDuplose: _duplose,
	){
		this.duploTesting.pluginsCollection.forEach(([plugin, options]) => {
			this.duploInstance.use(plugin, options);
		});

		this.duplose.descs = [...originalDuplose.descs];
		this.duplose.steps = [...originalDuplose.steps];
		this.duplose.handler = originalDuplose.handler;

		Object.entries(originalDuplose.hooksLifeCyle).forEach(([key, hook]) => {
			this.duplose.hooksLifeCyle[key].addSubscriber(
				() => {},
				...hook.subscribers.filter((s): s is AnyFunction => typeof s === "function")
			);
		});
	}

	hook(
		hookName: "prepareDuplose", 
		callback: ReturnType<
			ReturnType<
				typeof makeTestingHooksLifeCycle<_duplose>
			>["prepareDuplose"]["build"]
		>
	): this;
	hook(
		hookName: "prepareRequest", 
		callback: ReturnType<
			ReturnType<
				typeof makeTestingHooksLifeCycle<_duplose, _request>
			>["prepareRequest"]["build"]
		>
	): this;
	hook(
		hookName: "prepareResponse", 
		callback: ReturnType<
			ReturnType<
				typeof makeTestingHooksLifeCycle<_duplose, _request, _response>
			>["prepareResponse"]["build"]
		>
	): this;
	hook(hookName: keyof ReturnType<typeof makeTestingHooksLifeCycle>, callback: unknown){
		this.testingHooksLifeCycle[hookName].addSubscriber(callback as AnyFunction);
		return this;
	}

	setDefaultFloorValue(defaultFloorValue: Record<any, unknown>){
		this.defaultFloorValue = defaultFloorValue;

		return this;
	}

	mockChecker(identifier: string | number, output: CheckerOutput, options?: MockCheckerOptions){
		const currentStepIndex = typeof identifier === "string" 
			? this.duplose.steps.findIndex((step) => step.name === identifier && step instanceof CheckerStep)
			: this.duplose.steps[identifier] && this.duplose.steps[identifier] instanceof CheckerStep
				? identifier
				: -1
			;

		if(currentStepIndex === -1){
			throw new Error(`Missing step : ${identifier}`);
		}

		const currentStep = this.duplose.steps[currentStepIndex] as CheckerStep;
		const currenrChecker = currentStep.parent; 

		if(options?.passCatch){
			const rawResponse = httpMocks.createResponse({eventEmitter: EventEmitter});
			const response = new this.duploInstance.class.Response(rawResponse);

			try {
				currentStep.params.catch(
					response, 
					//@ts-expect-error tuple error.
					...(options.passCatch === true ? [] : options.passCatch),
				);
			} catch {}
		}

		const mockedChecker = new this.duploInstance.class.Checker(currentStep.name, []);
		mockedChecker.handler = () => output;
		mockedChecker.options = currenrChecker.options;
		const mockedStep = new CheckerStep(mockedChecker, currentStep.params);

		this.duplose.steps[currentStepIndex] = mockedStep;

		return this;
	}

	mockProcess(identifier: string | number, drop: Record<any, unknown>){
		const currentStepIndex = typeof identifier === "string" 
			? this.duplose.steps.findIndex((step) => step.name === identifier && step instanceof ProcessStep)
			: this.duplose.steps[identifier] && this.duplose.steps[identifier] instanceof ProcessStep
				? identifier
				: -1
			;

		if(currentStepIndex === -1){
			throw new Error(`Missing step : ${identifier}`);
		}

		const currentStep = this.duplose.steps[currentStepIndex] as ProcessStep;
		const currentProcess = currentStep.parent; 

		const mockedProcess = new this.duploInstance.class.Process(currentStep.name, []);
		mockedProcess.options = currentProcess.options;
		mockedProcess.input = currentProcess.input;
		mockedProcess.duploseFunction = () => drop;
		const mockedStep = new ProcessStep(mockedProcess, currentStep.params);

		this.duplose.steps[currentStepIndex] = mockedStep;

		return this;
	}

	async launch(){
		let currentDuplose: "route" | "process" | "abstractRoute";

		if(this.duplose instanceof Route){
			currentDuplose = "route";
		}
		else if(this.duplose instanceof AbstractRoute){
			currentDuplose = "abstractRoute";
		}
		else if(this.duplose instanceof Process){
			currentDuplose = "process";
		}
		
		Object.entries(this.testingHooksLifeCycle).forEach(([key, value]) => {
			this.testingHooksLifeCycle[key].addSubscriber(
					this.duploTesting.testingHooks[currentDuplose][key] as Hook<any>
			);
		});
		
		this.testingHooksLifeCycle.prepareDuplose.launchSubscriber(this.duplose);
		
		duploExtends(
			this.duplose, 
			{
				defaultFloorValue: this.defaultFloorValue
			}
		);

		duploInject(
			this.duplose,
			({code}) => {
				Object.keys(this.defaultFloorValue).forEach((key) => {
					code(
						"after_make_floor", 
						`floor.drop("${key}", this.extensions.defaultFloorValue["${key}"]);`
					);
				});
			}
		);

		await this.duploInstance.class.serverHooksLifeCycle.beforeBuildRouter.launchSubscriberAsync();

		this.duplose.build();

		const rawRequest = httpMocks.createRequest();
		const request = new this.duploInstance.class.Request(rawRequest, {}, "") as _request;

		const rawResponse = httpMocks.createResponse({eventEmitter: EventEmitter});
		const response = new this.duploInstance.class.Response(rawResponse) as _response;

		this.testingHooksLifeCycle.prepareRequest.launchSubscriber(request);
		this.testingHooksLifeCycle.prepareResponse.launchSubscriber(response);

		return await this.launchDuplose(request, response);
	}

	protected abstract launchDuplose(request: _request, response: _response): Promise<_returnType>;
}

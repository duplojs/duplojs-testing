import {AbstractRoute, DuploConfig, DuploInstance, Process, Request, Route, Response} from "@duplojs/duplojs";
import httpMocks from "node-mocks-http";
import {TestRoute} from "./testRoute";
import {testChecker} from "./testChecker";
import {TestProcess} from "./testProcess";
import {TestAbstractRoute} from "./testAbstractRoute";
import {makeTestingHooksLifeCycle} from "./testDuplose";

type PluginsCollection = [
	(instance: DuploInstance<any>, options: any) => any,
	any
]

export class DuploTesting{
	public testingHooks = {
		process: makeTestingHooksLifeCycle<Process>(),
		route: makeTestingHooksLifeCycle<Route>(),
		abstractRoute: makeTestingHooksLifeCycle<AbstractRoute>(),
	};

	public routes: Route[] = [];
	public pluginsCollection: PluginsCollection[] = [];

	constructor(
		public duploInstance: typeof DuploInstance,
		public config: DuploConfig
	){
		this.duploInstance.prototype.launch = async function(){
			return this.server;
		};
	}

	public testRoute<
		_request extends Request = Request,
		_response extends Response = Response,
	>(route: Route){
		return new TestRoute<_request, _response>(this, route);
	}

	public testProcess<
		_request extends Request = Request,
		_response extends Response = Response,
	>(process: Process){
		return new TestProcess<_request, _response>(this, process);
	}

	public testAbstractRoute<
		_request extends Request = Request,
		_response extends Response = Response,
	>(abstractRoute: AbstractRoute){
		return new TestAbstractRoute<_request, _response>(this, abstractRoute);
	}

	public testChecker = testChecker;

	public createRequest<request extends Request>(): request
	{
		const rawRequest = httpMocks.createRequest();
		const localInstance = new this.duploInstance(this.config);
		return new localInstance.class.Request(rawRequest, {}, "") as request;
	}

	public createResponse<response extends Response>(): response
	{
		const rawResponse = httpMocks.createResponse();
		const localInstance = new this.duploInstance(this.config);
		return new localInstance.class.Response(rawResponse) as response;
	}

	public use<
		duploInputFunction extends((instance: DuploInstance<any>, options: any) => any)
	>(input: duploInputFunction, options?: Parameters<duploInputFunction>[1])
	{
		this.pluginsCollection.push([input, options]);
	}
}

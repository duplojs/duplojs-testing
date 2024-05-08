import {Route, Request, Response} from "@duplojs/duplojs";
import {DuploTesting} from ".";
import {TestDuplose} from "./testDuplose";

export class TestRoute<
	_request extends Request = Request,
	_response extends Response = Response,
> extends TestDuplose<Route, _request, _response, _response>{
	constructor(
		duploTesting: DuploTesting,
		route: Route,
	){
		const duploInstance = new duploTesting.duploInstance(duploTesting.config);
		const duplose = new duploInstance.class.Route(route.method, route.paths, undefined, []);
		super(
			duploTesting, 
			duploInstance,
			duplose,
			route,
		);
		
		duploInstance.routes[route.method].push(duplose);
		duploInstance.class.serverHooksLifeCycle.onDeclareRoute.launchSubscriber(duplose);
	}

	mockAbstractRoute(drop: Record<any, unknown>){
		const abstractRoute = new this.duploInstance.class.AbstractRoute("abstractRoute", undefined, []);
		abstractRoute.duploseFunction = () => drop;
		this.duplose.subAbstractRoute = abstractRoute.createInstance({}, []).subAbstractRoute;
		this.duplose.subAbstractRoute.params.pickup
			= this.duplose.subAbstractRoute.pickup
				= Object.keys(drop) as any;
		return this;
	}

	protected async launchDuplose(request: _request, response: _response){
		try {
			await this.duplose.duploseFunction(request, response);
		} catch {}

		return response;
	}
}

import {Request, Response, AbstractRoute} from "@duplojs/duplojs";
import {DuploTesting} from ".";
import {TestDuplose} from "./testDuplose";

export class TestAbstractRoute<
	_request extends Request = Request,
	_response extends Response = Response,
> extends TestDuplose<AbstractRoute, _request, _response, any>{
	constructor(
		duploTesting: DuploTesting,
		abstractRoute: AbstractRoute,
	){
		const duploInstance = new duploTesting.duploInstance(duploTesting.config);
		const duplose = new duploInstance.class.AbstractRoute(abstractRoute.name, undefined, []);
		super(
			duploTesting, 
			duploInstance,
			duplose,
			abstractRoute,
		);
		
		duplose.options = abstractRoute.options || {};
		duplose.drop = abstractRoute.drop;
		duploInstance.abstractRoutes.push(duplose);
		duploInstance.class.serverHooksLifeCycle.onDeclareAbstractRoute.launchSubscriber(duplose);
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

	setOptions(options: Record<string, unknown>){
		this.duplose.options = {
			...this.duplose.options,
			...options,
		};

		return this;
	}

	protected async launchDuplose(request: _request, response: _response){
		try {
			return await this.duplose.duploseFunction(request, response, this.duplose.options);
		} catch (error){
			return error;
		}
	}
}

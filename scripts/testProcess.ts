import {Request, Response, Process} from "@duplojs/duplojs";
import {DuploTesting} from ".";
import {TestDuplose} from "./testDuplose";

export class TestProcess<
	_request extends Request = Request,
	_response extends Response = Response,
> extends TestDuplose<Process, _request, _response, any>{
	private inputFloorPickup: Record<string, unknown> = {};

	constructor(
		duploTesting: DuploTesting,
		process: Process,
	){
		const duploInstance = new duploTesting.duploInstance(duploTesting.config);
		const duplose = new duploInstance.class.Process(process.name, []);
		super(
			duploTesting, 
			duploInstance,
			duplose,
			process,
		);

		duplose.options = process.options || {};
		duplose.drop = process.drop;
		duplose.input = process.input;
		duploInstance.processes.push(duplose);
		duploInstance.class.serverHooksLifeCycle.onCreateProcess.launchSubscriber(duplose);
	}

	setOptions(options: Record<string, unknown>){
		this.duplose.options = {
			...this.duplose.options,
			...options,
		};

		return this;
	}

	setInputFloorPickup(FloorPickup: Record<string, unknown>){
		this.inputFloorPickup = FloorPickup;

		return this;
	}

	protected async launchDuplose(request: _request, response: _response){
		try {
			return await this.duplose.duploseFunction(request, response, this.duplose.options, this.duplose.input?.((key: string) => this.inputFloorPickup[key]));
		} catch (error){
			return error;
		}
		
	}
}

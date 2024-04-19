import duploWhatWasSent from "@duplojs/what-was-sent";
import {DuploTesting} from "../scripts";
import duploHttpException from "@duplojs/http-exception";
import {DuploInstance} from "@duplojs/duplojs";

export const duploTesting = new DuploTesting(
	DuploInstance,
	{
		port: 1506,
		host: "localhost",
		environment: "TEST",
	}
);

duploTesting.use(duploWhatWasSent, {enabled: true});
duploTesting.use(duploHttpException);

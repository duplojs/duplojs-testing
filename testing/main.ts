import Duplo from "@duplojs/duplojs";
import duploWhatWasSent from "@duplojs/what-was-sent";
import duploHttpException from "@duplojs/http-exception";

export const duplo = Duplo({
	port: 1506,
	host: "localhost",
	environment: "DEV",
});

duplo.use(duploWhatWasSent, {enabled: true});
duplo.use(duploHttpException);

Promise.all([import("./route")]).then(async() => {
	await duplo.launch();
});

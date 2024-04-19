# duplojs-testing
[![NPM version](https://img.shields.io/npm/v/@duplojs/testing)](https://www.npmjs.com/package/@duplojs/testing)

## Instalation
```
npm i @duplojs/testing
```

## Utilisation

Setup file :
```ts
import {DuploInstance} from "@duplojs/duplojs";
import {DuploTesting} from "@duplojs/testing";
import duploWhatWasSent from "@duplojs/what-was-sent";
import duploHttpException from "@duplojs/http-exception";

export const duploTesting = new DuploTesting(
    DuploInstance,
    {
        port: 1506,
        host: "localhost",
        environment: "TEST",
    }
);

//if you use plugins witch edit duplo, you c'ant setup like that.
duploTesting.use(duploWhatWasSent, {enabled: true});
duploTesting.use(duploHttpException);
```

Testing file : 
```ts
describe("route", () => {
    it("test a route", async() => {
        const result = await duploTesting
            .testRoute(mySuperRoute)
            .setDefaultFloorValue({body: "test"})
            .mockChecker(0, {info: "less", data: "test"})
            .launch();    
    
        expect(result.information).toBe("user.login");
    });
});
```
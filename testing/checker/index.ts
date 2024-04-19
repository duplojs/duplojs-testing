import {duplo} from "../main";

export const checker1 = duplo.createChecker("checker1")
.options<{test: string}>({test: "toto"})
.handler((input: number, output, options) => {
	if(input > 0.5){
		return output("more", options.test);
	}
	return output("less", null);
})
.build();

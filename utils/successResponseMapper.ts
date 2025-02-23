import { HttpStatusCode } from "./constants";

export function successResponseMapper(code: HttpStatusCode,response: object) {
	return {
		data: response,
		status: 'success',
		statusCode: code,
	}
}

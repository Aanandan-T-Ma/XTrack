import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProcessHttpMsgService {

	constructor() { }

	public handleError(error: HttpErrorResponse | any) {
		if (error.error instanceof ErrorEvent) {
			console.error('An Error occurred:', error.error.message);
		}
		else {
			console.error(
				`Backend returned code ${error.status}, ` +
				`Error Body: ${error.error}`);
		}
		return throwError('Something bad happened; please try again later.');
	}
}

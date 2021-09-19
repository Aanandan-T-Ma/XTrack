import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseURL';
import { AuthResponse } from '../shared/models';
import { ProcessHttpMsgService } from './process-httpmsg.service';

@Injectable({
	providedIn: 'root'
})
export class PasswordService {

	constructor(private http: HttpClient, private processHttpMessage: ProcessHttpMsgService) { }

	changePassword(oldPassword: string, newPassword: string): Observable<AuthResponse> {
		return this.http.post<any>(`${baseURL}/password/change`, {
			oldPassword: oldPassword,
			newPassword: newPassword
		})
		.pipe(catchError(this.processHttpMessage.handleError));
	}
}

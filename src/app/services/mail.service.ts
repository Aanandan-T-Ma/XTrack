import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseURL';
import { ProcessHttpMsgService } from './process-httpmsg.service';

@Injectable({
	providedIn: 'root'
})
export class MailService {

	constructor(private http: HttpClient, private processHTTPMsgService: ProcessHttpMsgService) { }

	sendMail(subject: string, message: string): Observable<any> {
		return this.http.post<any>(`${baseURL}/mail`, {
			subject: subject,
			message: message
		})
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}
}

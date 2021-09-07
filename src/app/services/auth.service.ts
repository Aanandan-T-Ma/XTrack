import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseURL';
import { ProcessHttpMsgService } from './process-httpmsg.service';

interface AuthResponse {
	success: boolean;
	message: string;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private authToken: string | undefined;
	private tokenKey = 'userToken';

	constructor(private http: HttpClient, private processHTTPMsgService: ProcessHttpMsgService) { }

	login(user: { username: string, password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(baseURL + '/users/login', {
			'userId': user.username,
			'password': user.password
		})
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	register(user: { email: string, username: string, password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(baseURL + '/users/register', {
			'email': user.email,
			'username': user.username,
			'password': user.password
		})
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	logout() {
		this.destroyUserCredentials();
	}

	getToken() {
		return this.authToken || localStorage.getItem(this.tokenKey);
	}

	setUserCredentials(token: string) {
		this.authToken = token;
		localStorage.setItem(this.tokenKey, token);
	}

	destroyUserCredentials() {
		this.authToken = undefined;
		localStorage.removeItem(this.tokenKey);
	}

	activateAccount(url: string): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(baseURL + '/users/otp', { url: url })
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}
}

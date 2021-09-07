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
	private username: string | undefined;
	private usernameKey = 'username';

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

	logout(): void {
		this.destroyUserCredentials();
	}

	activateAccount(url: string): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(baseURL + '/users/otp', { url: url })
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	getUsername(): string | undefined | null {
		return this.username || localStorage.getItem(this.usernameKey);
	}

	getToken(): string | undefined | null {
		return this.authToken || localStorage.getItem(this.tokenKey);
	}

	verifyToken(): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(baseURL + '/users/verifyToken', { token: this.getToken() })
		.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	setUserCredentials(token: string, username: string): void {
		this.authToken = token;
		localStorage.setItem(this.tokenKey, token);
		this.username = username;
		localStorage.setItem(this.usernameKey, username);
	}

	destroyUserCredentials(): void {
		this.authToken = undefined;
		localStorage.removeItem(this.tokenKey);
		this.username = undefined;
		localStorage.removeItem(this.usernameKey);
	}
}

import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { baseURL } from '../shared/baseURL';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let endpoint = request.url.substring(baseURL.length + 1, request.url.indexOf('/', baseURL.length + 1));
		let newRequest = request;
		if(endpoint !== 'users'){
			const token = this.authService.getToken();
			newRequest = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}
		return next.handle(newRequest);
	}
}

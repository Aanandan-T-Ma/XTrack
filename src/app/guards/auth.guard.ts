import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) { }

	canActivate(): Observable<boolean> {
		return this.authService.verifyToken().pipe(
			map(res => {
				if(res.success) 
					return true;
				else {
					this.router.navigate(['/login']);
					return false;
				}
			})
		);
	}
	
}

import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

	isHandset: Observable<boolean> = this.breakpointObserver
										.observe(Breakpoints.Handset)
										.pipe(map(result => result.matches), shareReplay());
	pageTitle: string;
	username: string | undefined | null;

	constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService,
				private dialog: MatDialog) { 
		this.router.events.subscribe(() => {
			let url = this.router.url;
			this.pageTitle = url.substring(url.lastIndexOf('/') + 1);
		})
	}

	ngOnInit(): void {
		this.username = this.authService.getUsername();
	}

	goToUrl(url: string, sidenav: any): void {
		this.router.navigateByUrl(url);
		this.isHandset.subscribe(result => {
			if(result) sidenav.close();
		})
	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

	openPasswordModal(): void {
		const dialogRef = this.dialog.open(PasswordChangeComponent);

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.dialog.open(ConfirmBoxComponent, {
					data: {
						message: 'Password changed successfully',
						type: 'success',
						icon: 'done',
						okBtn: true
					}
				})
			}
		})
	}

}

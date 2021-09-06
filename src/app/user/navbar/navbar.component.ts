import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

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

	constructor(private breakpointObserver: BreakpointObserver, private router: Router) { 
		this.router.events.subscribe(() => {
			let url = this.router.url;
			this.pageTitle = url.substring(url.lastIndexOf('/') + 1);
		})
	}

	ngOnInit(): void {
	}

	goToUrl(url: string, sidenav: any): void {
		this.router.navigateByUrl(url);
		this.isHandset.subscribe(result => {
			if(result) sidenav.close();
		})
	}

}

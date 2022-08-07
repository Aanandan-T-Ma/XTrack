import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	theme: string;
	themeChange: Subject<string> = new Subject<string>();

	constructor() {
		let theme = localStorage.getItem('theme');
		this.theme = theme || 'Light';
		if(!theme) localStorage.setItem('theme', this.theme);
		this.themeChange.subscribe(mode => this.theme = mode);
	}

	changeTheme(mode: string): void {
		this.themeChange.next(mode);
		localStorage.setItem('theme', mode);
	}
}

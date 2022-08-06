import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {

	theme = 'Light';
	themeChange: Subject<string> = new Subject<string>();

	constructor() {
		this.themeChange.subscribe(mode => {
			this.theme = mode;
		});
	}

	changeTheme(mode: string) {
		this.themeChange.next(mode);
	}
}

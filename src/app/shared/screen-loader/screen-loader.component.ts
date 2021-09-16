import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-screen-loader',
	templateUrl: './screen-loader.component.html',
	styleUrls: ['./screen-loader.component.scss']
})
export class ScreenLoaderComponent implements OnInit {

	@Input() loadingText: string = 'Loading';

	constructor() { }

	ngOnInit(): void {
	}

}

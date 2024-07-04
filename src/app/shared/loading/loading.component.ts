import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

	@Input() loadingText: string = 'Loading';
	@Input() boxColor: string = 'white';
	@Input() textColor: string = 'white';
	@Input() bgColor: string = 'rgba(255, 255, 255, 0.7)';

	constructor() { }

	ngOnInit(): void {
	}

}

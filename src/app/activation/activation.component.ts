import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-activation',
	templateUrl: './activation.component.html',
	styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

	loading = true;
	activated = false;
	invalid = false;

	constructor() { }

	ngOnInit(): void {
	}

}

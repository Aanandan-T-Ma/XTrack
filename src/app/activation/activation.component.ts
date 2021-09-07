import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-activation',
	templateUrl: './activation.component.html',
	styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

	loading = true;
	activated = false;
	invalid = false;

	constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.activatedRoute.params.subscribe(params => {
				let url = params['url'];
				this.authService.activateAccount(url).subscribe(res => {
					this.loading = false;
					if(res.success) 
						this.activated = true;
					else
						this.invalid = true;
				});
			})
		}, 4000)
	}

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

	constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			let url = params['url'];
			this.authService.activateAccount(url).subscribe(res => {
				this.loading = false;
				if(res.success) 
					this.activated = true;
				else
					this.invalid = true;
				this.activated = true;
				this.invalid = false;
			});
		})
	}

	gotoLogin(): void {
		this.router.navigate(['/login']);
	}

}

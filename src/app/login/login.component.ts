import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	registerForm: FormGroup;
	showPassword: boolean[] = [false, false, false];

	constructor() { }

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required)
		});

		this.registerForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
			confirmPassword: new FormControl('', [Validators.required])
		});
	}

	login(): void {
		console.log(this.loginForm.value);
	}

	register(): void {
		console.log(this.registerForm.value);
	}

	togglePassword(index: number): void {
		this.showPassword[index] = !this.showPassword[index];
	}

}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfirmBoxComponent } from '../shared/confirm-box/confirm-box.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	registerForm: FormGroup;
	showPassword: boolean[] = [false, false, false];
	loginErrorMsg: string = '';
	registerErrorMsg: string = '';

	constructor(private authService: AuthService, private dialog: MatDialog, private router: Router) { }

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required)
		});

		this.registerForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]{7,}$')]),
			password: new FormControl('', [Validators.required, Validators.pattern('^.{8,}$')]),
			confirmPassword: new FormControl('', [Validators.required])
		});
	}

	login(): void {
		this.authService.login(this.loginForm.value).subscribe(res => {
			if(res.success) {
				this.authService.setUserCredentials(res.token, this.loginForm.value.username);
				this.router.navigate(['/user']);
			}
			else {
				this.loginErrorMsg = res.message;
			}
		});
	}

	register(): void {
		console.log(this.registerForm.value);
		if(this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
			this.registerErrorMsg = 'Passwords do not match';
			return;
		}
		this.authService.register(this.registerForm.value).subscribe(res => {
			if(res.success) {
				const dialogRef = this.dialog.open(ConfirmBoxComponent, {
					data: {
						message: 'Account created successfully!',
						submessage: 'Click the activation link sent to the registered mail id to activate your account',
						type: 'success',
						icon: 'done',
						okBtn: true
					},
					maxWidth: '70%',
				});
				dialogRef.afterClosed().subscribe(res => {
					window.location.reload();
				});
			}
			else {
				this.registerErrorMsg = res.message;
			}
		});
	}

	togglePassword(index: number): void {
		this.showPassword[index] = !this.showPassword[index];
	}

}
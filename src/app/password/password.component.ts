import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../services/password.service';
import { ConfirmBoxComponent } from '../shared/confirm-box/confirm-box.component';

@Component({
	selector: 'app-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

	url: string = '';
	emailForm: FormGroup;
	passwordForm: FormGroup;
	loading: boolean = true;
	invalid: boolean = false;
	error: string = '';
	showPassword: boolean[] = [false, false];

	constructor(private activatedRoute: ActivatedRoute, private passwordService: PasswordService, private dialog: MatDialog,
				private router: Router) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.url = params['url'];
			if(this.url === 'forgot') {
				this.emailForm = new FormGroup({
					email: new FormControl('', [Validators.required, Validators.email])
				});
				this.loading = false;
			}
			else {
				this.passwordService.checkUrl(this.url).subscribe(result => {
					if(result.success) {
						this.passwordForm = new FormGroup({
							password: new FormControl('', [Validators.required]),
							confirmPassword: new FormControl('', [Validators.required])
						});
						this.loading = false;
					}
					else {
						this.loading = false;
						this.invalid = true;
					}
				});
			}
		});
	}

	sendMail(): void {
		this.passwordService.forgotPassword(this.emailForm.value.email).subscribe(result => {
			if(result.success) {
				const dialogRef = this.dialog.open(ConfirmBoxComponent, {
					data: {
						message: 'Reset link sent to the registered mail id',
						submessage: 'Use the link to reset password',
						type: 'success',
						icon: 'done',
						okBtn: true
					}
				});
				dialogRef.afterClosed().subscribe(result => {
					this.router.navigate(['/login']);
				});
			}
			else this.error = result.message;
		});
	}

	resetPassword(): void {
		if(this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
			this.error = 'Passwords do not match';
			return;
		}
		this.passwordService.resetPassword(this.url, this.passwordForm.value.password).subscribe(result => {
			if(result.success) {
				const dialogRef = this.dialog.open(ConfirmBoxComponent, {
					data: {
						message: 'Password changed successfully',
						type: 'success',
						icon: 'done',
						okBtn: true
					}
				});
				dialogRef.afterClosed().subscribe(result => {
					this.router.navigate(['/login']);
				});
			}
			else this.invalid = true;
		});
	}

}

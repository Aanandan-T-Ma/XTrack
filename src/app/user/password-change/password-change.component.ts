import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PasswordService } from 'src/app/services/password.service';

@Component({
	selector: 'app-password-change',
	templateUrl: './password-change.component.html',
	styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

	passwordForm: FormGroup;
	showPassword: boolean[] = Array(3).fill(false);
	error: string = '';

	constructor(private passwordService: PasswordService, private dialogRef: MatDialogRef<PasswordChangeComponent>) { }

	ngOnInit(): void {
		this.passwordForm = new FormGroup({
			oldPassword: new FormControl('', Validators.required),
			newPassword: new FormControl('', Validators.required),
			confirmPassword: new FormControl('', Validators.required)
		});
	}

	togglePassword(index: number): void {
		this.showPassword[index] = !this.showPassword[index];
	}

	changePassword(): void {
		this.error = '';
		if(this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
			this.error = 'New Passwords do not match';
			return;
		}
		if(this.passwordForm.value.newPassword === this.passwordForm.value.oldPassword) {
			this.error = 'Old and New passwords are same';
			return;
		}
		this.passwordService.changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword)
			.subscribe(res => {
				if(res.success)
					this.dialogRef.close(true);
				else
					this.error = res.message;
			});
	}

}

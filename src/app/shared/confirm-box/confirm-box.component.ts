import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'app-confirm-box',
	templateUrl: './confirm-box.component.html',
	styleUrls: ['./confirm-box.component.scss']
})
export class ConfirmBoxComponent implements OnInit {

	theme: string;

	constructor(@Inject(MAT_DIALOG_DATA) public config: any, public dialogRef: MatDialogRef<ConfirmBoxComponent>,
				private themeService: ThemeService) {
		this.theme = this.themeService.theme;
		this.themeService.themeChange.subscribe(theme => this.theme = theme);
	}

	ngOnInit(): void {
	}

	confirm() {
		this.dialogRef.close(true);
	}

}

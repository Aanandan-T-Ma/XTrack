import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-box',
	templateUrl: './confirm-box.component.html',
	styleUrls: ['./confirm-box.component.scss']
})
export class ConfirmBoxComponent implements OnInit {

	constructor(@Inject(MAT_DIALOG_DATA) public config: any, public dialogRef: MatDialogRef<ConfirmBoxComponent>) { }

	ngOnInit(): void {
	}

	confirm() {
		this.dialogRef.close(true);
	}

}

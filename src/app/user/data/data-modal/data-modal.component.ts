import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-data-modal',
	templateUrl: './data-modal.component.html',
	styleUrls: ['./data-modal.component.scss']
})
export class DataModalComponent implements OnInit {

	dataForm: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DataModalComponent>) { }

	ngOnInit(): void {
		console.log(this.data);
		this.dataForm = new FormGroup({
			name: new FormControl(this.data.newData ? '' : this.data.data.name, Validators.required),
			amount: new FormControl(this.data.newData ? '' : this.data.data.amount, Validators.required),
			category: new FormControl(this.data.newData ? '' : this.data.data.category, Validators.required),
			date: new FormControl(this.data.newData ? '' : new Date(this.data.data.year, this.data.data.month, this.data.data.date), 
									Validators.required)
		});
	}

	saveData(): void {
		this.dialogRef.close(this.dataForm.value);
	}

}

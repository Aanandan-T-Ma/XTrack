import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-data-modal',
	templateUrl: './data-modal.component.html',
	styleUrls: ['./data-modal.component.scss']
})
export class DataModalComponent implements OnInit {

	dataForm: FormGroup;
	today: Date = new Date();
	filteredOptions: Observable<string[]>;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DataModalComponent>) { }

	ngOnInit(): void {
		console.log(this.data);
		let isAddModal = (this.data.type == 'Add');
		this.dataForm = new FormGroup({
			name: new FormControl(isAddModal ? '' : this.data.data.name, Validators.required),
			amount: new FormControl(isAddModal ? '' : this.data.data.amount, Validators.required),
			category: new FormControl(isAddModal ? '' : this.data.data.category, Validators.required),
			date: new FormControl(isAddModal ? '' : new Date(this.data.data.year, this.data.data.month, this.data.data.date), 
									Validators.required)
		});
		this.filteredOptions = this.dataForm['controls']['category'].valueChanges.pipe(
			startWith(''),
			map(value => {
				value = value.toLowerCase();
				return this.data.categories.filter((option: string) => option.toLowerCase().includes(value));
			})
		);
	}

	saveData(): void {
		this.dialogRef.close(this.dataForm.value);
	}

}

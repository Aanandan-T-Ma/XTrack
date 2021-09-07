import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
	selector: 'app-expenditure',
	templateUrl: './expenditure.component.html',
	styleUrls: ['./expenditure.component.scss']
})
export class ExpenditureComponent implements OnInit {

	allExpenses: any[];
	displayedColumns = ['S.No', 'Spent On', 'Amount', 'Category', 'Date', 'Day', 'controls'];

	constructor(private dataService: DataService) { }

	ngOnInit(): void {
		this.dataService.getData('expense').subscribe(data => {
			this.allExpenses = data;
		})
	}

}

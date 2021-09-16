import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Data } from 'src/app/shared/models';

@Component({
	selector: 'app-expenditure',
	templateUrl: './expenditure.component.html',
	styleUrls: ['./expenditure.component.scss']
})
export class ExpenditureComponent implements OnInit {

	allExpenses: Data[];
	displayedColumns = ['S.No', 'Spent On', 'Amount', 'Category', 'Date', 'Day', 'controls'];
	type: string = 'expense';
	loading: boolean = true;

	constructor(private dataService: DataService) { }

	ngOnInit(): void {
		this.dataService.getData(this.type).subscribe(data => {
			this.allExpenses = data;
			this.allExpenses.sort((a, b) => {
				let da = new Date(a.year, a.month, a.date);
				let db = new Date(b.year, b.month, b.date);
				return db.getTime() - da.getTime();
			});
			this.loading = false;
		})
	}

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Data } from 'src/app/shared/models';

@Component({
	selector: 'app-income',
	templateUrl: './income.component.html',
	styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

	allIncomes: Data[];
	displayedColumns = ['selected', 'S.No', 'Source', 'Amount', 'Category', 'Date', 'Day', 'controls'];
	type: string = 'income';
	loading: boolean = true;

	constructor(private dataService: DataService) { }

	ngOnInit(): void { 
		this.dataService.getData(this.type).subscribe(data => {
			this.allIncomes = data;
			this.allIncomes.sort((a, b) => {
				let da = new Date(a.year, a.month, a.date);
				let db = new Date(b.year, b.month, b.date);
				return db.getTime() - da.getTime();
			});
			this.loading = false;
		})
	}

	toggleLoader(val: boolean): void {
		this.loading = val;
	}

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
	selector: 'app-income',
	templateUrl: './income.component.html',
	styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

	allIncomes: any[];
	displayedColumns = ['S.No', 'Source', 'Amount', 'Category', 'Date', 'Day', 'controls'];

	constructor(private dataService: DataService) { }

	ngOnInit(): void { 
		this.allIncomes = this.dataService.getData('income');
	}

}

import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'app-income',
	templateUrl: './income.component.html',
	styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

	allIncomes = [
		{
			date: 1,
			month: 0,
			year: 2020,
			category: 'Grocery',
			name: 'Vegetables',
			amount: 150
		},
		{
			date: 10,
			month: 3,
			year: 2021,
			category: 'Stationary',
			name: 'Bag',
			amount: 500
		},
		{
			date: 21,
			month: 2,
			year: 2021,
			category: 'Stationary',
			name: 'Books',
			amount: 650
		},
		{
			date: 23,
			month: 3,
			year: 2021,
			category: 'Rent',
			name: 'Rent',
			amount: 150
		}
	];
	displayedColumns = ['S.No', 'Source', 'Amount', 'Category', 'Date', 'controls'];

	constructor() { }

	ngOnInit(): void { }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.scss']
})
export class ExpenditureComponent implements OnInit {

	allExpenses = [
		{
			date: 14,
			month: 4,
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
			date: 28,
			month: 2,
			year: 2020,
			category: 'Stationary',
			name: 'Books',
			amount: 650
		},
		{
			date: 23,
			month: 3,
			year: 2019,
			category: 'Rent',
			name: 'Rent',
			amount: 1000
		}
	];
	displayedColumns = ['S.No', 'Spent On', 'Amount', 'Category', 'Date', 'controls'];

  constructor() { }

  ngOnInit(): void {
  }

}

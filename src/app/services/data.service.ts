import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor() { }

	incomes = [
		{
			date: 1,
			month: 0,
			year: 2020,
			day: new Date(2020, 0, 1).getDay(),
			category: 'Grocery',
			name: 'Vegetables',
			amount: 150,
			type: 'income'
		},
		{
			date: 10,
			month: 3,
			year: 2021,
			day: new Date(2021, 3, 10).getDay(),
			category: 'Stationary',
			name: 'Bag',
			amount: 500,
			type: 'income'
		},
		{
			date: 21,
			month: 2,
			year: 2019,
			day: new Date(2019, 2, 21).getDay(),
			category: 'Stationary',
			name: 'Books',
			amount: 650,
			type: 'income'
		},
		{
			date: 23,
			month: 3,
			year: 2021,
			day: new Date(2021, 3, 23).getDay(),
			category: 'Rent',
			name: 'Rent',
			amount: 150,
			type: 'income'
		}
	];
	expenses = [
		{
			date: 14,
			month: 4,
			year: 2020,
			day: new Date(2020, 4, 14).getDay(),
			category: 'Grocery',
			name: 'Vegetables',
			amount: 150,
			type: 'expense'
		},
		{
			date: 10,
			month: 3,
			year: 2021,
			day: new Date(2021, 3, 10).getDay(),
			category: 'Stationary',
			name: 'Bag',
			amount: 500,
			type: 'expense'
		},
		{
			date: 28,
			month: 2,
			year: 2020,
			day: new Date(2020, 2, 28).getDay(),
			category: 'Stationary',
			name: 'Books',
			amount: 650,
			type: 'expense'
		},
		{
			date: 23,
			month: 3,
			year: 2019,
			day: new Date(2019, 3, 23).getDay(),
			category: 'Rent',
			name: 'Rent',
			amount: 1000,
			type: 'expense'
		}
	];

	getData(type: string): any[] {
		if (type == 'expense') {
			return this.expenses;
		}
		else if (type == 'income') {
			return this.incomes;
		}
		return [];
	}
	
}

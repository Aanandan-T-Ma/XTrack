import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'app-data',
	templateUrl: './data.component.html',
	styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

	periods = [
		{ label: 'All', value: 0 },
		{ label: 'This Week', value: 1 },
		{ label: 'This Month', value: 2 },
		{ label: 'This Year', value: 3 },
		{ label: 'Range', value: 4 },
		{ label: 'Custom', value: 5 }
	];
	selectedPeriod = this.periods[0];
	dates = Array(31).fill(0).map((x, i) => i + 1);
	months = Array(12).fill(0).map((x, i) => i);
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	categories: string[] = ['Any', 'Grocery', 'Stationary', 'Electronics', 'Rent'];
	dataSource: MatTableDataSource<any>;
	pageSizes = [10, 15, 20, 30];
	pageIndex = 0;
	pageSize = this.pageSizes[0];
	displayedData: any[];
	filteredData: any[];
	periodData: any[];
	showFilters: boolean = false;

	@ViewChild('paginator') paginator: MatPaginator;
	@Input() allData: any[];
	@Input() title: string;
	@Input() displayedColumns: string[];

	filterForm: FormGroup;
	filtersApplied: boolean = false;
	sorted: any[] = ['0', 0];

	constructor() { }

	ngOnInit(): void {
		let da = new Date(2021, 7, 3);
		let d = da.getDate();
		let m = da.getMonth();
		let y = da.getFullYear();
		for(let i = 0; i < 30; i ++) {
			let x = {...this.allData[0]};
			x.name = 'Item ' + i;
			x.date = d;
			x.month = m;
			x.year = y;
			if(d < 30) d++;
			else if(m < 11) d = 1, m++;
			else d = 1, m = 0, y++;
			this.allData.push(x);
		}
		this.filterForm = new FormGroup({
			date: new FormControl(''),
			month: new FormControl(''),
			year: new FormControl('', Validators.pattern('[0-9]{4}')),
			category: new FormControl(''),
			name: new FormControl(''),
			minAmount: new FormControl('', Validators.min(0)),
			maxAmount: new FormControl('', Validators.min(0)),
		});
		this.changePeriod(0);
		this.dataSource.paginator = this.paginator;
	}

	changePeriod(value: number): void {
		this.selectedPeriod = this.periods[value];
		if(value === 0) {
			this.periodData = this.allData;
		}
		else if(value === 1) {
			let today = new Date();
			let sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d >= sunday && d <= today);
			})
		}
		else if(value === 2) {
			let today = new Date();
			let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d >= firstDay && d <= today);
			})
		}
		else if(value === 3) {
			let today = new Date();
			let firstDay = new Date(today.getFullYear(), 0, 1);
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d >= firstDay && d <= today);
			})
		}
		this.applyFilters();
	}

	generateDataSource(): void {
		this.dataSource = new MatTableDataSource(this.displayedData);
	}

	changePage(event: any): void {
		this.displayedData = this.filteredData.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
		this.generateDataSource();
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
	}

	applyFilters(): void {
		/* if(this.filterForm.get('minAmount')?.value && this.filterForm.get('minAmount')?.value > this.filterForm.get('maxAmount')?.value) {
			this.filterForm.get('maxAmount')?.setErrors({'very_less': true});
			return;
		} */
		this.filteredData = this.periodData.filter(data => {
			if(this.filterForm.get('date')?.value && data.date != this.filterForm.get('date')?.value) 
				return false;
			if(this.filterForm.get('month')?.value != '' && data.month != this.filterForm.get('month')?.value) 
				return false;
			if(this.filterForm.get('year')?.value && data.year != this.filterForm.get('year')?.value) 
				return false;
			if(this.filterForm.get('category')?.value && this.filterForm.get('category')?.value != 'Any' &&
				data.category.toLowerCase() != this.filterForm.get('category')?.value.toLowerCase()) 
				return false;
			if(this.filterForm.get('name')?.value && !data.name.toLowerCase().includes(this.filterForm.get('name')?.value.toLowerCase())) 
				return false;
			if(this.filterForm.get('minAmount')?.value && data.amount < this.filterForm.get('minAmount')?.value) 
				return false;
			if(this.filterForm.get('maxAmount')?.value && data.amount > this.filterForm.get('maxAmount')?.value) 
				return false;
			return true;
		});
		this.pageIndex = 0;
		this.displayedData = this.filteredData.slice(0, this.pageSize);
		this.generateDataSource();
	}

	clearFilters(): void {
		this.filterForm.reset();
		this.filtersApplied = false;
		this.periodData = this.allData;
		this.applyFilters();
	}

	sortData(s: string): void {
		if(this.sorted[0] === s) {
			if(s === 'date' || this.sorted[1] === 2) {
				this.filteredData.sort((a, b) => {
					let da = new Date(a.year, a.month, a.date);
					let db = new Date(b.year, b.month, b.date);
					if(this.sorted[1] === 1) {
						if(da < db) return 1;
						if(da > db) return -1;
					}
					if(da > db) return 1;
					if(da < db) return -1;
					return 0;
				});
			}
			else {
				this.filteredData.sort((a, b) => {
					if(this.sorted[1] === 1) {
						if(a[s] < b[s]) return 1;
						if(a[s] > b[s]) return -1;
					}
					if(a[s] > b[s]) return 1;
					if(a[s] < b[s]) return -1;
					return 0;
				});
			}
			this.sorted[1] = (this.sorted[1] + 1) % 3;
		}
		else {
			if(s === 'date') {
				this.filteredData.sort((a, b) => {
					let da = new Date(a.year, a.month, a.date);
					let db = new Date(b.year, b.month, b.date);
					if(da > db) return 1;
					if(da < db) return -1;
					return 0;
				});
			}
			else {
				this.filteredData.sort((a, b) => {
					if(a[s] > b[s]) return 1;
					if(a[s] < b[s]) return -1;
					return 0;
				});
			}
			this.sorted[0] = s;
			this.sorted[1] = 1;
		}
		this.displayedData = this.filteredData.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
		this.generateDataSource();
	}

	edit(index: number): void {
		console.log(index);
	}

	delete(index: number): void {
		console.log(index);
	}
}

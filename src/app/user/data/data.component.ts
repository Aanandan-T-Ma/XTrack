import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';
import { Data } from 'src/app/shared/models';
import { DataModalComponent } from './data-modal/data-modal.component';

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
	days = Array(7).fill(0).map((x, i) => i);
	dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	categories: string[] = ['Any', 'Grocery', 'Stationary', 'Electronics', 'Rent'];
	dataSource: MatTableDataSource<any>;
	pageSizes = [10, 15, 20, 30];
	pageIndex = 0;
	pageSize = this.pageSizes[0];
	displayedData: Data[];
	filteredData: Data[];
	periodData: Data[];
	showFilters: boolean = false;

	@ViewChild('paginator') paginator: MatPaginator;
	@Input() allData: Data[];
	@Input() title: string;
	@Input() displayedColumns: string[];
	@Input() type: string;

	filterForm: FormGroup;
	sorted: any[] = ['0', 0];
	rangeDates: any[] = [null, null];
	customDates: Date[] = [];
	today: Date = new Date();

	constructor(private dialog: MatDialog, private dataService: DataService) { }

	ngOnInit(): void {
		this.filterForm = new FormGroup({
			date: new FormControl(''),
			month: new FormControl(''),
			year: new FormControl('', Validators.pattern('[0-9]{4}')),
			day: new FormControl(''),
			category: new FormControl('Any'),
			name: new FormControl(''),
			minAmount: new FormControl('', Validators.min(0)),
			maxAmount: new FormControl('', Validators.min(0)),
		});
		this.changePeriod(0);
		this.dataSource.paginator = this.paginator;
	}

	generateDataSource(): void {
		this.dataSource = new MatTableDataSource(this.displayedData);
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
		else if(value === 5) {
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				for(let i = 0; i < this.customDates.length; i++) {
					if(d.getTime() === this.customDates[i].getTime())
						return true;
				}
				return false;
			});
		}
		this.applyFilters();
	}

	rangeSelected(start: boolean, event: any): void {
		if(start)
			this.rangeDates[0] = event.value;
		else
			this.rangeDates[1] = event.value;
		if(this.rangeDates[0] && this.rangeDates[1]) {
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d >= this.rangeDates[0] && d <= this.rangeDates[1]);
			})
		}
		else if(this.rangeDates[0]) {
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d >= this.rangeDates[0]);
			})
		}
		else if(this.rangeDates[1]) {
			this.periodData = this.allData.filter(data => {
				let d = new Date(data.year, data.month, data.date);
				return (d <= this.rangeDates[1]);
			})
		}
		this.applyFilters();
	}

	addCustomDate(date: Date): void {
		this.customDates.push(date);
		console.log(this.customDates);
		this.changePeriod(5);
	}

	removeCustomDate(date: Date): void {
		console.log(date);
		for(let i = 0; i < this.customDates.length; i++) {
			if(date.getTime() === this.customDates[i].getTime()) {
				this.customDates.splice(i, 1);
				break;
			}
		}
		this.changePeriod(5);
	}

	changePage(event: any): void {
		this.displayedData = this.filteredData.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
		this.generateDataSource();
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
	}

	applyFilters(): void {
		/* if(this.filterForm.value.minAmount !== '' && this.filterForm.value.maxAmount !== '' && 
				this.filterForm.value.minAmount > this.filterForm.value.maxAmount) {
			this.amountLessThanMin = true;
			return;
		} */
		this.filteredData = this.periodData.filter(data => {
			if(this.filterForm.value.date !== '' && data.date != this.filterForm.value.date) 
				return false;
			if(this.filterForm.value.month !== '' && data.month != this.filterForm.value.month) 
				return false;
			if(this.filterForm.value.year !== '' && data.year != this.filterForm.value.year)
				return false;
			if(this.filterForm.value.day !== '' && data.day != this.filterForm.value.day)
				return false;
			if(this.filterForm.value.category != 'Any' && data.category.toLowerCase() != this.filterForm.value.category.toLowerCase()) 
				return false;
			if(this.filterForm.value.name !== '' && !data.name.toLowerCase().includes(this.filterForm.value.name.toLowerCase())) 
				return false;
			if(this.filterForm.value.minAmount !== '' && data.amount < this.filterForm.value.minAmount) 
				return false;
			if(this.filterForm.value.maxAmount !== '' && data.amount > this.filterForm.value.maxAmount) 
				return false;
			return true;
		});
		this.pageIndex = 0;
		this.displayedData = this.filteredData.slice(0, this.pageSize);
		this.generateDataSource();
	}

	clearFilters(): void {
		this.filterForm.setValue({
			date: '',
			month: '',
			year: '',
			day: '',
			category: 'Any',
			name: '',
			minAmount: '',
			maxAmount: '',
		});
		this.applyFilters();
	}

	sortData(s: string): void {
		if(this.sorted[0] === s) {
			this.filteredData.sort((a: any, b: any) => {
				let da, db;
				if(s === 'date' || this.sorted[1] === 2) {
					da = new Date(a.year, a.month, a.date);
					db = new Date(b.year, b.month, b.date);
				}
				else if(s === 'day') {
					da = new Date(a.year, a.month, a.date).getDay();
					db = new Date(b.year, b.month, b.date).getDay();
				}
				else {
					da = a[s];
					db = b[s];
				}
				if(this.sorted[1] === 0) {
					if(da > db) return 1;
					if(da < db) return -1;
				}
				else {
					if(da < db) return 1;
					if(da > db) return -1;
				}
				return 0;
			});
			this.sorted[1] = (this.sorted[1] + 1) % 3;
		}
		else {
			this.filteredData.sort((a: any, b: any) => {
				let da, db;
				if(s === 'date') {
					da = new Date(a.year, a.month, a.date);
					db = new Date(b.year, b.month, b.date);
				}
				else if(s === 'day') {
					da = new Date(a.year, a.month, a.date).getDay();
					db = new Date(b.year, b.month, b.date).getDay();
				}
				else {
					da = a[s];
					db = b[s];
				}
				if(da > db) return 1;
				if(da < db) return -1;
				return 0;
			})
			this.sorted[0] = s;
			this.sorted[1] = 1;
		}
		this.displayedData = this.filteredData.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
		this.generateDataSource();
	}

	openAddModal(): void {
		const dialogRef = this.dialog.open(DataModalComponent, {
			data: {
				newData: true,
				title: this.title
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				let data = {
					name: result.name,
					amount: result.amount,
					category: result.category,
					date: result.date.getDate(),
					month: result.date.getMonth(),
					year: result.date.getFullYear(),
					type: this.type
				}
				this.dataService.addData(data).subscribe(res => {
					console.log(res);
					this.allData.push(res);
					this.allData.sort((a, b) => {
						let da = new Date(a.year, a.month, a.date);
						let db = new Date(b.year, b.month, b.date);
						return db.getTime() - da.getTime();
					});
					this.changePeriod(this.selectedPeriod.value);
				})
			}
		})
	}

	openEditModal(index: number): void {
		const dialogRef = this.dialog.open(DataModalComponent, {
			data: {
				newData: false,
				title: this.title,
				data: this.displayedData[index]
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				let data = {
					name: result.name,
					amount: result.amount,
					category: result.category,
					date: result.date.getDate(),
					month: result.date.getMonth(),
					year: result.date.getFullYear(),
				}
				this.dataService.editData(data, this.displayedData[index]._id).subscribe(res => {
					console.log(res);
					for(let i = 0; i < this.allData.length; i++) {
						if(this.allData[i]._id === this.displayedData[index]._id) {
							this.allData[i] = res;
							break;
						}
					}
					this.changePeriod(this.selectedPeriod.value);
				});
			}
		})
	}

	openDeleteModal(index: number): void {
		const dialogRef = this.dialog.open(ConfirmBoxComponent, {
			data: {
				message: `Delete ${this.title}`,
				submessage: `Are you sure you want to delete this?`,
				type: 'info',
				icon: 'error',
				confirmBtn: true,
				cancelBtn: true
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.dataService.deleteData(this.displayedData[index]._id).subscribe(res => {
					console.log(res);
					for(let i = 0; i < this.allData.length; i++) {
						if(this.allData[i]._id === this.displayedData[index]._id) {
							index = i;
							break;
						}
					}
					this.allData.splice(index, 1);
					this.changePeriod(this.selectedPeriod.value);
				})
			}
 		})
	}
}
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'app-data',
	templateUrl: './data.component.html',
	styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

	periods = [
		{ label: 'This Week', value: 0 },
		{ label: 'This Month', value: 1 },
		{ label: 'This Year', value: 2 },
		{ label: 'Range', value: 3 },
		{ label: 'Custom', value: 4 }
	];
	selectedPeriod = this.periods[0];
	dates = Array(31).fill(0).map((x, i) => i + 1);
	months = Array(12).fill(0).map((x, i) => i);
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	filters: any = {
		show: false,
		date: -1,
		month: -1,
		year: -1,
		category: 'Any'
	};
	categories: string[] = ['Any', 'Grocery', 'Stationary', 'Electronics', 'Rent'];
	dataSource: MatTableDataSource<any>;
	pageSizes = [10, 15, 20, 30];
	displayedData: any[];
	filteredData: any[];

	@ViewChild('paginator') paginator: MatPaginator;
	@Input() allData: any[];
	@Input() title: string;
	@Input() displayedColumns: string[];

	constructor() { }

	ngOnInit(): void {
		for(let i = 0; i < 20; i ++){
			let x = {...this.allData[0]};
			x.name = 'Name ' + i;
			this.allData.push(x);
		}
		this.filteredData = this.allData;
		this.displayedData = this.allData.slice(0, this.pageSizes[0]);
		this.generateDataSource();
		this.dataSource.paginator = this.paginator;
	}

	changePeriod(value: number) {
		this.selectedPeriod = this.periods[value];
	}

	changeFilter(f: string, value: number) {
		this.filters[f] = value;
	}

	generateDataSource(): void {
		this.dataSource = new MatTableDataSource(this.displayedData);
	}

	changePage(event: any): void {
		this.displayedData = this.filteredData.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
		this.generateDataSource();
	}

	edit(index: number): void {
		console.log(index);
	}

	delete(index: number): void {
		console.log(index);
	}
}

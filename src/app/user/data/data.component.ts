import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Clipboard } from '@angular/cdk/clipboard';
import readXlsxFile from 'read-excel-file';
import writeXlsxFile from 'write-excel-file';

import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';
import { Data } from 'src/app/shared/models';
import { dayNames, logoImageUrl, monthNames } from 'src/app/shared/names';
import { DataModalComponent } from './data-modal/data-modal.component';

import { DataService } from 'src/app/services/data.service';
import { MailService } from 'src/app/services/mail.service';
import { ThemeService } from 'src/app/services/theme.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
	days = Array(7).fill(0).map((x, i) => i);
	monthNames = monthNames;
	dayNames = dayNames;
	categories: string[];
	dataSource: MatTableDataSource<any>;
	pageSizes = [10, 15, 20, 30];
	pageIndex = 0;
	pageSize = this.pageSizes[0];
	displayedData: Data[];
	filteredData: Data[];
	periodData: Data[];
	showFilters: boolean = false;
	copied: boolean = false;
	theme: string;

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
	selected: boolean[];
	selectedCount: Number;

	@ViewChild('excelUpload') excelInput: ElementRef;
	@Output() onLoad = new EventEmitter<boolean>();

	constructor(private dialog: MatDialog, private dataService: DataService, private mailService: MailService,
				private clipboard: Clipboard, private themeService: ThemeService) {
		this.theme = this.themeService.theme;
		this.themeService.themeChange.subscribe(theme => this.theme = theme);
	}

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
		this.setCategories();
	}

	setCategories(): void {
		let categorySet: Set<string> = new Set();
		this.allData.forEach(data => {
			categorySet.add(data.category);
		});
		this.categories = Array.from(categorySet);
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
		else if(value === 4) {
			this.periodData = this.allData;
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

	rangeSelected(start: boolean, value: any): void {
		if(start) 
			this.rangeDates[0] = value;
		else 
			this.rangeDates[1] = value;
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
		let datePresent = false;
		for(let i = 0; i < this.customDates.length && !datePresent; i++)
			if(date.getTime() === this.customDates[i].getTime())
				datePresent = true;
		if(!datePresent)
			this.customDates.push(date);
		this.changePeriod(5);
	}

	removeCustomDate(date: Date): void {
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
		this.selected = Array(this.filteredData.length).fill(true);
		this.selectedCount = this.filteredData.length;
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

	openAddModal(index: number = -1): void {
		let isAddModal = (index == -1);
		const dialogRef = this.dialog.open(DataModalComponent, {
			data: {
				type: isAddModal ? 'Add' : 'Copy',
				title: this.title,
				data: isAddModal ? null : this.displayedData[index],
				categories: this.categories
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
					this.allData.push(res);
					this.allData.sort((a, b) => {
						let da = new Date(a.year, a.month, a.date);
						let db = new Date(b.year, b.month, b.date);
						return db.getTime() - da.getTime();
					});
					this.changePeriod(this.selectedPeriod.value);
					if(!this.categories.includes(result.category))
						this.categories.push(result.category);
				});
			}
		})
	}

	openEditModal(index: number): void {
		const dialogRef = this.dialog.open(DataModalComponent, {
			data: {
				type: 'Edit',
				title: this.title,
				data: this.displayedData[index],
				categories: this.categories
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
					day: result.date.getDay(),
				}
				this.dataService.editData(data, this.displayedData[index]._id).subscribe(res => {
					for(let i = 0; i < this.allData.length; i++) {
						if(this.allData[i]._id === this.displayedData[index]._id) {
							this.allData[i] = res;
							break;
						}
					}
					this.changePeriod(this.selectedPeriod.value);
					if(!this.categories.includes(result.category))
						this.categories.push(result.category);
				});
			}
		})
	}

	openDeleteModal(index: number): void {
		const dialogRef = this.dialog.open(ConfirmBoxComponent, {
			data: {
				message: `Delete ${this.title}`,
				submessage: `Are you sure you want to delete this?`,
				type: 'confirm',
				icon: 'error',
				confirmBtn: true,
				cancelBtn: true
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.dataService.deleteData(this.displayedData[index]._id).subscribe(res => {
					index = this.allData.findIndex(d => d._id === this.displayedData[index]._id);
					if (index > -1) this.allData.splice(index, 1);
					this.changePeriod(this.selectedPeriod.value);
				});
			}
 		});
	}

	showWarning(): void {
		this.dialog.open(ConfirmBoxComponent, {
			data: {
				message: `No data selected`,
				type: 'confirm',
				icon: 'error',
				okBtn: true
			}
		})
	}

	generatePdf(): void {
		let selectedData = this.filteredData.filter((data, i) => this.selected[i]);
		if(selectedData.length === 0) {
			this.showWarning();
			return;
		}
        const htmlToPdfmake = require('html-to-pdfmake');
        const content = this.getPdfContent(selectedData);
        const val: any = htmlToPdfmake(content, {
            tableAutoSize: true,
        });

        let dd: any = {
            content: val,
            footer: (currentPage: any, pageCount: any) => {
                return [
                    {
                        text: currentPage.toString() + ' of ' + pageCount,
                        style: 'footer',
                    },
                ];
            },
            header: (currentPage: any, pageCount: any, pageSize: any) => {
                return [
                    {
                        text: '',
                        alignment: 'left',
                        style: 'header'
                    },
                    {
                        canvas: [
                            {
                                type: 'rect',
                                x: 170,
                                y: 32,
                                w: pageSize.width - 170,
                                h: 40,
                            },
                        ],
                    }
                ];
            },
            styles: {
                header: {
                    margin: [8, 10, 10, 8],
                    italics: true,
                },
                footer: {
                    alignment: 'center',
                    margin: [0, 5, 0, 0],
                },
            },
        };

        pdfMake.createPdf(dd).open();
    }

	getPdfContent(data: Data[]): string {
		let content = ``;
		content += `<div style="text-align: center;">
						<img src="${logoImageUrl}" />
					</div>`;
		content += `<div style="text-align: center; font-weight: bold; margin: 15px; font-size: 20px;">
						Your ${this.title}s ${this.getPeriodString()}
					</div>`;
		content += `<table> <tr>`;
		for(let i = 1; i < 6; i++)
			content += `<th style="text-align: center;">${this.displayedColumns[i]}</th>`;
		content += `<th style="text-align: center;">Day</th>`;
		content += `</tr>`;
		// Total width: 610
		for(let i = 0; i < data.length; i++) {
			content += `<tr>
							<td width="35" style="text-align: center;">${i + 1}</td>
							<td width="140">${data[i].name}</td>
							<td width="70">${data[i].amount}</td>
							<td width="120">${data[i].category}</td>
							<td width="160">${data[i].date} - ${monthNames[data[i].month]} - ${data[i].year}</td>
							<td width="85">${dayNames[data[i].day]}</td>
						</tr>`
		}
		content += `</table>`;
		return content;
	}

	getPeriodString(): string {
		let period;
		switch(this.selectedPeriod.value) {
			case 1:
				let sunday = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay());
				period = `from ${sunday.getDate()}-${monthNames[sunday.getMonth()]}-${sunday.getFullYear()} to 
							${this.today.getDate()}-${monthNames[this.today.getMonth()]}-${this.today.getFullYear()}`;
				break;
			case 2:
				period = `from 1-${monthNames[this.today.getMonth()]}-${this.today.getFullYear()} to 
							${this.today.getDate()}-${monthNames[this.today.getMonth()]}-${this.today.getFullYear()}`;
				break;
			case 3:
				period = `from 1-January-${this.today.getFullYear()} to 
							${this.today.getDate()}-${monthNames[this.today.getMonth()]}-${this.today.getFullYear()}`;
				break;
			case 4:
				if(this.rangeDates[0] && this.rangeDates[1])
					period = `from ${this.rangeDates[0].getDate()}-${monthNames[this.rangeDates[0].getMonth()]}-
								${this.rangeDates[0].getFullYear()} to ${this.rangeDates[1].getDate()}-
								${monthNames[this.rangeDates[1].getMonth()]}-${this.rangeDates[1].getFullYear()}`;
				else if(this.rangeDates[0])
					period = `from ${this.rangeDates[0].getDate()}-${monthNames[this.rangeDates[0].getMonth()]}-
								${this.rangeDates[0].getFullYear()} to ${this.today.getDate()}-
								${monthNames[this.today.getMonth()]}-${this.today.getFullYear()}`;
				else if(this.rangeDates[1])
					period = `till ${this.rangeDates[1].getDate()}-${monthNames[this.rangeDates[1].getMonth()]}-
								${this.rangeDates[1].getFullYear()}`;
				else period = '';
				break;
			case 5:
				period = 'on ';
				this.customDates.forEach((date, i) => {
					period += `${date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()}`;
					if(i != this.customDates.length - 1) period += ', ';
				});
				break;
			default: period = '';
		}
		return period;
	}

	getMailContent(data: Data[]): string {
		let content = `<!DOCTYPE html>
						<html>
							<head>
								<style>
									table, th, td {
										border: 2px solid black;
										border-collapse: collapse;
										padding: 5px;
								  	}
								</style>
							</head>
							<body>`;
		content += `<div style="text-align: center; font-weight: bold; margin: 15px; font-size: 20px;">
						Your ${this.title}s ${this.getPeriodString()}
					</div>`;
		content += `<table width="100%"> <tr style="background-color: #4588f5;">`;
		for(let i = 1; i < 6; i++)
			content += `<th style="text-align: center;">${this.displayedColumns[i]}</th>`;
		content += `<th style="text-align: center;">Day</th>`;
		content += `</tr>`;
		// Total width: 610
		for(let i = 0; i < data.length; i++) {
			content += `<tr>
							<td width="5%" style="text-align: center;">${i + 1}</td>
							<td width="23%">${data[i].name}</td>
							<td width="12%">${data[i].amount}</td>
							<td width="20%">${data[i].category}</td>
							<td width="26%">${data[i].date} - ${monthNames[data[i].month]} - ${data[i].year}</td>
							<td width="14%">${dayNames[data[i].day]}</td>
						</tr>`
		}
		content += `</table></body></html>`;
		return content;
	}

	sendMail(): void {
		let selectedData = this.filteredData.filter((data, i) => this.selected[i]);
		if(selectedData.length === 0) {
			this.showWarning();
			return;
		}
		this.mailService.sendMail(`Your ${this.title}s`, this.getMailContent(selectedData)).subscribe(res => {
			this.dialog.open(ConfirmBoxComponent, {
				data: {
					message: 'Data sent to the registered mail id',
					submessage: 'Please check the spam folder if it\'s not in inbox',
					type: 'success',
					icon: 'done',
					okBtn: true
				}
			})
		})
	}

	copyDataToClipboard(): void {
		let selectedData = this.filteredData.filter((data, i) => this.selected[i]);
		if(selectedData.length === 0) {
			this.showWarning();
			return;
		}
		this.copied = true;
		setTimeout(() => this.copied = false, 2000);
		let content = selectedData.reduce((val, data) => {
			return `${val}${data.name} - ₹${data.amount}, ${data.date}/${data.month + 1}/${data.year}\n`;
		}, '');
		this.clipboard.copy(content);
	}

	updateCheck(checked: boolean, index: number) {
		if(index >= 0) this.selected[index] = checked;
		else this.selected = this.selected.fill(checked);

		this.selectedCount = this.selected.filter(check => check).length;
	}
	
	allSelected(): boolean {
		return this.selected.length > 0 && this.selected.every(x => x);
	}

	someSelected(): boolean {
		return this.selected.some(x => x) && !this.allSelected();
	}

	noneSelected(): boolean {
		return this.selected.length === 0 || this.selected.every(x => !x);
	}

	noData(): boolean {
		return this.displayedData.length === 0;
	}

	importFromExcel(): void {
		let file = this.excelInput.nativeElement.files[0];
		this.excelInput.nativeElement.value = null;
		const dialogRef = this.dialog.open(ConfirmBoxComponent, {
			data: {
				message: `Import ${this.title}s`,
				submessage: `Are you sure you want to save the ${this.title}s from ${file.name}?`,
				type: 'info',
				icon: 'error',
				confirmBtn: true,
				cancelBtn: true
			}
		});
		dialogRef.afterClosed().subscribe(confirmed => {
			if(confirmed) {
				readXlsxFile(file).then(fileData => {
					let added = 0;
					fileData.forEach((row, i) => {
						if(i == 0) return;
						
						let date = new Date(Date.parse(row[3].toString().split('-').reverse().join('-')));
						let data = {
							name: row[0].toString(),
							amount: Number(row[1].toString()),
							category: row[2].toString(),
							date: date.getDate(),
							month: date.getMonth(),
							year: date.getFullYear(),
							type: this.type
						}
						
						this.dataService.addData(data).subscribe(res => {
							this.allData.push(res);
							this.allData.sort((a, b) => {
								let da = new Date(a.year, a.month, a.date);
								let db = new Date(b.year, b.month, b.date);
								return db.getTime() - da.getTime();
							});
							this.changePeriod(this.selectedPeriod.value);
							if(!this.categories.includes(data.category))
								this.categories.push(data.category);

							added++;
							if(added === fileData.length - 1) {
								this.dialog.open(ConfirmBoxComponent, {
									data: {
										message: `${this.title}s added successfully`,
										type: 'success',
										icon: 'done',
										okBtn: true
									}
								});
							}
						});
					});
				});
			}
 		});
	}

	deleteSelected(): void {
		let selectedData = this.filteredData.filter((data, i) => this.selected[i]);
		if(selectedData.length === 0) {
			this.showWarning();
			return;
		}
		
		const dialogRef = this.dialog.open(ConfirmBoxComponent, {
			data: {
				message: `Delete Selected ${this.title}s?`,
				submessage: `Note: This action is irreversible`,
				type: 'confirm',
				icon: 'error',
				confirmBtn: true,
				cancelBtn: true
			}
		});
		dialogRef.afterClosed().subscribe(confirmed => {
			if(confirmed) {
				let deleted = 0;
				selectedData.forEach(data => {
					this.dataService.deleteData(data._id).subscribe(res => {
						let index = this.allData.findIndex(d => d._id === data._id);
						if (index > -1) this.allData.splice(index, 1);
						this.changePeriod(this.selectedPeriod.value);

						deleted++;
						if(deleted === selectedData.length) {
							this.dialog.open(ConfirmBoxComponent, {
								data: {
									message: `${this.title}s deleted successfully`,
									type: 'success',
									icon: 'done',
									okBtn: true
								}
							});
						}
					});
				});
			}
 		});
	}

	exportToExcel(): void {
		let selectedData = this.filteredData.filter((data, i) => this.selected[i]);
		if(selectedData.length === 0) {
			this.showWarning();
			return;
		}
		
		const schema = [
			{
			  column: this.displayedColumns[2],
			  type: String,
			  value: (data: Data) => data.name
			},
			{
			  column: 'Amount',
			  type: Number,
			//   format: '#,##0.00',
			  value: (data: Data) => data.amount
			},
			{
			  column: 'Category',
			  type: String,
			  value: (data: Data) => data.category
			},
			{
			  column: 'Date',
			  type: String,
			  value: (data: Data) => data.date + '-' + (data.month + 1) + '-' + data.year
			}
		];
		
		writeXlsxFile(selectedData, {
			schema,
			fileName: this.title.toLowerCase() + 's.xlsx'
		});
	}

	openFileUpload(): void {
		this.excelInput.nativeElement.click();
	}
}

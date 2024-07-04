import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Data } from 'src/app/shared/models';
import { Chart, PieController, ArcElement, Tooltip, Title, Legend, LineController, CategoryScale, 
		LinearScale, PointElement, LineElement, 
		ChartType } from 'chart.js';
import { dayNames, monthNames } from 'src/app/shared/names';
import { ThemeService } from 'src/app/services/theme.service';

Chart.register(PieController, ArcElement, Tooltip, Title, Legend, LineController, CategoryScale, 
		LinearScale, PointElement, LineElement);

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	incomes: Data[] = [];
	expenses: Data[] = [];
	weekChart: Chart;
	yearChart: Chart;
	weekData: number[][] = [];
	monthData: number[][] = [];
	yearData: number[][] = [];
	monthMatrix: any[][];
	monthNames = monthNames;
	dayNames = dayNames;
	today: Date = new Date();
	totalMonthData: number[] = [0, 0];
	loading: boolean = true;

	month: Date = new Date();
	year: Date = new Date();
	theme: string;

	constructor(private dataService: DataService, private themeService: ThemeService) {
		this.theme = this.themeService.theme;
		this.themeService.themeChange.subscribe(mode => this.theme = mode);
	}

	ngOnInit(): void {
		for(let i = 0; i < 2; i++) {
			this.weekData.push(Array(7).fill(0));
			this.monthData.push(Array(31).fill(0));
			this.yearData.push(Array(12).fill(0));
		}

		let sunday = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay());
		let mfirstDay = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
		let yfirstDay = new Date(this.today.getFullYear(), 0, 1);
		this.dataService.getAllData().subscribe(data => {
			data.forEach(d => {
				let date = new Date(d.year, d.month, d.date);
				if (d.type === 'income'){
					this.incomes.push(d);
					if(date >= sunday)
						this.weekData[1][d.day] += d.amount;
					if(date >= mfirstDay)
						this.monthData[1][d.date - 1] += d.amount;
					if(date >= yfirstDay)
						this.yearData[1][d.month] += d.amount;
				}
				else if(d.type === 'expense'){
					this.expenses.push(d);
					if(date >= sunday)
						this.weekData[0][d.day] += d.amount;
					if(date >= mfirstDay)
						this.monthData[0][d.date - 1] += d.amount;
					if(date >= yfirstDay)
						this.yearData[0][d.month] += d.amount;
				}
			});
			// for(let i = 0; i < 31; i++) {
			// 	this.monthData[0][i] += i;
			// }
			this.createWeekChart(0);
			this.createYearChart();
			this.monthMatrix = this.getMonthStructure();
			this.calculateMonthData();
			this.loading = false;
		});
	}

	createWeekChart(index: number): void {
		let days = dayNames;
		let bgColors = ['#0ad118', '#f71919', '#b300ff', '#fbff03', '#ff8903', '#f007b6', '#0f37d6'];
		let data = Array(7).fill(0);
		this.weekData[index].forEach((d, i) => data[i] += d);
		let total = this.weekData[index].reduce((sum, cur) => sum + cur, 0);
		if(total === 0) {
			days = [`No ${index === 0 ? 'expenses' : 'incomes'} this week`];
			bgColors = ['gray'];
			data = [1];
		}
		this.weekChart = new Chart('week-chart', {
			type: 'pie' as ChartType,
			data: {
				labels: days,
				datasets: [
					{
						label: 'Days',
						data: data,
						backgroundColor: bgColors
					}
				]
			},
			options: {
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: 'white'
						}
					},
					tooltip: {
						enabled: data.length > 1
					}
				},
				aspectRatio: 1
			}
		})
	}

	createYearChart(): void {
		this.yearChart = new Chart('year-chart', {
			type: 'line',
			data: {
				labels: monthNames.map(m => m.substr(0, 3)),
				datasets: [
					{
						label: 'Income',
						data: this.yearData[1],
						backgroundColor: 'hsl(120, 75%, 40%)',
						borderColor: 'hsl(120, 75%, 40%)',
						fill: false
					},
					{
						label: 'Expense',
						data: this.yearData[0],
						backgroundColor: 'red',
						borderColor: 'red',
						fill: false
					}
				]
			},
			options: {
				plugins: {
					legend: {
						labels: {
							color: 'white'
						}
					}
				},
				scales: {
					x: {
						ticks: {
							color: 'white'
						},
						title: {
							display: true,
							text: 'Month',
							color: 'white'
						}
					},
					y: {
						ticks: {
							color: 'white'
						},
						title: {
							display: true,
							text: 'Amount (₹)',
							color: 'white'
						},
						min: 0
					}
				},
				interaction: {
					intersect: false,
					mode: 'index'
				},
				aspectRatio: (screen.width >= 500 ? 2.5 : 1)
			}
		})
	}

	changeType(index: number): void {
		this.weekChart.destroy();
		this.createWeekChart(index);
	}

    getMonthStructure(): any[][] {
        const day = new Date(this.month.getFullYear(), this.month.getMonth(), 1).getDay();
        let matrix: any[] = [], week: any[] = [];
        for(let i = 0; i < day; i++) week.push(' ');
        var curDate = 1, lastDate = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 0).getDate();
        while(curDate <= lastDate){
            week.push(curDate++);
            if(week.length === 7){
                matrix.push(week);
                week = [];
            }
        }
        if(week.length > 0) {
            while(week.length < 7) week.push(' ');
            matrix.push(week);
        }
        return matrix;
    }

	calculateMonthData(): void {
		this.monthData.forEach((d, i) => {
			this.totalMonthData[i] = d.reduce((sum, cur) => sum + cur, 0);
		});
	}

	getColor(cell: any): string {
		if(cell === ' ') return 'rgba(0, 0, 0, 0.5)';
		// if(cell == this.today.getDate()) return 'rgba(255, 255, 255, 0.7)';
		if(this.monthData[0][cell - 1] + this.monthData[1][cell - 1] > 0) {
			let green = (this.monthData[1][cell - 1] / (this.monthData[0][cell - 1] + this.monthData[1][cell - 1])) * 100;
			return `linear-gradient(135deg, hsl(120, 75%, 40%) 0% ${green}%, red ${green}% 100%)`;
		}
		return '';
	}

	changeMonth(nextMonth: Boolean) {
		if(nextMonth) this.month.setMonth(this.month.getMonth() + 1);
		else this.month.setMonth(this.month.getMonth() - 1);
		for(let i = 0; i < 2; i++)
			for(let j = 0; j < 31; j++)
				this.monthData[i][j] = 0;
		let firstDay = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
		let lastDay = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 0);
		this.incomes.forEach(d => {
			let date = new Date(d.year, d.month, d.date);
			if(date >= firstDay && date <= lastDay)
				this.monthData[1][d.date - 1] += d.amount;
		})
		this.expenses.forEach(d => {
			let date = new Date(d.year, d.month, d.date);
			if(date >= firstDay && date <= lastDay)
				this.monthData[0][d.date - 1] += d.amount;
		})
		this.monthMatrix = this.getMonthStructure();
		this.calculateMonthData();
	}

	changeYear(nextYear: Boolean) {
		if(nextYear) this.year.setFullYear(this.year.getFullYear() + 1);
		else this.year.setFullYear(this.year.getFullYear() - 1);
		for(let i = 0; i < 2; i++)
			for(let j = 0; j < 12; j++)
				this.yearData[i][j] = 0;
		let firstDay = new Date(this.year.getFullYear(), 0, 1);
		let lastDay = new Date(this.year.getFullYear(), 11, 31);
		this.incomes.forEach(d => {
			let date = new Date(d.year, d.month, d.date);
			if(date >= firstDay && date <= lastDay)
				this.yearData[1][d.month] += d.amount;
		})
		this.expenses.forEach(d => {
			let date = new Date(d.year, d.month, d.date);
			if(date >= firstDay && date <= lastDay)
				this.yearData[0][d.month] += d.amount;
		})
		this.yearChart.destroy();
		this.createYearChart();
	}

}

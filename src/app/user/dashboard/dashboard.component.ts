import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Data } from 'src/app/shared/models';
import { Chart, PieController, ArcElement, Tooltip, Title, Legend, LineController, CategoryScale, 
		LinearScale, PointElement, LineElement } from 'chart.js';
import { dayNames, monthNames } from 'src/app/shared/names';

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

	constructor(private dataService: DataService) { }

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
			for(let i = 0; i < 31; i++) {
				this.monthData[0][i] += i;
			}
			this.createWeekChart(0);
			this.createYearChart();
			this.monthMatrix = this.getMonthStructure();
			this.calculateMonthData();
			this.loading = false;
		});
	}

	createWeekChart(index: number): void {
		// let wdata = this.weekData[index];
		// let data = Array(7).fill(0);
		// wdata.forEach(d => {
		// 	data[d.day] += d.amount;
		// });
		let data = [10, 5, 34, 18, 23, 45, 14];
		if(index == 1)
			data = [23, 80, 12, 4, 26, 53, 24]
		this.weekChart = new Chart('week-chart', {
			type: 'pie',
			data: {
				labels: dayNames,
				datasets: [
					{
						label: 'Days',
						data: data,
						backgroundColor: ['red', 'blue', 'green', 'yellow', 'violet', 'orange', 'pink']
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
						data: [10, 5, 23, 18, 54, 45, 14, 34, 18, 38, 45, 65],
						backgroundColor: 'hsl(120, 75%, 40%)',
						borderColor: 'hsl(120, 75%, 40%)',
						fill: false
					},
					{
						label: 'Expense',
						data: [23, 80, 12, 4, 26, 53, 24, 54, 45, 14, 34, 18],
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
							text: 'Amount',
							color: 'white'
						}
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
        const day = new Date(this.today.getFullYear(), this.today.getMonth(), 1).getDay();
        let matrix: any[] = [], week: any[] = [];
        for(let i = 0; i < day; i++) week.push(' ');
        var curDate = 1, lastDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate();
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

}

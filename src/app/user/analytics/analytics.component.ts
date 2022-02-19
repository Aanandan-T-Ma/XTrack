import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Data } from 'src/app/shared/models';
import { Chart, PieController, ArcElement, Tooltip, Title, Legend, CategoryScale, 
		LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Title, Legend, CategoryScale, 
		LinearScale, PointElement, LineElement);

@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

	@Input() data: Data[];
	@Input() title: string;

	categoryChart: Chart;
	total: number;

	constructor() { }

	ngOnInit(): void {
		this.creatCategoryChart();
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if(this.categoryChart) {
			this.categoryChart.destroy();
			this.creatCategoryChart();
		}
	}

	creatCategoryChart(): void {
		let categoryMap = {};
		let bgColors: string[] = [];
		this.total = 0;
		this.data.forEach(d => {
			if(!categoryMap[d.category]) {
				categoryMap[d.category] = 0;
				bgColors.push(this.getRandomColor());
			}
			categoryMap[d.category] += d.amount;
			this.total += d.amount;
		})
		if(this.total === 0) {
			categoryMap[`No ${this.title} in this period`] = 1;
			bgColors = ['gray'];
		}
		this.categoryChart = new Chart('category-chart', {
			type: 'pie',
			data: {
				labels: Object.keys(categoryMap),
				datasets: [
					{
						label: 'Category',
						data: Object.values(categoryMap),
						backgroundColor: bgColors
					}
				]
			},
			options: {
				plugins: {
					legend: {
						position: 'bottom'
					}
				},
				aspectRatio: 1
			}
		})
	}

	getRandomColor(): string {
		let adv = 0;
		let r = Math.floor((Math.random() + adv) * 256);
		let g = Math.floor((Math.random() + adv) * 256);
		let b = Math.floor((Math.random() + adv) * 256);
		return `rgb(${r}, ${g}, ${b})`;
	}

	getNumberString(num: number) {
		return num.toLocaleString('en-IN', {
			style: 'currency',
			currency: 'INR'
		})
	}

}

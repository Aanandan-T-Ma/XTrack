import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseURL';
import { Data } from '../shared/models';
import { ProcessHttpMsgService } from './process-httpmsg.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient, private processHTTPMsgService: ProcessHttpMsgService) { }

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

	getData(type: string): Observable<Data[]> {
		return this.http.get<Data[]>(`${baseURL}/cashflow/specific/${type}`)
			.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	addData(data: any): Observable<Data> {
		return this.http.post<Data>(`${baseURL}/cashflow`, data)
			.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	editData(data: any, id: string): Observable<Data> {
		return this.http.put<Data>(`${baseURL}/cashflow/${id}`, data)
			.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	deleteData(id: string): Observable<Data> {
		return this.http.delete<Data>(`${baseURL}/cashflow/${id}`)
			.pipe(catchError(this.processHTTPMsgService.handleError));
	}

	getAllData(): Observable<Data[]> {
		return this.http.get<Data[]>(`${baseURL}/cashflow`)
			.pipe(catchError(this.processHTTPMsgService.handleError));
	}
	
}

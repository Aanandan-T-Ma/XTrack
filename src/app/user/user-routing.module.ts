import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { IncomeComponent } from './income/income.component';
import { UserComponent } from './user.component';

const routes: Routes = [
	{
		path: '',
		component: UserComponent,
		children: [
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			{
				path: 'income',
				component: IncomeComponent
			},
			{
				path: 'expenditure',
				component: ExpenditureComponent
			},
			{
				path: '**',
				redirectTo: 'dashboard',
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule { }

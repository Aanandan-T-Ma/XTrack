import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IncomeComponent } from './income/income.component';
import { ExpenditureComponent } from './expenditure/expenditure.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { DataComponent } from './data/data.component';
import { DataModalComponent } from './data/data-modal/data-modal.component';
import { PasswordChangeComponent } from './password-change/password-change.component';


@NgModule({
	declarations: [
		UserComponent,
		NavbarComponent,
		DashboardComponent,
		IncomeComponent,
		ExpenditureComponent,
  		DataComponent,
		DataModalComponent,
		PasswordChangeComponent
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		SharedModule
	]
})
export class UserModule { }

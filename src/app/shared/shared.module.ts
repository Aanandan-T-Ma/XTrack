import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingComponent } from './loading/loading.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const modules = [
	CommonModule,
	MatTabsModule,
	MatInputModule,
	MatButtonModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	FormsModule,
	MatIconModule,
	MatCheckboxModule,
	MatSidenavModule,
	MatToolbarModule,
	MatListModule,
	MatSelectModule,
	MatTableModule,
	MatPaginatorModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatDialogModule,
	HttpClientModule,
	MatChipsModule,
	MatAutocompleteModule
]

@NgModule({
	declarations: [
    	LoadingComponent,
     	ConfirmBoxComponent
  	],
	imports: [modules],
	exports: [modules, LoadingComponent]
})
export class SharedModule { }

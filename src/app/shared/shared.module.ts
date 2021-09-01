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
	MatListModule
]

@NgModule({
	declarations: [],
	imports: [modules],
	exports: [modules]
})
export class SharedModule { }

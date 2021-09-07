import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationComponent } from './activation/activation.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'user',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'activateAccount/:url',
		component: ActivationComponent
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		CommonModule
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

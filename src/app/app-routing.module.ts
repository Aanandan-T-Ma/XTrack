import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationComponent } from './activation/activation.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [LoginGuard]
	},
	{
		path: 'user',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'activateAccount/:url',
		component: ActivationComponent,
		canActivate: [LoginGuard]
	},
	{
		path: 'forgotPassword/:url',
		component: PasswordComponent,
		canActivate: [LoginGuard]
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

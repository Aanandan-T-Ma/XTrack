import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { ActivationComponent } from './activation/activation.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
  		ActivationComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		SharedModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

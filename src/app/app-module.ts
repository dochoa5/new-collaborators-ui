import {NgModule, provideBrowserGlobalErrorListeners} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing-module';
import {App} from './app';
import {provideHttpClient} from '@angular/common/http';
import {TopBar} from "./shared/top-bar/top-bar";

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TopBar
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule {
}

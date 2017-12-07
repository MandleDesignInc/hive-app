import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material/material.module';

import {LoginModule} from './login/login.module';
import {HomeModule} from './home/home.module';
import {DocumentModule} from './document/document.module';


import {AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';

import {AppBarModule} from './app-bar/app-bar.module';
import {AppFooterModule} from './app-footer/app-footer.module';
import {VirtualConferenceModule} from './virtual-conference/virtual-conference.module';
import {AppBarService} from './app-bar.service';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [
      AppComponent
  ],
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MaterialModule,
      LoginModule,
      HomeModule,
      DocumentModule,
      AppRoutingModule,
      AppBarModule,
      AppFooterModule,
      VirtualConferenceModule
  ],
  providers: [AuthService, AppBarService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TimeComponent } from './time-component/time-component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './home-component/home-component';
import { FooterComponent } from './footer-component/footer-component';
import { NavBarComponent } from './nav-bar-component/nav-bar-component';
import { RankingComponent } from './ranking-component/ranking-component';
import { PartidaComponent } from './partida-component/partida-component';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    TimeComponent,
    PartidaComponent,
    RankingComponent,
    NavBarComponent,
    FooterComponent

  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule { }

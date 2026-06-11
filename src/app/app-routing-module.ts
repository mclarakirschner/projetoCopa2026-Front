import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home-component/home-component';
import { RankingComponent } from './ranking-component/ranking-component';
import { TimeComponent } from './time-component/time-component';
import { PartidaComponent } from './partida-component/partida-component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'times', component: TimeComponent },
  { path: 'partidas', component: PartidaComponent },
  { path: 'ranking', component: RankingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

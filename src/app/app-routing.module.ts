import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { TrackerHpComponent } from './tracker-hp/tracker-hp.component';
import { NewHpComponent } from './new-hp/new-hp.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'tracker/:id/hp', component: TrackerHpComponent },
  { path: 'newHP', component: NewHpComponent },
  { path: '**', redirectTo: '/overview' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

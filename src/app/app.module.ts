import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { HpFormComponent } from './hp-form/hp-form.component';
import { FormsModule }   from '@angular/forms';
import { TrackerHpComponent } from './tracker-hp/tracker-hp.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    HpFormComponent,
    TrackerHpComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
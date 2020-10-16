import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable, Operator, Subscriber } from 'rxjs';
import { Tracking } from './tracking';
import { HP } from './hp';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private db: AngularFirestore) {  }

  getTracking(): Observable<DocumentChangeAction<{}>[]> {
    return this.db.collection('tracking').snapshotChanges();
  }

  addHP(data: {[k: string]: any}, docID: string): void {
    this.db.collection('hp').doc(docID).set(data);
  }

  getHP(id: number, date?: string): Observable<HP[]>{
    if (date) {
      return this.db.collection('hp', ref => ref.where("tokos", "array-contains", id).where("date", ">=", date)).snapshotChanges().lift(new HPOperator());
    }
    return this.db.collection('hp', ref => ref.where("tokos", "array-contains", id)).snapshotChanges().lift(new HPOperator());
  }

  getTracked(id: number): Observable<Tracking> {
    return this.db.collection("tracking").doc('' + id).get().lift(new TrackingOperator());
  }

  getWatched(id: number): Observable<firebase.firestore.DocumentSnapshot> {
    return this.db.collection("watching").doc('i' + id).get();
  } 
}

class TrackingOperator implements Operator<firebase.firestore.DocumentSnapshot, Tracking> {
  call(subscriber: Subscriber<Tracking>, source: Observable<firebase.firestore.DocumentSnapshot>): any {
    source.subscribe(data => {
      if (data.exists) {
        let track = new Tracking(data.get("id"), data.get("male"));
        track.doOver = data.get("doOver") ? data.get("doOver") : track.doOver;
        track.build = data.get("build") ? data.get("build") : track.build;
        track.companions = data.get("companions") ? data.get("companions") : track.companions;
        track.startSub = data.get("startSub") ? data.get("startSub") : track.startSub;
        track.aoas = data.get("aoas") ? data.get("aoas") : track.aoas;
        track.aoasdate = data.get("aoasdate") ? data.get("aoasdate") : track.aoasdate;
        track.hierarchy = data.get("hierarchy") ? data.get("hierarchy") : track.hierarchy;
        track.avedate = data.get("avedate") ? data.get("avedate") : track.avedate;
        track.domdate = data.get("domdate") ? data.get("domdate") : track.domdate;
        track.alphadate = data.get("alphadate") ? data.get("alphadate") : track.alphadate;
        track.bonds = data.get("bonds") ? data.get("bonds") : track.bonds;
        track.hpTokens = data.get("hpTokens") ? data.get("hpTokens") : track.hpTokens;
        track.social = data.get("social") ? data.get("social") : track.social;
        subscriber.next(track);
      } else {
        subscriber.next(null);
      }
    },
        err => console.log(err));
  }
}

class HPOperator implements Operator<DocumentChangeAction<{}>[], HP[]> {
  call(subscriber: Subscriber<HP[]>, source: Observable<DocumentChangeAction<{}>[]>): any {
    source.subscribe(data => {
      let hp_sheet: HP[] = [];
      data.forEach(item => {
        hp_sheet.push(new HP(
          item.payload.doc.data()["link"],
          item.payload.doc.data()["src"],
          item.payload.doc.data()["name"],
          item.payload.doc.data()["date"],
          item.payload.doc.data()["tokos"],
          item.payload.doc.data()["artists"],
          item.payload.doc.data()["starter"],
          item.payload.doc.data()["hs"],
          item.payload.doc.data()["qual"],
          item.payload.doc.data()["bg"],
          item.payload.doc.data()["wc"],
          item.payload.doc.data()["act"],
          item.payload.doc.data()["show"],
          item.payload.doc.data()["quest"],
          item.payload.doc.data()["handler"],
          item.payload.doc.data()["lore"],
          item.payload.doc.data()["companions"],
          item.payload.doc.data()["arpg"],
          item.payload.doc.data()["QL"],
        ));//this.hp.push()
      });//data.forEach()

      subscriber.next(hp_sheet);
    },
      err => console.log(err)
    );
  }
}
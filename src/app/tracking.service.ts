import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HP } from './hp';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private db: AngularFirestore) {
    //citiesRef.where("regions", "array-contains", "west_coast")
    /* this.getTest().subscribe(data => {
      data.forEach(item => {
        console.log(item.payload.doc.data());
        //this.ids = this.ids.concat([item.payload.doc.data()["id"]]);
      })
    },
      err => console.log(err)
    ); */
  }

  getTracking(): Observable<DocumentChangeAction<{}>[]> {
    //this.expensesCollection = this.db.collection('/expenses', ref => ref.where(expenseId', '==', this.expenseId));
    return this.db.collection('tracking').snapshotChanges();
  }

  addHP(model: HP): void {
    var temp_id = model.link.substr(-9, 9);
    var temp_start = model.link.indexOf('/art/');
    var temp_end = model.link.indexOf(temp_id);
    var temp_name = model.link.substring(temp_start + 5, temp_end - 1);
    var temp_tokos: Object[] = [];
    for (let toko of model.tokotas) {
      var toko_object = {
        id: toko.id,
        comp: toko.comp,
        QL: {
          val: toko.QLn,
          link: toko.QLl
        }
      };
      temp_tokos.push(toko_object);
    }
    var data = {
      name: temp_name,
      link: model.link,
      source: model.source,
      date: model.date,
      tokotas: temp_tokos,
      qual: model.qual,
      chibi: model.chibi,
      recol: model.recol,
      bg: model.bg,
      hs: model.hs,
      fb: model.fb,
      sheet: model.sheet,
      ownwork: model.ownwork,
      handler: model.handler,
      starter: model.starter,
      lore: model.lore,
      affil: model.affil,
      outfit: model.outfit,
      wc: {
        val: model.wc.val,
        ids: model.wc.ids
      },
      act: {
        val: model.act.val,
        ids: model.act.ids
      },
      quest: {
        val: model.quest.val,
        ids: model.quest.ids
      }
    }
    this.db.collection('hp').doc(temp_id).set(data);
  }


  getTest(): Observable<DocumentChangeAction<{}>[]> {
    return this.db.collection('tracking', ref => ref.where("startSub", "==", true)).snapshotChanges();
  }

  getHP(id: number): Observable<DocumentChangeAction<{}>[]> {
    return this.db.collection('hp', ref => ref.where("tokotas", "array-contains", id)).snapshotChanges();
  }

  getTracked(id: number): Observable<firebase.firestore.DocumentSnapshot> {
    return this.db.collection("tracking").doc('' + id).get();
  }
  
}
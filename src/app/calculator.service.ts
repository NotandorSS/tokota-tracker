import { Injectable } from '@angular/core';
import { HP } from './hp';
import { Tracking } from './tracking';
import { Watching } from './watching';
import { Lists } from './lists';
import { TrackingService } from './tracking.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  PL = false;
  LK = false;
  faction = ""; //either PL or LK
  owner = 'secretrealm';

  constructor(private trackingService: TrackingService) { }

  breakdown(entry: HP, toko: Tracking, ids: number[]): Observable<{ "total": number, "breakdown": string }> {
    return new Observable<{ "total": number, "breakdown": string }>(obs => {
      let WatchedObs = this.getWatchedArr(ids);
      if (WatchedObs.length > 0) {
        forkJoin(WatchedObs).subscribe(watched => {
          obs.next(this.calculateHP(entry, toko, watched));
        },
          err => console.log('Error:', err)
        );
      } else {
        obs.next(this.calculateHP(entry, toko, []));
      }
    });
  }

  calculateHP(entry: HP, toko: Tracking, watched: Watching[]): { "total": number, "breakdown": string } {
    const calculation = {
      "total": 0,
      "breakdown": ''
    }
    let addHP = (total: number, subString: string) => {
      calculation.total += total;
      calculation.breakdown += subString;
    }
    if (entry.src) {
      let hs = (entry.hs && entry.hs.includes(toko.id)) ? 1.1 : 0;
      let val = (entry.qual != 0) ? Math.round(entry.qual - hs) : 0;
      if (entry.hs && entry.hs.includes(toko.id)) addHP(val, val + "(hs " + Qual[entry.qual] + ") ");
      else addHP(val, val + "(fb " + Qual[entry.qual] + ") ");
      if (entry.bg) addHP(2, "+2(bg) ");
    } //art
    if (entry.wc && entry.wc.ids.includes(toko.id)) {
      let val = Math.floor(entry.wc.val / 200);
      let str = val + "(" + entry.wc.val + " WC) ";
      str = (entry.src) ? '+' + str : str
      addHP(val, str);
    } //word count
    if (entry.act && entry.act.ids.includes(toko.id)) {
      if (entry.act.val < 8 && (this.PL || this.LK)) addHP(3, "+3(" + this.faction + " " + Act[entry.act.val] + ") ");
      else addHP(2, "+2(" + Act[entry.act.val] + ") ");
    } //activity
    if (entry.quest && entry.quest.ids.includes(toko.id)) addHP(entry.quest.val, "+" + entry.quest.val + "(WQ) ");
    if (entry.show) {
      for (let key in entry.show) {
        if (+key == toko.id) {
          let val = 5 - entry.show[key].val;
          addHP(val, '+' + val + "(<a href='" + entry.show[key].link + "'>" + Show[entry.show[key].val] + "</a> place) ");
        }
      }
    }//show place
    if (entry.artists && entry.artists.includes(this.owner)) {
      if (entry.artists.length == 1) addHP(4, "+4(non-com) ");
      else {
        addHP(2, "+2(collab) ");
        if (toko.social == 2) {
          addHP(3, "+3(social II) ");
        } else if (toko.social == 1) {
          addHP(2, "+2(social) ");
        }
      }
    }//artists
    if (entry.handler) addHP(2, "+2(handler) ");
    if (entry.starter) addHP(2, "+2(starter ~" + entry.starter + "~) ");
    if (entry.lore) addHP(2, "+2(" + entry.lore + ") ");
    if (entry.companions) {
      let count = 0;
      for (const comp of toko.companions) if (entry.companions.includes(comp)) count += 1;
      if (count == 1) addHP(1, "+1(1 companion) ");
      else if (count == 2) addHP(2, '+2(2 companions) ');
      else if (count >= 3) addHP(3, '+3(3+ companions) ');
    }//companions
    {
      let alphaC = 0;
      let alphaS = '';
      if (Lists.akota_starters.includes(entry.starter)) {
        alphaC = 1;
        alphaS = ' ~' + entry.starter + '~';
      }
      for (let watch of watched) if (watch.alpha) {
        alphaC += 1;
        alphaS += ' ~' + watch.id + '~';
      }
      if (alphaC == 1) addHP(1, "+1(1 alpha" + alphaS + ") ");
      else if (alphaC == 2) addHP(2, '+2(2 alphas' + alphaS + ") ");
      else if (alphaC >= 3) addHP(3, '+3(3+ alphas' + alphaS + ") ");
    } //alpha
    {
      let ssid, sspower = 0;
      for (let watch of watched) if (watch.superstar && watch.superstar > sspower) {
        sspower = watch.superstar;
        ssid = watch.id;
      }
      if (sspower == 1) addHP(2, '+2(superstar ~' + ssid + "~) ");
      else if (sspower == 2) addHP(3, '+3(superstar II ~' + ssid + "~) ");
    }//superstar
    if (toko.build == 2) {
      let bbid;
      for (let watch of watched) if (watch.brother_bear) bbid = watch.id;
      if (bbid) addHP(2, '+2(brother bear ~' + bbid + "~) ");
    } //check for brotherbear
    if (toko.build == 1) {
      let fsid;
      for (let watch of watched) if (watch.fun_sized) fsid = watch.id;
      if (fsid) addHP(2, '+2(fun sized ~' + fsid + "~) ");
    } //check for fun sized
    {
      let tmid;
      for (let watch of watched) if (Lists.tribemates.includes(watch.owner)) tmid = watch.id;
      if (tmid) addHP(3, '+3(tribemate HC ~' + tmid + "~) ");
    } //tribemate
    for (let watch of watched) {
      if (watch.bonds && watch.bonds.includes(toko.id)) {
        addHP(3, '+3(~' + watch.id + "~ has Aippaq's Bonds) ");
        break;
      }
      else if (toko.bonds.length > 0 && toko.bonds.includes(watch.id)) {
        addHP(3, '+3(~' + watch.id + "~ is Aippaq's Bonds relative) ");
        break;
      }
    }//bonds
    if (entry.arpg && entry.arpg.length > 0) {
      let breakdown = "(arpg";
      for (let i = 0; i < entry.arpg.length && i < 3; i++) {
        breakdown += " <a href='" + entry.arpg[i] + "'>" + Number(i + 1) + "</a>";
      }
      if (entry.arpg.length >= 3) addHP(3, '+3' + breakdown + ') ');
      else addHP(entry.arpg.length, "+" + entry.arpg.length + breakdown + ') ');
    }//arpg
    if (entry.QL) {
      for (let key in entry.QL) {
        if (+key == toko.id) {
          addHP(entry.QL[key].val, '+' + entry.QL[key].val + "(<a href='" + entry.QL[key].link + "'>quick learner roll</a>) ");
        }
      }
    }//quick learner
    return calculation;
  }

  getWatchedArr(ids: number[]): Observable<Watching>[] {
    let observables: Observable<Watching>[] = [];
    for (let id of ids) {
      let obj = this.getWatched(id);
      observables.push(obj);
    }
    return observables;
  }

  getWatched(watchid: number): Observable<Watching> {
    return new Observable<Watching>(obs => {
      this.trackingService.getWatched(watchid).subscribe(data => {
        if (data) {
          let watch = new Watching(watchid, data.get("owner"));
          watch.alpha = data.get("alpha") ? data.get("alpha") : watch.alpha;
          watch.superstar = data.get("superstar") ? data.get("superstar") : watch.superstar;
          watch.brother_bear = data.get("brother_bear") ? data.get("brother_bear") : watch.brother_bear;
          watch.fun_sized = data.get("fun_sized") ? data.get("fun_sized") : watch.fun_sized;
          watch.bonds = data.get("bonds") ? data.get("bonds") : watch.bonds;
          obs.next(watch);
          obs.complete();
        } else {
          obs.next(null);
        }
      },
        err => console.log(err)
      );//subscribe to database
    }); //return Observable
  }

}

enum Act {
  hunt = 1,
  fish,
  explore,
  cave,
  dive,
  breed,
  heal,
  rite,
  show,
  event,
}

enum Qual {
  "sketch" = 0,
  "uncolored" = 1,
  "uncolored shaded" = 1.5,
  "colored" = 2,
  "colored shaded" = 3,
}

enum Show {
  "1st" = 1,
  "2nd",
  "3rd",
}
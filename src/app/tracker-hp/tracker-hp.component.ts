import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { HP_Card } from '../hp-card';
import { HP } from '../hp';
import { Hier_Tier } from '../hier-tier';
import { TrackingService } from '../tracking.service';
import { CalculatorService } from '../calculator.service';
import { Tracking } from '../tracking';

@Component({
  selector: 'app-tracker-hp',
  templateUrl: './tracker-hp.component.html',
  styleUrls: ['./tracker-hp.component.css']
})
export class TrackerHpComponent implements OnInit {
  toko: Tracking;
  Tiers: Hier_Tier[] = [];
  hp_sheet: HP[] = [];

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService,
    private calcService: CalculatorService) {
  }

  ngOnInit() {
    this.getTracked(+this.route.snapshot.paramMap.get('id')).subscribe(toko =>
      this.getHP(toko.id, toko.doOver).subscribe(hp_sheet => {
        this.toko = toko;
        this.hp_sheet = hp_sheet;
        //console.log("this toko", this.toko);
        console.log("this hp", hp_sheet);
        this.initTiers();
        this.fillHP(toko, hp_sheet);
      })//getHP subscribe
    );//getTracked subscribe
  }

  initTiers(): void {
    let temp: Hier_Tier;
    if (this.toko.build == 3) {
      //For every 150 HP after Bonding males can unlock 1 more slot at Hierarchy Updates, up to a total of 4 extra slots.
      for (var i = 1; i < 5; i++) {
        temp = new Hier_Tier("Bonded-Unlock-" + i, 150);
        this.Tiers.push(temp);
      }
    } else {
      if (this.toko.startSub) {
        temp = new Hier_Tier("Sub-to_ave", 75);
        this.Tiers.push(temp);
      }
      temp = new Hier_Tier("Ave-to-Dom", 250);
      this.Tiers.push(temp);
      temp = new Hier_Tier("Dom-to-Alpha", 300);
      this.Tiers.push(temp);
      for (var i = 1; i < 6; i++) {
        temp = new Hier_Tier("Alpha-Unlock-" + i, 150);
        this.Tiers.push(temp);
      }
      if (this.toko.build != 2 && this.toko.sex == 1) {
        for (var i = 6; i < 14; i++) {
          temp = new Hier_Tier("Alpha-Unlock-" + i, 150);
          this.Tiers.push(temp);
        }
      }
    }
  }

  getTracked(id: number): Observable<Tracking> {
    return new Observable<Tracking>(obs => {
      this.trackingService.getTracked(id).subscribe(data => {
        if (data.exists) {
          let track = new Tracking(id);
          track.doOver = data.get("doOver") ? data.get("doOver") : track.doOver;
          track.build = data.get("build") ? data.get("build") : track.build;
          track.companions = data.get("companions") ? data.get("companions") : track.companions;
          track.startSub = data.get("startSub") ? data.get("startSub") : track.startSub;
          obs.next(track);
        } else {
          obs.next(null);
        }
      },
        err => console.log(err)
      );
    });
  }

  getHP(id: number, doOver: string): Observable<HP[]> {
    return new Observable<HP[]>(obs => {
      let DocChange;
      if (doOver) {
        DocChange = this.trackingService.getHPDate(id, doOver);
      } else {
        DocChange = this.trackingService.getHP(id);
      }
      DocChange.subscribe(data => {
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

        obs.next(hp_sheet);
      },
        err => console.log(err)
      );
    }//funct obs
    );
  }//getHP()

  fillHP(toko: Tracking, hp_sheet: HP[]): void {
    //keeps track of hierarchy array in which HP cards are pushed
    //0 = sub-ave, 1 = ave-dom, 2 = dom-alpha, 3 = alpha-1
    let cur_hier: number = 0;

    for (let hp of hp_sheet) {
      if (hp.tokos) {
        if (hp.tokos.length > 1) {
          hp.tokos.splice(hp.tokos.indexOf(toko.id), 1);
        } else {
          hp.tokos = []
        }
      } else {
        console.log("something's wrong?", hp);
      }
      this.calcService.breakdown(hp, toko, hp.tokos).subscribe(breakdown => {
        let temp: HP_Card = {
          link: hp.link,
          source: hp.src,
          name: hp.name,
          total: breakdown.total,
          breakdown: breakdown.breakdown
        };

        if (temp.source == null) {
          temp.source = 'https://shmector.com/_ph/14/607312131.png';
        } // if there's an image link

        //add card to hierarchy tier
        this.Tiers[cur_hier].cards.push(temp);
        this.Tiers[cur_hier].total += temp.total;

        //replace ids in breakdown with links
        let ids = hp.tokos.concat(hp.starter);
        let newbd: string;
        for (let id of ids) {
          let tag = "~" + id + "~";
          newbd = "<a href='https://tokotna.com/imports/index.php?id=" + id + "'>" + id + "</a>";
          let replacement = temp.breakdown.replace(tag, newbd);
          while (temp.breakdown != replacement) {
            temp.breakdown = temp.breakdown.replace(tag, newbd);
            replacement = temp.breakdown.replace(tag, newbd);
          }
        }

        //check to see if need to switch from one hierarchy tier to the next
        if (this.Tiers[cur_hier].total >= this.Tiers[cur_hier].req) {
          this.Tiers[cur_hier + 1].spill = this.Tiers[cur_hier].total - this.Tiers[cur_hier].req;
          cur_hier += 1;
          this.Tiers[cur_hier].total = this.Tiers[cur_hier].spill;
        } //switch hierarchy
      }); //forkJoin.subscribe
    } //for
  }
}
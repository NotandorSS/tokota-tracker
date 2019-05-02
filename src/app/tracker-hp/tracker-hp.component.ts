import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

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
      this.getHP(toko.id, toko.doOver["date"]).subscribe(hp_sheet => {
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
    console.log("calling initTiers")
    let temp: Hier_Tier;
    if (this.toko.build == 3) {
      //For every 150 HP after Bonding males can unlock 1 more slot at Hierarchy Updates, up to a total of 4 extra slots.
      for (var i = 1; i < 5; i++) {
        temp = new Hier_Tier("Bonded-Unlock-" + i, 150);
        this.Tiers.push(temp);
      }
    } else {
      if (!(this.toko.doOver["date"] && this.toko.domdate)) {
        if (this.toko.startSub) {
          temp = new Hier_Tier("Sub-to_ave", 75);
          this.Tiers.push(temp);
        }
        temp = new Hier_Tier("Ave-to-Dom", 250);
        this.Tiers.push(temp);
      }
      temp = new Hier_Tier("Dom-to-Alpha", 300);
      this.Tiers.push(temp);
      for (var i = 1; i < 6; i++) {
        temp = new Hier_Tier("Alpha-Unlock-" + i, 100);
        this.Tiers.push(temp);
      }
      if (this.toko.build != 2 && this.toko.male) {
        for (var i = 6; i < 14; i++) {
          temp = new Hier_Tier("Alpha-Unlock-" + i, 100);
          this.Tiers.push(temp);
        }
      }
    }
  }

  getTracked(id: number): Observable<Tracking> {
    return new Observable<Tracking>(obs => {
      this.trackingService.getTracked(id).subscribe(data => {
        if (data.exists) {
          let track = new Tracking(id, data.get("male"));
          track.doOver = data.get("doOver") ? data.get("doOver") : track.doOver;
          track.build = data.get("build") ? data.get("build") : track.build;
          track.companions = data.get("companions") ? data.get("companions") : track.companions;
          track.startSub = data.get("startSub") ? data.get("startSub") : track.startSub;
          track.aoas = data.get("aoas") ? data.get("aoas") : track.aoas;
          track.aoasdate = data.get("aoasdate") ? data.get("aoasdate") : track.aoasdate;
          track.hierarchy = data.get("hierarchy") ? data.get("hierarchy") : track.hierarchy;
          track.domdate = data.get("domdate") ? data.get("domdate") : track.domdate;
          track.bonds = data.get("bonds") ? data.get("bonds") : track.bonds;
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


    if (toko.hierarchy > 1 && (!toko.doOver["date"] || toko.domdate >= toko.doOver["date"])) {
      let dom = 1;
      if (toko.doOver["date"] && toko.domdate >= toko.doOver["date"]) {
        dom = 0;
      }
      else if (toko.startSub) {
        dom = 2;
      }
      this.Tiers[dom].cards.push({
        link: "https://tokotna.com/tribes/index.php?tribe=Lunar+Aegis",
        source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8tc73-6ed79a74-a7ad-43aa-9120-e5efca0fdd73.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dGM3My02ZWQ3OWE3NC1hN2FkLTQzYWEtOTEyMC1lNWVmY2EwZmRkNzMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZPUSaB5aao_VFOEcGPk_-joVo6F78upbFHMq7n5lYpQ",
        name: "Tribal Dominance",
        total: 10,
        breakdown: "+10 HP to your tokota’s overall HP total when you complete its RoDs"
      });
      this.Tiers[dom].total += 10;
      toko.HPcount += 10;
    } //Tribal Dominance

    if (toko.aoasdate && (!toko.doOver["date"] || toko.aoasdate >= toko.doOver["date"])) {
      if (toko.aoas == 1) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2q4-5615bb15-5c36-4574-9afe-f1542a5641eb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJxNC01NjE1YmIxNS01YzM2LTQ1NzQtOWFmZS1mMTU0MmE1NjQxZWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.N9EKDK6pU40pSa6inD0CVigwplwKWoKDAi8d1PuNoXw",
          name: "Arms of Akna - Novice",
          total: 10,
          breakdown: "Novice AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 10;
        toko.HPcount += 10;
      } //novice AoAs
      else if (toko.aoas == 2) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2v9-271dcd5a-f830-4b5d-9b17-9410f73306fc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ2OS0yNzFkY2Q1YS1mODMwLTRiNWQtOWIxNy05NDEwZjczMzA2ZmMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uz_HpORQbqVq2BRW3mUUhdwmo0i7KAxAQpvUPZmZ7vQ",
          name: "Arms of Akna - Average",
          total: 10,
          breakdown: "Average AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 10;
        toko.HPcount += 10;
      } //average AoAs
      else if (toko.aoas == 3) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2x2-6186bd29-e590-4dd7-a0d0-89f57e43e870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ4Mi02MTg2YmQyOS1lNTkwLTRkZDctYTBkMC04OWY1N2U0M2U4NzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.QkJNJjsJvFdCc3RsxCCyXdbZGuJteMnSRDWOfLKjBQo",
          name: "Arms of Akna - Excellent",
          total: 15,
          breakdown: "Excellent AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 15;
        toko.HPcount += 15;
      } //excellent AoAs
    }

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
        //here we get the caving instead of the quest
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
      } //calcService.breakdown().subscribe();
      ); //obsHP.push
    } //for

  }




  //Bad code. Used to set initial HPcount values. 
  /* settingHP(toko: Tracking, hp_sheet: HP[]): void {
    let cur_hier: number = 0;

    toko.HPcount = 0;
    let obsHP: Observable<number>[] = [];

    if (toko.hierarchy > 1 && (!toko.doOver["date"] || toko.domdate >= toko.doOver["date"])) {
      let dom = 1;
      if (toko.doOver["date"] && toko.domdate >= toko.doOver["date"]) {
        dom = 0;
      }
      else if (toko.startSub) {
        dom = 2;
      }
      this.Tiers[dom].cards.push({
        link: "https://tokotna.com/tribes/index.php?tribe=Lunar+Aegis",
        source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8tc73-6ed79a74-a7ad-43aa-9120-e5efca0fdd73.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dGM3My02ZWQ3OWE3NC1hN2FkLTQzYWEtOTEyMC1lNWVmY2EwZmRkNzMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZPUSaB5aao_VFOEcGPk_-joVo6F78upbFHMq7n5lYpQ",
        name: "Tribal Dominance",
        total: 10,
        breakdown: "+10 HP to your tokota’s overall HP total when you complete its RoDs"
      });
      this.Tiers[dom].total += 10;
      toko.HPcount += 10;
    } //Tribal Dominance

    if (toko.aoasdate && (!toko.doOver["date"] || toko.aoasdate >= toko.doOver["date"])) {
      if (toko.aoas == 1) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2q4-5615bb15-5c36-4574-9afe-f1542a5641eb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJxNC01NjE1YmIxNS01YzM2LTQ1NzQtOWFmZS1mMTU0MmE1NjQxZWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.N9EKDK6pU40pSa6inD0CVigwplwKWoKDAi8d1PuNoXw",
          name: "Arms of Akna - Novice",
          total: 10,
          breakdown: "Novice AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 10;
        toko.HPcount += 10;
      } //novice AoAs
      else if (toko.aoas == 2) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2v9-271dcd5a-f830-4b5d-9b17-9410f73306fc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ2OS0yNzFkY2Q1YS1mODMwLTRiNWQtOWIxNy05NDEwZjczMzA2ZmMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uz_HpORQbqVq2BRW3mUUhdwmo0i7KAxAQpvUPZmZ7vQ",
          name: "Arms of Akna - Average",
          total: 10,
          breakdown: "Average AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 10;
        toko.HPcount += 10;
      } //average AoAs
      else if (toko.aoas == 3) {
        this.Tiers[0].cards.push({
          link: 'https://tokotna.com/imports/index.php?id=' + toko.id,
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2x2-6186bd29-e590-4dd7-a0d0-89f57e43e870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ4Mi02MTg2YmQyOS1lNTkwLTRkZDctYTBkMC04OWY1N2U0M2U4NzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.QkJNJjsJvFdCc3RsxCCyXdbZGuJteMnSRDWOfLKjBQo",
          name: "Arms of Akna - Excellent",
          total: 15,
          breakdown: "Excellent AoAs + Tribal Prestige"
        });
        this.Tiers[0].total += 15;
        toko.HPcount += 15;
      } //excellent AoAs
    }

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
      obsHP.push(new Observable<number>(obs => (
        this.calcService.breakdown(hp, toko, hp.tokos).subscribe(breakdown => {
          //here we get the caving instead of the quest
          let temp: HP_Card = {
            link: hp.link,
            source: hp.src,
            name: hp.name,
            total: breakdown.total,
            breakdown: breakdown.breakdown
          };
          obs.next(temp.total);
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
          obs.complete();
        })) //calcService.breakdown().subscribe();
      )); //obsHP.push
    } //for


     forkJoin(obsHP).subscribe(hp => {
      for (let total of hp) {
        toko.HPcount += total;
      }
      this.trackingService.setHP(toko.id, toko.HPcount);
    },
      err => console.log('Error:', err)
    ); 
  } */
}
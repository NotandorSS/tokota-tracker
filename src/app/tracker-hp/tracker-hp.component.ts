import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HP_Card } from '../hp-card';
import { HP } from '../hp';
import { Hier_Tier } from '../hier-tier';
import { TrackingService } from '../tracking.service';
import { CalculatorService } from '../calculator.service';
import { Tracking } from '../tracking';
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-tracker-hp',
  templateUrl: './tracker-hp.component.html',
  styleUrls: ['./tracker-hp.component.css']
})
export class TrackerHpComponent implements OnInit {
  toko: Tracking;
  Tiers: Hier_Tier[] = [];
  FlatCardNames: string[] = [];
  hp_sheet: HP[] = [];

  PB: boolean = false;
  WT: boolean = false;
  faction: string = "PB";

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService,
    private calcService: CalculatorService) {
  }

  ngOnInit() {
    // this.trackingService.getTracked(+this.route.snapshot.paramMap.get('id')).subscribe(toko => {
    //   this.toko = toko;
    //   this.initTiers();
    //   this.trackingService.getHP(toko.id, toko.doOver["date"]).subscribe(hp_sheet => {
    //     this.hp_sheet = hp_sheet;
    //     this.fillHP();
    //   }); //getHP subscribe
    // });//getTracked subscribe
    this.trackingService.getTracked(+this.route.snapshot.paramMap.get('id')).pipe(
      switchMap((value, index) => {
        this.toko = value;
        this.initTiers();
        return this.trackingService.getHP(value.id, value.doOver['date']);
      })
    ).subscribe(hp_sheet => {
      this.hp_sheet = hp_sheet;
      this.fillHP();
    })
  }

  initTiers(): void {
    this.Tiers = [];
    this.FlatCardNames = [];

    //if this.toko.doOver['hierarchy'] exists, that means we have a link, which means do-over was done AFTER hp confirm for dom or above.
    if (this.toko.startSub && !this.toko.doOver['hierarchy']){
      this.Tiers.push(new Hier_Tier("Sub-to_ave", 75));
    }

    if (!this.toko.doOver['hierarchy']) {
      this.Tiers.push(new Hier_Tier("Ave-to-Dom", 250));
    } //ave to dom

    if (!this.toko.doOver['hierarchy'] || this.toko.doOver['hierarchy'] == 2) {
      this.Tiers.push(new Hier_Tier("Dom-to-Alpha", 300));
      
      if (this.toko.hierarchy > 1) {
        this.addCard(this.Tiers[this.Tiers.length - 1], {
          link: "https://tokotna.com/tribes/index.php?tribe=Lunar+Aegis",
          source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8tc73-6ed79a74-a7ad-43aa-9120-e5efca0fdd73.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dGM3My02ZWQ3OWE3NC1hN2FkLTQzYWEtOTEyMC1lNWVmY2EwZmRkNzMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZPUSaB5aao_VFOEcGPk_-joVo6F78upbFHMq7n5lYpQ",
          name: "Tribal Dominance",
          total: 10,
          breakdown:"Tribal Dominance: +10 HP to your tokota’s overall HP total when you complete its RoDs"});
      }
      
    } //dom to alpha

    //unlocking slots
    const hpNeeded = this.toko.build == 3 ? 150 : 100;
    let max: number;

    if (this.toko.build == 3) {
      max = 2;
    } else if (this.toko.male && this.toko.build < 2) {
      max = 11;
    } else {
      max = 3;
    }

    for (var i = 1; i < max; i++) {
      this.Tiers.push(new Hier_Tier("Slot-Unlock-" + i, hpNeeded));
    }

  }

  fillHP(): void {
    let curTier: number = 0;

    if (this.PB || this.WT) {
      this.addCard(this.Tiers[0], {
        link: "https://tokotna.com/profile/index.php?user=secretrealm",
        source: "https://tokotna.com/css/Faction-" + this.faction + ".png",
        name: this.faction + " bonus HP",
        total: 25,
        breakdown: this.faction + " bonus HP"});
    } //faction

    if (this.toko.hpTokens > 0) {
      this.addCard(this.Tiers[0], {
        link: "https://tokotna.com/imports/index.php?id=" + this.toko.id + "#Items",
        source: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/dafys38-b6946542-adcb-4ec8-a45d-5ab991b18032.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGFmeXMzOC1iNjk0NjU0Mi1hZGNiLTRlYzgtYTQ1ZC01YWI5OTFiMTgwMzIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Iz1tch_kDTraDbSIZZvAzhlA-b5JBeivJkEYzTDKGfY",
        name: "HP Tokens",
        total: this.toko.hpTokens * 2,
        breakdown: this.toko.hpTokens + " HP Tokens/Scrolls"});
    } //hp tokens

    if (this.toko.aoasdate && (!this.toko.doOver["date"] || this.toko.aoasdate >= this.toko.doOver["date"])) {
      let aoaSource: string;
      let aoaTotal: number;
      let aoaScore: string

      if (this.toko.aoas < 3) {
        aoaTotal = 10;
        if (this.toko.aoas == 1) {
          aoaSource = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2q4-5615bb15-5c36-4574-9afe-f1542a5641eb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJxNC01NjE1YmIxNS01YzM2LTQ1NzQtOWFmZS1mMTU0MmE1NjQxZWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.N9EKDK6pU40pSa6inD0CVigwplwKWoKDAi8d1PuNoXw";
          aoaScore = "Novice";
        } else {
          aoaSource = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2v9-271dcd5a-f830-4b5d-9b17-9410f73306fc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ2OS0yNzFkY2Q1YS1mODMwLTRiNWQtOWIxNy05NDEwZjczMzA2ZmMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uz_HpORQbqVq2BRW3mUUhdwmo0i7KAxAQpvUPZmZ7vQ";
          aoaScore = "Average";
        }
      } else {
        aoaTotal = 15;
        aoaSource = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2x2-6186bd29-e590-4dd7-a0d0-89f57e43e870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ4Mi02MTg2YmQyOS1lNTkwLTRkZDctYTBkMC04OWY1N2U0M2U4NzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.QkJNJjsJvFdCc3RsxCCyXdbZGuJteMnSRDWOfLKjBQo";
        aoaScore = "Excellent";
      }

      this.addCard(this.Tiers[0], {
        link: 'https://tokotna.com/imports/index.php?id=' + this.toko.id + '#Awards',
        source: aoaSource,
        name: "Arms of Akna - " + aoaScore,
        total: aoaTotal,
        breakdown: aoaScore + " AoAs + Tribal Prestige"});
    } //AoAs

    for (let hp of this.hp_sheet) {
      //if there are at least two tokos, take out the toko we're calculating for
      if (hp.tokos.length > 1) {
        hp.tokos.splice(hp.tokos.indexOf(this.toko.id), 1);
      } else {
        hp.tokos = []
      }

      this.calcService.breakdown(hp, this.toko, hp.tokos).subscribe(data => {
        let curCard: HP_Card = {
          link: hp.link,
          source: hp.src,
          name: hp.name,
          total: data.total,
          breakdown: data.breakdown
        };
        if (curCard.source == null) {
          curCard.source = 'https://shmector.com/_ph/14/607312131.png';
        } // if there's an image link

        //if this image/lit is an activity with a value of 8 (rite) and the toko in question is participating, don't add RoDs/PotAs before the HP can actually qualify
        if (!(hp.act && hp.act.val == 8 && hp.act.ids.indexOf(this.toko.id) > -1 && ((hp.name.toUpperCase().includes("ROD") && this.toko.hierarchy < 2) || (hp.name.toUpperCase().includes("POTA") && this.toko.hierarchy < 3)))) {
          this.addCard(this.Tiers[curTier], curCard);
        }

        //replace ids in breakdown with links
        let ids = hp.tokos.concat(hp.starter);
        let newbd: string;
        for (let id of ids) {
          let tag = "~" + id + "~";
          newbd = "<a href='https://tokotna.com/imports/index.php?id=" + id + "'>" + id + "</a>";
          let replacement = curCard.breakdown.replace(tag, newbd);
          while (curCard.breakdown != replacement) {
            curCard.breakdown = curCard.breakdown.replace(tag, newbd);
            replacement = curCard.breakdown.replace(tag, newbd);
          }
        }

        //check to see if need to switch from one hierarchy tier to the next
        if (this.Tiers[curTier].total >= this.Tiers[curTier].req) {
          this.Tiers[curTier + 1].spill = this.Tiers[curTier].total - this.Tiers[curTier].req;
          curTier += 1;
          this.Tiers[curTier].total += this.Tiers[curTier].spill;
        } //switch hierarchy
      }, //calcService.breakdown().subscribe();
        err => {
          console.log(err);
        }
      ); //obsHP.push
    } //for

  }

  addCard(tier: Hier_Tier, card: HP_Card): void {
    const uniqueName = `${card.link} - ${card.name}`;
    if (!this.FlatCardNames.includes(uniqueName)){
      tier.cards.push(card);
      this.FlatCardNames.push(uniqueName);
      tier.total += card.total;
    }

  }
}
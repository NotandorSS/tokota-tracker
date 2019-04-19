import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { HP_Card } from '../hp-card';
import { Hier_Tier } from '../hier-tier';
import { TrackingService } from '../tracking.service';
import { Tracking } from '../tracking';

@Component({
  selector: 'app-tracker-hp',
  templateUrl: './tracker-hp.component.html',
  styleUrls: ['./tracker-hp.component.css']
})
export class TrackerHpComponent implements OnInit {
  id: number;
  toko: Tracking;
  Tiers: Hier_Tier[] = [];
  hp: HP_Card[] = [];

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    //this.getTracked2().subscribe(toko => this.toko = toko);
    this.getTracked();
    //get HP
    this.getHP();
    console.log("this toko", this.toko);
    this.initVars();
    console.log("this hp", this.hp);
  }

  initVars(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    //this.getTracked2().subscribe(toko => this.toko = toko);
    this.getTracked();
    //get HP
    this.getHP();
  }

  initTiers(): void {
    let temp: Hier_Tier;
    //if (this.toko.startSub) {
      temp = new Hier_Tier("Sub-to_ave", 75);
      this.Tiers.push(temp);
    //}
    temp = new Hier_Tier("Ave-to-Dom", 250);
    this.Tiers.push(temp);
    temp = new Hier_Tier("Dom-to-Alpha", 300);
    this.Tiers.push(temp);
    temp = new Hier_Tier("Alpha-Unlock-1", 100);
    this.Tiers.push(temp);
    temp = new Hier_Tier("Alpha-Unlock-2", 100);
    this.Tiers.push(temp);
  }

  getTracked(): void {
    this.trackingService.getTracked(this.id).subscribe(data => {
      if (data.exists) {
        let track = new Tracking(this.id);
        track.doOver = data.get("doOver") ? data.get("doOver") : track.doOver;
        track.build = data.get("build")?data.get("build"):track.build;
        track.companions = data.get("companions")?data.get("companions"):track.companions;
        track.startSub = data.get("startSub")?data.get("startSub"):track.startSub;
        this.toko = track;
        console.log("finished with track", this.toko);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
      err => console.log(err)
    );
  }

  getTracked2(): Observable<Tracking> {
    return new Observable<Tracking>(obs=>{
      this.trackingService.getTracked(this.id).subscribe(data => {
        if (data.exists) {
          let track = new Tracking(this.id);
          track.doOver = data.get("doOver") ? data.get("doOver") : track.doOver;
          track.build = data.get("build")?data.get("build"):track.build;
          track.companions = data.get("companions")?data.get("companions"):track.companions;
          track.startSub = data.get("startSub")?data.get("startSub"):track.startSub;
          console.log("returning? track", track);
          obs.next(track);
        } else {
          obs.next(null);
        }
      },
      err => console.log(err)
      );
    });
  }

  getHP(): void {
    this.trackingService.getHP(this.id)
      .subscribe(data => {
        data.forEach(item => {
          this.hp.push(new HP_Card(
            item.payload.doc.data()["link"],
            item.payload.doc.data()["source"],
            item.payload.doc.data()["name"]
          ));
        })
      },
        err => console.log(err)
      );
  }
}

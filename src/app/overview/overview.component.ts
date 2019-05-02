import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../tracking.service';
import {Tracking} from '../tracking';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  tokos: Tracking[]= [];
  aveHier: string = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/dd4gje3-85b92b43-114b-4049-9f20-8e904a5ebafd.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGQ0Z2plMy04NWI5MmI0My0xMTRiLTQwNDktOWYyMC04ZTkwNGE1ZWJhZmQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.7pajUTeAN49L_4XyLTPiS_rDMw6l3Ot2WUj0WxYLQQ0';
  domHier: string = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8tc73-6ed79a74-a7ad-43aa-9120-e5efca0fdd73.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dGM3My02ZWQ3OWE3NC1hN2FkLTQzYWEtOTEyMC1lNWVmY2EwZmRkNzMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZPUSaB5aao_VFOEcGPk_-joVo6F78upbFHMq7n5lYpQ';
  alphaHier: string = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/dd4gjf5-ec1e7c12-d7dc-4799-8a97-d55e43e248da.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGQ0Z2pmNS1lYzFlN2MxMi1kN2RjLTQ3OTktOGE5Ny1kNTVlNDNlMjQ4ZGEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.qsRdtHXX1VTLSt-eg6LmSP0nBzP87lFoZcCIu9lP1GU';
  
  novAoAs: string = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2q4-5615bb15-5c36-4574-9afe-f1542a5641eb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJxNC01NjE1YmIxNS01YzM2LTQ1NzQtOWFmZS1mMTU0MmE1NjQxZWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.N9EKDK6pU40pSa6inD0CVigwplwKWoKDAi8d1PuNoXw';
  aveAoAs: string = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2v9-271dcd5a-f830-4b5d-9b17-9410f73306fc.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ2OS0yNzFkY2Q1YS1mODMwLTRiNWQtOWIxNy05NDEwZjczMzA2ZmMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Uz_HpORQbqVq2BRW3mUUhdwmo0i7KAxAQpvUPZmZ7vQ';
  excAoAs: string = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59c46321-f346-4707-af69-a59f1115d95d/da8t2x2-6186bd29-e590-4dd7-a0d0-89f57e43e870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5YzQ2MzIxLWYzNDYtNDcwNy1hZjY5LWE1OWYxMTE1ZDk1ZFwvZGE4dDJ4Mi02MTg2YmQyOS1lNTkwLTRkZDctYTBkMC04OWY1N2U0M2U4NzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.QkJNJjsJvFdCc3RsxCCyXdbZGuJteMnSRDWOfLKjBQo";


  constructor(private trackingService: TrackingService) { }

  ngOnInit() {
    
    this.getTracking();
  }

  getTracking(): void {
    this.tokos = [];
    this.trackingService.getTracking()
      .subscribe(data => {
        data.forEach(item => {
          let load = item.payload.doc.data();

          let track = new Tracking(load["id"], load["male"]);
          track.doOver = load["doOver"] ? load["doOver"] : track.doOver;
          track.build = load["build"] ? load["build"] : track.build;
          track.companions = load["companions"] ? load["companions"] : track.companions;
          track.startSub = load["startSub"] ? load["startSub"] : track.startSub;
          track.aoas = load["aoas"] ? load["aoas"] : track.aoas;
          track.aoasdate = load["aoasdate"] ? load["aoasdate"] : track.aoasdate;
          track.hierarchy = load["hierarchy"] ? load["hierarchy"] : track.hierarchy;
          track.domdate = load["domdate"] ? load["domdate"] : track.domdate;
          track.bonds = load["bonds"] ? load["bonds"] : track.bonds;
          track.HPcount = load["HPcount"] ? load["HPcount"] : track.HPcount;

          this.tokos.push(track);
        })
        //DO Stuff
      },
        err => console.log(err)
      );
  }
}
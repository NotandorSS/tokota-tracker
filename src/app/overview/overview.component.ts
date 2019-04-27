import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  ids: number[]/*  = [
    17078, 28864, 35123, 35230
  ] */;

  constructor(private trackingService: TrackingService) { }

  ngOnInit() {
    this.getTracking();
  }

  getTracking(): void {
    this.ids = [];
    this.trackingService.getTracking()
      .subscribe(data => {
        data.forEach(item => {
          this.ids = this.ids.concat([item.payload.doc.data()["id"]]);
        })
      },
        err => console.log(err)
      );
  }
}
import { Component, OnInit } from '@angular/core';

import { HP, Tokota, TokoSpef } from '../hp';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-hp-form',
  templateUrl: './hp-form.component.html',
  styleUrls: ['./hp-form.component.css']
})
export class HpFormComponent implements OnInit {

  model = new HP();
  submitted = false;

  constructor(private trackingService: TrackingService) { }

  ngOnInit() {
    this.newForm();
  }


  onSubmit() {
    this.submitted = true;
    console.log(this.model);
    //database stuff here?
    this.trackingService.addHP(this.model);
  }

  newForm() {
    this.model = new HP();
    this.model.tokotas = new Array(new Tokota());
    this.model.wc = new TokoSpef();
    this.model.act = new TokoSpef();
    this.model.quest = new TokoSpef();
  }

  tokoCount() {
    this.model.tokotas = new Array(new Tokota());
    for (var i = 0; i < this.model.count-1; i++) {
      this.model.tokotas = this.model.tokotas.concat(new Array(new Tokota()));
    }
  }

}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Form } from '@angular/forms';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-new-hp',
  templateUrl: './new-hp.component.html',
  styleUrls: ['./new-hp.component.css']
})
export class NewHpComponent implements OnInit {
  hpForm = this.fb.group({
    link: [''],
    src: [''],
    date: [''],
    artists: this.fb.array([ this.fb.control(''), ]),
    tokos: this.fb.array([ this.fb.control(''), ]),
    qual: [2],
    headtokos: this.fb.array([
      this.fb.control(''),
    ]),
    bg: [true],
    actival: [''],
    actokos: this.fb.array([
      this.fb.control(''),
    ]),
    wc: [''],
    wctokos: this.fb.array([
      this.fb.control(''),
    ]),
    starter: [''],
    lore: [''],
    handler: [''],
    companions: this.fb.array([
      this.fb.control(''),
    ]),
    arpg: this.fb.array([
      this.fb.control(''),
    ]),
    showplaces: this.fb.array([
      this.fb.control(''),
    ]),
    showtokos: this.fb.array([
      this.fb.control(''),
    ]),
    showlinks: this.fb.array([
      this.fb.control(''),
    ]),
    quest: [''],
    qlhp: this.fb.array([
      this.fb.control(''),
    ]),
    qltokos: this.fb.array([
      this.fb.control(''),
    ]),
    qlinks: this.fb.array([
      this.fb.control(''),
    ]),
  });

  showHSs = false;

  get artists() {
    return this.hpForm.get('artists') as FormArray;
  }

  get actival() {
    return this.hpForm.get('actival') as FormControl;
  }

  get tokos() {
    return this.hpForm.get('tokos') as FormArray;
  }

  get headtokos() {
    return this.hpForm.get('headtokos') as FormArray;
  }

  get actokos() {
    return this.hpForm.get('actokos') as FormArray;
  }

  get companions() {
    return this.hpForm.get('companions') as FormArray;
  }

  get qual() {
    return this.hpForm.get('qual') as FormControl;
  }

  get wctokos() {
    return this.hpForm.get('wctokos') as FormArray;
  }

  get arpg() {
    return this.hpForm.get('arpg') as FormArray;
  }

  get showplaces() {
    return this.hpForm.get('showplaces') as FormArray;
  }

  get showtokos() {
    return this.hpForm.get('showtokos') as FormArray;
  }

  get showlinks() {
    return this.hpForm.get('showlinks') as FormArray;
  }

  get qlhp() {
    return this.hpForm.get('qlhp') as FormArray;
  }

  get qltokos() {
    return this.hpForm.get('qltokos') as FormArray;
  }

  get qlinks() {
    return this.hpForm.get('qlinks') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private ts: TrackingService,
    private rend: Renderer2
  ) { }

  addArtist() {
    this.artists.push(this.fb.control(''));
  }

  addToko() {
    this.tokos.push(this.fb.control(''));
    this.headtokos.push(this.fb.control(''));
    this.actokos.push(this.fb.control(''));
    this.wctokos.push(this.fb.control(''));
  }

  addCompanion() {
    this.companions.push(this.fb.control(''));
  }

  addArpg() {
    if (this.arpg.length < 3) {
      this.arpg.push(this.fb.control(''));
    }
  }

  addShow() {
    this.showlinks.push(this.fb.control(''));
    this.showplaces.push(this.fb.control(''));
    this.showtokos.push(this.fb.control(''));
  }

  addQl() {
    this.qlhp.push(this.fb.control(''));
    this.qlinks.push(this.fb.control(''));
    this.qltokos.push(this.fb.control(''));
  }

  showHeadshots() {
    this.showHSs = !this.showHSs;
  }

  ngOnInit() {
  }

  onSubmit(): void {
    let hp = this.hpForm.value;

    let link = hp.link;
    let docID: string = link.slice(-9);
    let name = '';
    try {
      name = link.slice(link.indexOf('/art/') + 5, -10)
    } catch {
      name = "sta.sh"
    }

    let actIDs = [];
    let wcIDs = [];
    let headIDs = [];

    for (let i = 0; i < hp.tokos.length; i++) {
      hp.tokos[i] = +hp.tokos[i];
    }

    for (let i = 0; i < hp.actokos.length; i++) {
      if (hp.actokos[i]) {
        actIDs.push(hp.tokos[i]);
      }
    }

    for (let i = 0; i < hp.wctokos.length; i++) {
      if (hp.wctokos[i]) {
        wcIDs.push(hp.tokos[i]);
      }
    }

    for (let i = 0; i < hp.headtokos.length; i++) {
      if (hp.headtokos[i]) {
        headIDs.push(hp.tokos[i]);
      }
    }

    let data = {
      'link': link,
      'name': name,
      'date': hp.date,
      'artists': hp.artists,
      'tokos': hp.tokos,
    }

    if (hp.actival != '') {
      data['act'] = {
        'val': +hp.actival,
        'ids': actIDs
      }
    }

    if (hp.qual != '') {
      data['qual'] = +hp.qual;
      data['bg'] = hp.bg;
      data['hs'] = headIDs;
      if (hp.wc > 0 && wcIDs.length > 0) {
        data['wc'] = {
          'val': +hp.wc,
          'ids': wcIDs
        }
      }
    } else {
      data['wc'] = {
        'val': +hp.wc,
        'ids': hp.tokos
      }
    }

    if (hp.src) {
      data['src'] = hp.src;
    }

    if (hp.starter != '') {
      data['starter'] = +hp.starter;
    }

    if (hp.handler) {
      data['handler'] = true;
    }

    if (hp.lore != '') {
      data['lore'] = hp.lore;
    }

    if (hp.companions[0] != '') {
      data['companions'] = hp.companions;
    }

    if (hp.arpg[0] != '') {
      data['arpg'] = hp.arpg;
    }

    if (hp.showlinks[0] != '' && hp.showplaces[0] != '' && hp.showtokos[0] != '') {
      data['show'] = {};
      for (let i = 0; i < hp.showlinks.length; i++) {
        data['show'][hp.showtokos[i]] = {
          'val': +hp.showplaces[i],
          'link': hp.showlinks[i],
          'id': +hp.showtokos[i]

        }
      }
    }

    if (hp.qlinks[0] != '' && hp.qlhp[0] != '' && hp.qltokos[0] != '') {
      data['QL'] = {};
      for (let i = 0; i < hp.qlinks.length; i++) {
        data['QL'][hp.qltokos[i]] = {
          'val': +hp.qlhp[i],
          'link': hp.qlinks[i],
          'id': +hp.qltokos[i]
        }
      }
    }

    this.ts.addHP(data, docID);
    this.clear_form();
  }

  clear_form(){
    this.hpForm.patchValue({
      link: '',
      src: '',
      wc: ''
    })
  }

  activity(mer: number) {
    return Activity[mer];
  }
}

enum Activity {
  Hunt = 1,
  Fish,
  Explore,
  Cave,
  Dive,
  Breed,
  Heal,
  Rite,
  Show,
  Event
}
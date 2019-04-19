import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerHpComponent } from './tracker-hp.component';

describe('TrackerHpComponent', () => {
  let component: TrackerHpComponent;
  let fixture: ComponentFixture<TrackerHpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerHpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerHpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

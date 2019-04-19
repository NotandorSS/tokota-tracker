import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpFormComponent } from './hp-form.component';

describe('HpFormComponent', () => {
  let component: HpFormComponent;
  let fixture: ComponentFixture<HpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHpComponent } from './new-hp.component';

describe('NewHpComponent', () => {
  let component: NewHpComponent;
  let fixture: ComponentFixture<NewHpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

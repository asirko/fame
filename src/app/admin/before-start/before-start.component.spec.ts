import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeStartComponent } from './before-start.component';

describe('BeforeStartComponent', () => {
  let component: BeforeStartComponent;
  let fixture: ComponentFixture<BeforeStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeforeStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

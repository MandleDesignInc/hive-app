import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualConferenceComponent } from './virtual-conference.component';

describe('VirtualConferenceComponent', () => {
  let component: VirtualConferenceComponent;
  let fixture: ComponentFixture<VirtualConferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualConferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

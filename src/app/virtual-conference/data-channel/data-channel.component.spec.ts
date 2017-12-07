import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChannelComponent } from './data-channel.component';

describe('DataChannelComponent', () => {
  let component: DataChannelComponent;
  let fixture: ComponentFixture<DataChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

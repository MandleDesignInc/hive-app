import { TestBed, inject } from '@angular/core/testing';

import { AppBarService } from './app-bar.service';

describe('AppBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppBarService]
    });
  });

  it('should be created', inject([AppBarService], (service: AppBarService) => {
    expect(service).toBeTruthy();
  }));
});

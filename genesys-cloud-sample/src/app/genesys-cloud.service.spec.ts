import { TestBed } from '@angular/core/testing';

import { GenesysCloudService } from './genesys-cloud.service';

describe('GenesysCloudService', () => {
  let service: GenesysCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenesysCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

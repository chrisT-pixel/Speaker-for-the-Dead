import { TestBed } from '@angular/core/testing';

import { VoiceReconService } from './voice-recon.service';

describe('VoiceReconService', () => {
  let service: VoiceReconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceReconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

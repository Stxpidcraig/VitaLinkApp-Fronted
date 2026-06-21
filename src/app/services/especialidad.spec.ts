import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EspecialidadService } from './especialidad';

describe('EspecialidadService', () => {
  let service: EspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(EspecialidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
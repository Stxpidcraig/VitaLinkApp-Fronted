import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspecialidadesComponent } from './especialidades';

describe('EspecialidadesComponent', () => {
  let component: EspecialidadesComponent;
  let fixture: ComponentFixture<EspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialidadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EspecialidadesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
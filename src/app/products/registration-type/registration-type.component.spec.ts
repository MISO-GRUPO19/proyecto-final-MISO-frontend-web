import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationTypeComponent } from './registration-type.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';

describe('RegistrationTypeComponent', () => {
  let component: RegistrationTypeComponent;
  let fixture: ComponentFixture<RegistrationTypeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RegistrationTypeComponent],
      providers: [
        provideToastr(),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Función registroInd debe navegar a product-registration', () => {
    component.registroInd();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['product-registration']);
  });

  it('Función registroBulk debe navegar a bulk-registration', () => {
    component.registroBulk();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['bulk-registration']);
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuLateralComponent } from './menu-lateral.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

describe('MenuLateralComponent', () => {
  let component: MenuLateralComponent;
  let fixture: ComponentFixture<MenuLateralComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['use']);

    await TestBed.configureTestingModule({
      imports: [MenuLateralComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar al menú con menu()', () => {
    component.menu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['menu']);
  });

  it('debería navegar a productos con productos()', () => {
    component.productos();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['productos']);
  });

  it('debería navegar a vendedores con vendedores()', () => {
    component.vendedores();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['seller-registration']);
  });

  it('debería navegar a proveedores con suppliers()', () => {
    component.suppliers();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['supplier-registration']);
  });

  it('debería navegar a ajustes con ajustes()', () => {
    component.ajustes();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['ajustes']);
  });

  it('debería navegar a reporte de ventas con reports()', () => {
    component.reports();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['sellers-reports']);
  });

  it('debería navegar a metas con goals()', () => {
    component.goals();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['goals']);
  });

  it('debería navegar a rutas con rutas()', () => {
    component.rutas();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['routes']);
  });

  it('debería cerrar sesión y mostrar toast en logout()', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith('Sesión cerrada con éxito');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});


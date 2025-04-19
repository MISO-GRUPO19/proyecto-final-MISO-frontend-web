import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '../i18n.module';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarraSuperiorComponent } from './barra-superior.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('BarraSuperiorComponent', () => {
  let component: BarraSuperiorComponent;
  let fixture: ComponentFixture<BarraSuperiorComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BarraSuperiorComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        I18nModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarraSuperiorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate if value is empty', () => {
    component.searchForm.setValue({ value: '', type: 'barcode' });
    component.onSubmit();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to product-search with queryParams if value is present', () => {
    component.searchForm.setValue({ value: '12345', type: 'barcode' });
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['product-search'], {
      queryParams: { value: '12345', type: 'barcode' }
    });
  });
});

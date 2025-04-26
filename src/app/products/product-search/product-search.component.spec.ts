import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductSearchComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    sessionStorage.setItem('access_token', 'mock-token');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if token is missing', () => {
    sessionStorage.removeItem('access_token');

    component.productSearchForm.setValue({ value: '123', type: 'barcode' });
    component.onSearch();

    expect(toastrService.error).toHaveBeenCalledWith('ERRORES.NoAuth', 'Error');
  });

  it('getLabelText should return correct translation key', () => {
    component.productSearchForm.setValue({ value: '', type: 'name' });
    expect(component.getLabelText()).toBe('BUSQUEDA_PRODUCTO.NOMBRE');

    component.productSearchForm.setValue({ value: '', type: 'barcode' });
    expect(component.getLabelText()).toBe('BUSQUEDA_PRODUCTO.ID_PRODUCTO');
  });

  it('formatAddress should return formatted location and street', () => {
    const result = component.formatAddress('Calle 1 #2-3, Bogotá, Colombia');
    expect(result.location).toBe('Bogotá - Colombia');
    expect(result.street).toBe('Calle 1 #2-3');
  });

  it('should make an HTTP GET request and set product when data is valid', () => {
    const response = {
      product_info: {
        product_name: 'Leche',
        product_weight: '1L',
        product_provider_name: 'Proveedor X',
        product_price: '5.00',
        product_category: 'Lácteos'
      },
      warehouse_info: [
        {
          warehouse_name: 'Bodega Central',
          warehouse_address: 'Calle 1 #2-3, Bogotá, Colombia',
          aisle: '5',
          shelf: 'A',
          level: 1,
          quantity: 50
        }
      ]
    };

    spyOn(component['http'], 'get').and.returnValue(of(response));

    component.productSearchForm.setValue({ value: 'TestProduct', type: 'barcode' });
    component.onSearch();

    expect(component.product?.name).toBe('Leche');
  });

  it('should show warning if product_info or warehouse_info is missing', () => {
    const response = { warehouse_info: [] };
    spyOn(component['http'], 'get').and.returnValue(of(response));

    component.productSearchForm.setValue({ value: 'TestProduct', type: 'barcode' });
    component.onSearch();

    expect(toastrService.warning).toHaveBeenCalledWith('BUSQUEDA_PRODUCTO.ERRORES.El producto no existe', 'Aviso');
    expect(component.product).toBeNull();
  });

  it('should show error if response has error message', () => {
    const response = { error: 'El producto no existe' };
    spyOn(component['http'], 'get').and.returnValue(of(response));

    component.productSearchForm.setValue({ value: 'TestProduct', type: 'barcode' });
    component.onSearch();

    expect(toastrService.error).toHaveBeenCalledWith('El producto no existe', 'Error');
    expect(component.product).toBeNull();
  });

  it('should not perform search if value is empty', () => {
    const httpGetSpy = spyOn(component['http'], 'get');
  
    component.productSearchForm.setValue({ value: '   ', type: 'barcode' });
  
    component.onSearch();
  
    expect(httpGetSpy).not.toHaveBeenCalled();
    expect(toastrService.error).not.toHaveBeenCalled(); // ya está espiado
  });

  it('getLevelLabel should return "Desconocido" for unknown level', () => {
    const result = component.getLevelLabel(99); // Nivel fuera del switch
    expect(result).toBe('Desconocido');
  });

  it('should show error message if HTTP request fails', () => {
    const errorResponse = {
      error: { error: 'Fallo de red simulado' }
    };
  
    spyOn(component['http'], 'get').and.returnValue(throwError(() => errorResponse));
  
    component.productSearchForm.setValue({ value: 'TestProduct', type: 'barcode' });
    component.onSearch();
  
    expect(toastrService.error).toHaveBeenCalledWith('Fallo de red simulado', 'Error');
    expect(component.product).toBeNull();
  });

  it('getLevelLabel should return "Desconocido" for unknown level', () => {
    const label = component.getLevelLabel(999); // nivel inválido
    expect(label).toBe('Desconocido');
  });
  
  it('should show default error message if HTTP request fails without error message', () => {
    const httpSpy = spyOn(component['http'], 'get').and.callFake(() => {
      return {
        subscribe: ({ error }: any) => {
          error({ status: 500, error: {} });
        }
      } as any;
    });
  
    component.productSearchForm.setValue({ value: 'TestProduct', type: 'barcode' });
    component.onSearch();
  
    expect(toastrService.error).toHaveBeenCalledWith('Ocurrió un error al buscar el producto', 'Error');
  });

  it('should return correct label for level 1', () => {
    const label = component.getLevelLabel(1);
    expect(label).toBe('BUSQUEDA_PRODUCTO.NIVEL_BAJO');
  });

  it('should return correct label for level 2', () => {
    const label = component.getLevelLabel(2);
    expect(label).toBe('BUSQUEDA_PRODUCTO.NIVEL_MEDIO');
  });
  
  it('should return correct label for level 3', () => {
    const label = component.getLevelLabel(3);
    expect(label).toBe('BUSQUEDA_PRODUCTO.NIVEL_ALTO');
  });
  
});
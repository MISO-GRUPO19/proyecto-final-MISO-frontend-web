import { TestBed } from '@angular/core/testing';
import { ManufacturerService } from './manufacturer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('ManufacturerService', () => {
  let service: ManufacturerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ManufacturerService]
    });
    service = TestBed.inject(ManufacturerService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener la lista de fabricantes con el token en headers', () => {
    const dummyManufacturers = [
      { id: '1', name: 'Fabricante A' },
      { id: '2', name: 'Fabricante B' }
    ];

    sessionStorage.setItem('access_token', 'token-test');

    service.getManufacturers().subscribe((res) => {
      expect(res).toEqual(dummyManufacturers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/manufacturers`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-test');
    req.flush(dummyManufacturers);
  });
});

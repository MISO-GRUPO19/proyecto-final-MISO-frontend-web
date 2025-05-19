import { TestBed } from '@angular/core/testing';
import { GoalsService } from './goals.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('GoalsService', () => {
  let service: GoalsService;
  let httpMock: HttpTestingController;

  const fakeToken = 'fake-token';
  const headers = {
    Authorization: `Bearer ${fakeToken}`
  };

  beforeEach(() => {
    sessionStorage.setItem('access_token', fakeToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GoalsService]
    });

    service = TestBed.inject(GoalsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a goal', () => {
    const mockData = {
      vendedorUUID: 'abc123',
      metas: [{ producto: 'p1', cantidad: 10 }]
    };

    service.createGoal(mockData).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/goals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush({});
  });

  it('should send a GET request to fetch sellers', () => {
    service.getSellers().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/users/sellers`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush([]);
  });

  it('should send a GET request to fetch products', () => {
    service.getProducts().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush([]);
  });
});

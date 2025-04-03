import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const dummyResponse = {
    access_token: 'token123',
    refresh_token: 'refresh123',
    user: { email: 'test@example.com' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería realizar el login y guardar los tokens en sessionStorage', () => {
    const credentials = { email: 'test@example.com', password: '123456' };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
      expect(sessionStorage.getItem('access_token')).toBe('token123');
      expect(sessionStorage.getItem('refresh_token')).toBe('refresh123');
      expect(JSON.parse(sessionStorage.getItem('user')!)).toEqual(dummyResponse.user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('debería limpiar sessionStorage al hacer logout', () => {
    sessionStorage.setItem('access_token', 'token123');
    service.logout();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });

  it('debería retornar el token de acceso', () => {
    sessionStorage.setItem('access_token', 'abc123');
    expect(service.getAccessToken()).toBe('abc123');
  });

  it('debería verificar si el usuario está logueado', () => {
    expect(service.isLoggedIn()).toBeFalse();
    sessionStorage.setItem('access_token', 'token123');
    expect(service.isLoggedIn()).toBeTrue();
  });
});

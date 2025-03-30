import { Routes } from '@angular/router';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { loginRedirectGuard } from './core/guards/login-redirect.guard';
import { adminOnlyGuard } from './core/guards/admin-only.guard';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';

export const routes: Routes = [
    { path: '', component: UserLoginComponent, pathMatch: 'full',  canActivate: [loginRedirectGuard] },
    { path: 'menu', component: BienvenidaComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
];

import { Routes } from '@angular/router';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';

export const routes: Routes = [
    { path: '', component: UserLoginComponent, pathMatch: 'full' },
    { path: 'menu', component: MenuLateralComponent, pathMatch: 'full'},
];

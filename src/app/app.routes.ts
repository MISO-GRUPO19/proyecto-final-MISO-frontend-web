import { Routes } from '@angular/router';
import { loginRedirectGuard } from './core/guards/login-redirect.guard';
import { adminOnlyGuard } from './core/guards/admin-only.guard';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { ProductRegistrationComponent } from './products/product-registration/product-registration.component';
import { RegistrationTypeComponent } from './products/registration-type/registration-type.component';
import { SellerRegistrationComponent } from './sellers/seller-registration/seller-registration.component';
import { SupplierRegistrationComponent } from './supplier/supplier-registration/supplier-registration.component';
import { AjustesComponent } from './ajustes/ajustes.component';


export const routes: Routes = [
    { path: '', component: UserLoginComponent, pathMatch: 'full',  canActivate: [loginRedirectGuard]}, //, canActivate: [loginRedirectGuard]
    { path: 'menu', component: BienvenidaComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
    { path: 'product-registration', component: ProductRegistrationComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
    { path: 'productos', component: RegistrationTypeComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
    { path: 'seller-registration', component: SellerRegistrationComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
    { path: 'supplier-registration', component: SupplierRegistrationComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] },
    { path: 'ajustes', component: AjustesComponent, pathMatch: 'full', canActivate: [adminOnlyGuard] }
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserLoginComponent } from './user-login/user-login.component';

@NgModule({
  imports: [
    CommonModule, UserComponent, UserLoginComponent
  ],
  declarations: [],
  exports: [UserLoginComponent]
})
export class UserModule { }

/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { HelpComponent } from '../help/help.component';

/**
 * Creates an array of login child route
 */
const routes: Routes = [
  {

    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'help',
        component: HelpComponent
      }
    ]
  }
];

/**
 * @NgModule decorator with its metadata for login
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Create routing module for login
 */
export class LoginRoutingModule { }

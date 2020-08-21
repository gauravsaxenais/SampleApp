/**
 * Import dependencies
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFooterComponent } from './shared/login-footer/login-footer.component';
import { LoginHeaderComponent } from './shared/login-header/login-header.component';
import { DialogModalModule } from 'src/app/shared/components/dialog-modal/dialog-modal.module';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatInputModule, MatSliderModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { HelpModule } from '../help/help.module';

/**
 * @NgModule decorator with its metadata for login
 */
@NgModule({
  declarations: [LoginFooterComponent, LoginHeaderComponent, LoginComponent, LoginLayoutComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    DialogModalModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSliderModule,
    TranslateModule,
    HelpModule
  ]
})

/**
 * Create module for login
 */
export class LoginModule { }

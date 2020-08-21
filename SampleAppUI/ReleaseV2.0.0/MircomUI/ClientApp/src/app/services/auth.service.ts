/**
 * Import dependencies
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class AuthService {

  /**
   * Inject the services in the constructor
   */
  constructor(
    private myRoute: Router,
    private local: LocalStorageService,
  ) { }

  /**
   * Validate logined user
   */
  isLoggedIn() {
    return this.local.getToken() !== null;
  }

  /**
   * Remove local storage on logout
   */
  logout() {
    this.local.removeValues();
    this.myRoute.navigate(['']);
  }
}

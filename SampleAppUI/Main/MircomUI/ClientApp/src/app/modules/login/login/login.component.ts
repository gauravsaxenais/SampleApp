/**
 * Import dependencies
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { UtilsService } from 'src/app/services/utility.services';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Create login component
 */
export class LoginComponent implements OnInit {

  /**
   * variables declaration
   */
  data: any = {};
  errorMessage: string;
  isError = false;
  eventData: any;

  /**
   * Inject the services in the constructor
   */
  constructor(
    private httpService: HttpService,
    private router: Router,
    private local: LocalStorageService,
    private util: UtilsService
  ) {}

  /**
   * OnInit - Add delay time to show login pannel
   */
  ngOnInit() {
    /**
     * Get or set local language
     */
    this.util.getSetLanguage();

    const card = document.getElementsByClassName('card')[0];
    setTimeout(function() {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 700);
  }

  /**
   * Login submit buttion event to validate the user and store token
   */
  onSubmitted() {
    this.httpService.postRequest(urls.login, this.data).subscribe(
      (res: any) => {
        if (res.data != null && res.success) {
          this.local.sendToken(res.data.accessToken.token);
          this.local.sendUser(this.data.username);

          /**
           * redirect to sites list view
           */
          this.router.navigate(['/site']);
        } else {
          this.errorMessage = res.message.description;
          this.isError = true;
        }
      },
      (err: any) => {
        if (err.error != null && err.error.message != null) {
          this.errorMessage = err.error.message.description;
          this.isError = true;
        }
      }
    );
  }

}

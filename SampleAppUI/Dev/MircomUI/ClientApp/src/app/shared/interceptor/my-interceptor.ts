import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { of } from 'rxjs/observable/of';
import { LocalStorageService } from '../../services/localStorage.service';
import { AuthService } from '../../services/auth.service';

@Injectable()

export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    private local: LocalStorageService,
    private auth: AuthService
  ) { }

  /**
   * Intercept the language and bearer token to header
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.local.getToken();
    let language: string = this.local.getLanguage();
    if (!language) {
      language = 'en';
    }

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    request = request.clone({ headers: request.headers.set('Accept-Language', language) });


    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    },
      (err: any) => {
        if (err.status === 401) {
          /**
           * if you've caught / handled the error, you don't
           * want to rethrow it unless you also want
           * downstream consumers to have to handle it as
           * well.
           */

          this.auth.logout();
        }
        throw err;
      }
    );
  }

}

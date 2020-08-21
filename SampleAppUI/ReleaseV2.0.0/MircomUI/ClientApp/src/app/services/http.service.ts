 /**
  * Import dependencies
  */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ConfigService } from '../services/config.service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  /**
   * Inject the services in the constructor
   */
  constructor(
    private httpClient: HttpClient,
    private config: ConfigService
  ) { }

  /**
   * Create http request for delete
   * @param url
   * @param body
   */
  deleteRequest(url, body) {
    return this.httpClient.delete(this.config.getConfig().apiUrl + url, body).pipe(
      map(data => data)
    );
  }

  /**
   * Create http request for get
   * @param url
   * @param body
   */
  getRequest(url: string, body?: any) {
    return this.httpClient.get(this.config.getConfig().apiUrl + url, body).pipe(
      map(data => data)
    );
  }

  /**
   * Create http request for post
   * @param url
   * @param body
   */
  postRequest(url: string, body: any) {
    return this.httpClient.post(this.config.getConfig().apiUrl + url, body).pipe(
      map(data => data),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * Create http request for put
   * @param url
   * @param body
   */
  putRequest(url: string, body: any) {
    return this.httpClient.put(this.config.getConfig().apiUrl + url, body).pipe(
      map(data => data)
    );
  }


}

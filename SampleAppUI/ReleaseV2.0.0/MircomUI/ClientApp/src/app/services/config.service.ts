import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {
  private appConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(environment.configJsonUrl)
      .toPromise()
      .then(data => {
        this.appConfig = data;
        localStorage.setItem('googleApiKey', this.appConfig.googleApiKey);
      });
  }

  getConfig() {
    return this.appConfig;
  }
}

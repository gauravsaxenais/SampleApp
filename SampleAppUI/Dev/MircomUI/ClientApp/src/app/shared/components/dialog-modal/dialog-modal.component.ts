import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Languages, RefreshScreenListOnLanguage } from 'src/app/shared/enums';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {
  message: string;
  modalTitle: string;
  selectedLanguage: any;
  okValue: string;
  cancelValue: string;
  languageTypes: any;
  refreshScreensListEnum = RefreshScreenListOnLanguage;
  refreshScreensList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService, private local: LocalStorageService, private router: Router) {
    this.modalTitle = data.title;
    this.message = data.message;
    this.okValue = data.okValue;
    this.cancelValue = data.cancelValue;
  }

  /**
   * useLanguage
   * @param selectedLanguage
   */
  useLanguage(selectedLanguage) {
    this.selectedLanguage = selectedLanguage;
  }

  /**
   * changeLanguage - used to set language dynamically
   * @param ev
   */
  changeLanguage(ev) {
    this.local.sendLanguage(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
    this.onRefresh();

  }

  ngOnInit() {
    this.refreshScreensList = this.RefreshScreenListOnLanguageKeys();
    let localLanguage = this.local.getLanguage();
    if (!localLanguage) {
      localLanguage = 'en';
    }
    this.selectedLanguage = localLanguage;
    this.languageTypes = this.objectValues(Languages);
  }

  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; };
    const currentUrl = this.router.url + '?';
    let isFound = false;
    this.refreshScreensList.forEach(screen => {
      if (!isFound && currentUrl.toLowerCase().includes(screen.toLowerCase())) {
        isFound = true;
        this.router.navigateByUrl(currentUrl)
          .then(() => {
            this.router.navigated = false;
            this.router.navigate([this.router.url]);
          });
      }
    });

  }

  /**
   * RefreshScreenListOnLanguage - List of menu to display for floor actions
   * @returns list of menu items
   */
  RefreshScreenListOnLanguageKeys(): Array<string> {
    const keys = Object.keys(this.refreshScreensListEnum);
    return keys.slice(keys.length / 2);
  }

  /**
   * @param obj
   * Format the object to bind in language dropdown
   */
  private objectValues(obj) {
    const res = [];
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        res.push(obj[i]);
      }
    }
    return res;
  }

}

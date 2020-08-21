import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Languages } from 'src/app/shared/enums';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService, private local: LocalStorageService) {
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
  }

  ngOnInit() {
    let localLanguage = this.local.getLanguage();
    if (!localLanguage) {
      localLanguage = 'en';
    }
    this.selectedLanguage = localLanguage;
    this.languageTypes = this.objectValues(Languages);
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

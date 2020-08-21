import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { DialogModalComponent } from 'src/app/shared/components/dialog-modal/dialog-modal.component';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-header',
  templateUrl: './job-header.component.html',
  styleUrls: ['./job-header.component.css']
})
export class JobHeaderComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.utilsService.getSetLanguage();
  }

  /**
   * Log out to logined user
   */
  logout() {
    this.auth.logout();
  }

  /**
   * Disable right click on mentu
   */
  onRightClick(e) {
    return false;
  }

  /**
   * Popup login pannel
   */
  openModal() {
    const messageVal: any = this.translate.get('loginHeader.pleaseSelectALanguage');
    const languagesVal: any = this.translate.get('loginHeader.languages');
    const cancelVal: any = this.translate.get('loginHeader.cancel');
    const oKVal: any = this.translate.get('loginHeader.oK');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = '400px';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      id: 1,
      title: languagesVal.value,
      message: messageVal.value,
      cancelValue: cancelVal.value,
      okValue: oKVal.value
    };
    const dialogRef = this.dialog.open(DialogModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

/**
 * Import dependencies
 */
import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogModalComponent } from 'src/app/shared/components/dialog-modal/dialog-modal.component';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css']
})

/**
 * Create login header component
 */
export class LoginHeaderComponent implements OnInit {

  /**
   * Creates an instance of classes
   */
  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  /**
   * Initialization of page
   */
  ngOnInit() {
    this.utilsService.getSetLanguage();
  }

  /**
   * To open the dialog box for language
   */
  openModal() {
    const messageVal: any = this.translate.get('loginHeader.pleaseSelectALanguage');
    const languagesVal: any = this.translate.get('loginHeader.languages');
    const cancelVal: any = this.translate.get('loginHeader.cancel');
    const oKVal: any = this.translate.get('loginHeader.oK');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'auto';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      id: 1,
      title: languagesVal.value,
      message: messageVal.value,
      cancelValue: cancelVal.value,
      okValue: oKVal.value
    };
    console.log(dialogConfig);
    const dialogRef = this.dialog.open(DialogModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

/**
 * Import dependencies
 */
import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogModalComponent } from 'src/app/shared/components/dialog-modal/dialog-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-monitoring-header',
  templateUrl: './monitoring-header.component.html',
  styleUrls: ['./monitoring-header.component.css']
})

/**
 * Create access header component
 */
export class MonitoringHeaderComponent implements OnInit {

  /**
   * @param dialog
   * @param auth
   * Inject the services in the constructor
   */
  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  /**
   * Log out to logined user
   */
  logout() {
    this.auth.logout();
  }

  /**
   * Initilize the objects
   */
  ngOnInit() {
    this.utilsService.getSetLanguage();
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
    const messageVal: any = this.translate.get('monitoringHeader.pleaseSelectALanguage');
    const languagesVal: any = this.translate.get('monitoringHeader.languages');
    const cancelVal: any = this.translate.get('monitoringHeader.cancel');
    const oKVal: any = this.translate.get('monitoringHeader.oK');

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

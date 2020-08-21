/**
 * Import dependencies
 */
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Router } from '@angular/router';
import { ActionType, SiteExportFrom } from 'src/app/shared/enums';
import swal from 'sweetalert2';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.css']
})

/**
 * Create site edit component
 */
export class SiteEditComponent implements OnInit {
  /**
   * Variables declaration
   */
  @ViewChild('table', { static: true }) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'description', 'editAction', 'reorderAction'];
  dataSource: any = new MatTableDataSource([]);
  selectedSiteId: any;
  siteData: any = {};
  sitesList: any = [];
  actionType = ActionType;
  deletedSites = [];
  loggedInUser: any;
  errorMessageFromApi: any;
  sitesListFromDb: any = [];
  errorMessageOnSitePopUp: any;
  templates: any = [];
  siteExportFrom = SiteExportFrom;
  hideExportFrom: boolean;
  allowedExtensions = ['t3'];
  errorMessageOnImportFile = '';

  /**
   * Inject the services in the constructor
   * @param local
   * @param httpService
   * @param router
   * @param ref
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  /**
   * OnInit - Get sites data
   */
  ngOnInit() {
    /**
     * Get or set local language
     */
    this.utilsService.getSetLanguage();
    /**
     * fetch user and site id from local storage
     */
    this.loggedInUser = this.local.getUser();
    this.selectedSiteId = this.local.getSiteId();
    this.getSites();
  }


  getTemplatesList() {
    const promise = new Promise((resolve, reject) => {
      const url = urls.templates;
      this.httpService.getRequest(url).subscribe((response: any) => {
        if (response.success && response.data != null) {
          // response ok
          this.templates = response.data;
          resolve();
        } else if (!response.success) {
        }
      }, (error) => {
        // error
      });
    });
    return promise;
  }


  bindTemplateDataOnSiteAdd() {
    this.siteData.templateId = this.templates[0].id;
    this.bindDataInModel(this.templates[0]);
  }

  /**
   * dropTable - this function is used to reorder the row (change the position of sites)
   * @param event
   */
  dropTable(event: CdkDragDrop<any[]>) {
    const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
    this.bindDataSource(this.dataSource.data, true);
  }

  /**
   * calculateSiteOrder - this function is used to calculate the order of rows
   */
  calculateSiteOrder() {
    this.dataSource.data.forEach((siteItem, index) => {
      if (siteItem.action !== ActionType.Delete) {
        siteItem.order = index;
        siteItem.serialNo = index + 1;
        if (siteItem.existInDb) {
          siteItem.action = ActionType.Update;
        }
      }
    });
  }

  /**
   * onAddUpdateSiteDetails
   * add deleted items in the final data list
   * then send data to api to add, update or delete the sites
   * @param ev
   */
  onAddUpdateSiteDetails(ev) {
    this.sitesListFromDb.forEach((siteObj) => {
      this.deletedSites.forEach(delObj => {
        if (delObj.id === siteObj.id) {
          this.dataSource.data.push(delObj.site);
        }
      });
    });

    /** make API request to the server
     */
    const url = urls.sitesDetails;
    this.httpService.postRequest(url, JSON.stringify(this.dataSource.data)).subscribe((res: any) => {
      if (res != null) {
        /**
         * if everything is ok then it will redirect to sites list
         */
        if (res.success && res.message.messageCode === 200) {
          this.router.navigate(['./site']);
        } else {
          this.errorMessageFromApi = res.message.description;
        }
      } else {
        const errorMessage: any = this.translate.get('common.errorMessage');
        this.errorMessageFromApi = errorMessage;
      }
    },
      (err: any) => {
        if (err.error != null && err.error.message != null) {
          this.errorMessageFromApi = err.error.message.description;
        }
      }
    );
  }

  /**
   * onAddSiteClick - On click of add new site button
   * @param ev
   */
  onAddSiteClick(ev) {
    this.hideExportFrom = false;
    this.siteData.siteExportFrom = SiteExportFrom[SiteExportFrom.Template];
    this.getTemplatesList().then(res => {
      this.bindTemplateDataOnSiteAdd();
      this.errorMessageOnSitePopUp = '';
      this.siteData.action = ActionType.Create;
      this.siteData.siteCreatedBy = this.loggedInUser;
      this.siteData.firstTimeAdd = true;
      this.siteData.siteCopyFrom = this.dataSource.data[0].id;
    });
  }

  /**
   * onSiteSubmitted - Add or update the site data
   * @param ev
   */
  onSiteSubmitted(ev) {
    this.errorMessageOnSitePopUp = '';
    /**
     * if name is empty then return error
     */
    if (!this.siteData.siteName) {
      const nameRequired: any = this.translate.get('common.nameRequired');
      this.errorMessageOnSitePopUp += nameRequired.value + ' \n';
    }

    /**
     * check if site name already exist int he list
     */
    if (this.siteData.siteName) {
      this.checkIfSiteNameAlreadyExist();
    }

    /**
     * if there is no error, it will add or update the site data
     */
    if (!this.errorMessageOnSitePopUp) {
      if (this.siteData.action === ActionType.Create && this.siteData.firstTimeAdd) {
        this.addNewSite();
      } else {
        this.updateExistingSite();
      }
      /**
       * After updating and adding the site in the list, then close the add site pop up
       */
      this.siteData = {};
      $('#siteModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  }

  /**
   * closeSitePopUp - on closing of popup, clear the data object
   * @param ev
   */
  closeSitePopUp(ev) {
    this.siteData = {};
  }

  /**
   * onSiteRemove - On click of remove the site it will ask for the confirm box
   * @param ev
   * @param siteElement
   */
  onSiteRemove(ev, siteElement) {
    const deleteTitle: any = this.translate.get('site.deleteTitle');
    const deleteText: any = this.translate.get('site.deleteText');
    const deleteButtonOkText: any = this.translate.get('site.deleteButtonOkText');
    swal({
      title: deleteTitle.value,
      text: deleteText.value,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: deleteButtonOkText.value,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dataSource.data.forEach(dataObj => {
          if (siteElement.name.toLowerCase() === dataObj.name.toLowerCase()) {
            /**
             * if the deleted site exist in the database
             * then it will update the action as update and delete the site from the list
             * then add that deleted item into another list
             */
            if (dataObj.existInDb) {
              this.copyDeletedSite(dataObj);
            }
            this.dataSource.data.splice(dataObj.serialNo - 1, 1);
            this.bindDataSource(this.dataSource.data, false);
          }
        });
      }
    });
  }

  /**
   * onSiteEdit - On edit the site, it will enter the pre-filled data into popup
   * @param ev
   * @param selectedSiteId
   * @param selectedSiteOrder
   */
  onSiteEdit(ev, selectedSiteId, selectedSiteName) {
    this.hideExportFrom = true;
    this.errorMessageOnSitePopUp = '';
    this.dataSource.data.forEach(siteObj => {
      if (selectedSiteName.toLowerCase() === siteObj.name.toLowerCase()) {
        this.siteData.firstTimeAdd = false;
        this.siteData.siteExportFrom = siteObj.siteExportFrom;
        this.siteData.templateId = siteObj.templateId;
        this.siteData.siteName = siteObj.name;
        this.bindDataInModel(siteObj);
        if (siteObj.existInDb) {
          this.siteData.action = ActionType.Update;
        } else {
          this.siteData.action = ActionType.Create;
        }
      }
    });
  }

  onTemplateChange(selectedTemplateId) {
    this.siteData.siteExportFrom = SiteExportFrom[SiteExportFrom.Template];
    this.siteData.templateId = selectedTemplateId;
    const siteObj = this.getTemplateById(selectedTemplateId);
    if (siteObj) {
      this.bindDataInModel(siteObj);
    }
  }

  onCopyFromChange(selectedCopySiteId) {
    this.siteData.siteExportFrom = SiteExportFrom[SiteExportFrom.Copy];
    this.siteData.siteCopyFrom = selectedCopySiteId;
    const siteObj = this.getSiteById(selectedCopySiteId);
    if (siteObj) {
      this.bindDataInModel(siteObj);
    }
  }
  onExportFromChange(ev) {
    if (this.siteData.siteExportFrom === SiteExportFrom[SiteExportFrom.Template]) {
      this.bindDataInModel(this.templates[0]);
      this.siteData.templateId = this.templates[0].id;
    } else {
      this.bindDataInModel(this.dataSource.data[0]);
      this.siteData.siteCopyFrom = this.dataSource.data[0].id;
    }
  }

  onImportSiteClick(event) {
    if (event.target.files.length === 0) {
      return;
    }
    const fname = event.target.files[0].name;
    const fextension = fname.substring(fname.lastIndexOf('.') + 1);

    /**
     * check if extension of selected file exists in the array
     */
    if (!this.utilsService.isInArray(this.allowedExtensions, fextension)) {
      const extensionAllowedForImport: any = this.translate.get('site.extensionAllowedForImport');
      alert(extensionAllowedForImport.value);
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      /**
       * read file as data url
       */
      reader.readAsDataURL(event.target.files[0]);

      /**
       * called once readAsDataURL is completed
       * @param ev
       */
      reader.onload = (ev: any) => {
        const url = urls.importSite;
        const importData = {
          SiteData: ev.target.result
        };
        // call api to save job file
        this.httpService.postRequest(url, JSON.stringify(importData)).subscribe((res: any) => {
          const siteImport: any = this.translate.get('siteEdit.siteImportedSuccessfully');

          if (res.success && res.message !== null) {
            if (res.message.messageCode === 200) {
              alert(siteImport.value);
            } else {
              alert(res.message.description);
            }
          }
        }, (error) => {
          // error
        });


      };
    }
  }

  onTriggerImportSiteClick(ev) {
    ev.preventDefault();
    const element = document.getElementById('file') as HTMLElement;
    element.click();
  }


  private bindDataInModel(siteObj: any) {
    this.siteData.siteDescription = siteObj.description;
    this.siteData.siteAddress = siteObj.address;
    this.siteData.siteCity = siteObj.city;
    this.siteData.siteCountry = siteObj.country;
    this.siteData.siteState = siteObj.province;
    this.siteData.siteZipCode = siteObj.zip;
    if (siteObj.copyFrom) {
      this.siteData.siteCopyFrom = siteObj.copyFrom;
    }
    this.siteData.siteCreatedBy = this.loggedInUser;
    this.siteData.order = siteObj.order;
  }

  private getSiteById(selectedSiteId: any) {
    return this.dataSource.data.find(z => z.id === selectedSiteId);
  }

  private getTemplateById(selectedTemplateId: any) {
    return this.templates.find(z => z.id === selectedTemplateId);
  }

  /**
   * updateExistingSite - it will update the datasource list with the changed values
   */
  private updateExistingSite() {
    this.dataSource.data.forEach(siteObj => {
      if (siteObj.order === this.siteData.order) {
        this.bindDataFromModel(siteObj);
      }
    });
  }


  private bindDataFromModel(siteObj: any) {
    siteObj.action = this.siteData.action;
    siteObj.name = this.siteData.siteName;
    siteObj.description = !this.siteData.siteDescription ? '' : this.siteData.siteDescription;
    siteObj.address = this.siteData.siteAddress;
    siteObj.city = this.siteData.siteCity;
    siteObj.country = this.siteData.siteCountry;
    siteObj.province = this.siteData.siteState;
    siteObj.zip = this.siteData.siteZipCode;
    siteObj.createdBy = this.siteData.siteCreatedBy;
    siteObj.copyFrom = this.siteData.siteCopyFrom;
    siteObj.templateId = this.siteData.templateId;
    siteObj.siteExportFrom = this.siteData.siteExportFrom;
  }

  /**
   * addNewSite - Add new site
   * Calculate maximum order number then assign the order number to the newly created site
   * it will add in the end in the list
   */
  private addNewSite() {
    let maxOrderNo = this.calculateMaxOrderNo();
    if (maxOrderNo < 0) {
      maxOrderNo = 0;
    }
    const siteObj: any = {};
    this.bindDataFromModel(siteObj);
    siteObj.existInDb = false;
    siteObj.order = maxOrderNo + 1;
    siteObj.serialNo = maxOrderNo + 1;
    this.dataSource.data.push(siteObj);
    this.bindDataSource(this.dataSource.data, false);
  }

  /**
   * calculateMaxOrderNo - it will calculate the maximum order number in the site data list
   */
  private calculateMaxOrderNo() {
    return Math.max.apply(Math, this.dataSource.data.map(function(o) { return o.order; }));
  }

  /**
   * check if site name same exist already in any other site.
   */
  private checkIfSiteNameAlreadyExist() {
    const siteNameExists: any = this.translate.get('siteEdit.siteNameExists');
    let index;
    if (this.siteData.action === ActionType.Create) {
      index = this.dataSource.data.findIndex(z => z.name.toLowerCase() === this.siteData.siteName.toLowerCase() && z.order !== this.siteData.order);
    } else if (this.siteData.action === ActionType.Update || this.siteData.action === ActionType.None) {
      index = this.dataSource.data.findIndex(z => z.name.toLowerCase() === this.siteData.siteName.toLowerCase() && z.order !== this.siteData.order);
    }
    if (index > -1) {
      this.errorMessageOnSitePopUp += siteNameExists.value;
    }

  }

  /**
   * copyDeletedSite - it will save the deleted site into another list if that site already exists in the database
   * @param siteObj
   */
  private copyDeletedSite(siteObj) {
    siteObj.action = ActionType.Delete;
    const obj: any = {};
    obj.id = siteObj.id;
    obj.site = siteObj;
    this.deletedSites.push(obj);
  }

  /**
   * Get sites data from api
   */
  private getSites() {
    const url = urls.sites;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.sitesList = res.data;
        this.sitesList.forEach((siteObj, index) => {
          siteObj.serialNo = index + 1;
          siteObj.existInDb = true;
        });
        this.sitesListFromDb = Object.assign([], this.sitesList);
        this.bindDataSource(this.sitesList, false);
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
    });

  }

  /**
   * bindDataSource - bind the data into datasource and reflect changes using changeDetector
   * @param data
   * @param isChangeOrder
   */
  private bindDataSource(data, isChangeOrder) {
    this.dataSource = new MatTableDataSource(data);
    if (isChangeOrder) {
      this.calculateSiteOrder();
    }
    this.ref.detectChanges();
  }

}

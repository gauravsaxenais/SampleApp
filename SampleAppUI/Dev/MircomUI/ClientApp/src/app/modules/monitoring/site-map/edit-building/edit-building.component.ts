/**
 * Import dependencies
 */
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActionType, FloorLabelActions, MapTypes, EditRequestedFrom, EditBuildingRequestedFrom, ObjectType, ChangeType } from 'src/app/shared/enums';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { UtilsService } from 'src/app/services/utility.services';
import { SignalrService } from 'src/app/services/signalR.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-building',
  templateUrl: './edit-building.component.html',
  styleUrls: ['./edit-building.component.css']
})

/**
 * Create Edit Building component
 */
export class EditBuildingComponent implements OnInit, OnDestroy {
  /**
   * variables declaration
   */
  @ViewChild('floorFileId', { static: false }) floorFileId: ElementRef;
  @ViewChild('caseFileId', { static: false }) caseFileId: ElementRef;
  @ViewChild('buildingSlotNo', { static: false }) buildingSlotNo: ElementRef;
  disabledFieldOnEdit: boolean;
  siteMapName = this.local.getSiteMapName();
  buildingsDetails = [];
  floorsData = [];
  buildingData: any = {};
  errorMessageOnBuildingPopUp: any;
  selectedBuildingSerialNumber: number;
  floorLabelActions = FloorLabelActions;
  mapTypes = MapTypes;
  actionType = ActionType;
  siteData = [];
  onlyBuildingData = [];
  copyFloor: any = {};
  allowedExtensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'gif'];
  errorMessageOfCaseFile: any;
  siteId = this.local.getSiteId();
  isCopied = false;
  isCut = false;
  buildingSerialNoForCutFloor: number;
  errorMessageOfCaseFileOnSiteMap: any;
  errorMessageOnSiteMapPopUp: any;
  errorMessageFromApi: any;
  deletedFloors = [];
  loading = true;
  selectedBuildingId: number;
  maximumFloors = 300;
  maximumBuildings = 100;

  /*
   * Inject the services in the constructor
   * @param local
   * @param httpService
   * @param router
   * @param route
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly signalR: SignalrService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  /**
   * OnInit - Get building details data
   */
  ngOnInit() {
    this.getBuildingsDetails();
    this.utilsService.getSetLanguage();
    this.signalR.initializeSignalRConnect();
  }

  /**
   * Disconnect the signalR
   */
  ngOnDestroy(): void {
    this.signalR.disconnect();
  }

  /**
   * onDrop - to change the order of floors within the buildings
   * @param event
   * @param buildingItem
   */
  onDrop(event: CdkDragDrop<string[]>, buildingItem) {
    this.selectedBuildingSerialNumber = buildingItem.buildingSerialNumber;
    /**
     * reorder the floors
     */
    moveItemInArray(buildingItem.floors, event.previousIndex, event.currentIndex);

    /**
     * re-assign the floor slot numbers according to the index
     */
    this.buildingsDetails.forEach(buildingObj => {
      if (this.selectedBuildingSerialNumber === buildingObj.buildingSerialNumber) {
        this.calculateFloorSlotNo(buildingObj.floors);
      }
    });
  }

  /**
   * onSelectFloorFile - on change of image file of floor stack
   * @param eventonBuildingNameClick
   */
  onSelectFloorFile(event) {
    this.errorMessageOnBuildingPopUp = '';
    this.readImageFile(event, 'floorstack');
  }

  /**
   * onSelectCaseFile - on change of image file of showcase
   * @param event
   */
  onSelectCaseFile(event) {
    this.errorMessageOfCaseFile = '';
    this.readImageFile(event, 'case');
  }
  /**
   * onSelectCaseFileOnSiteMap - on change of image file of showcase
   * @param event
   */
  onSelectCaseFileOnSiteMap(event) {
    this.errorMessageOfCaseFileOnSiteMap = '';
    this.readImageFile(event, 'caseOnSiteMap');
  }


  /**
   * readImageFile - read image file from the browser
   * @param event
   * @param fileFilterType
   */
  readImageFile(event, fileFilterType) {
    this.errorMessageOfCaseFileOnSiteMap = '';
    this.errorMessageOfCaseFile = '';
    this.errorMessageOnBuildingPopUp = '';

    if (event.target.files.length === 0) {
      return;
    }
    const fname = event.target.files[0].name;
    const fextension = fname.substring(fname.lastIndexOf('.') + 1);

    /**
     * check if extension of selected file exists in the array
     */
    if (!this.utilsService.isInArray(this.allowedExtensions, fextension)) {
      const showcaseVal: any = this.translate.get('editBuilding.showcaseImages');
      const floorstackVal: any = this.translate.get('editBuilding.floorstackImages');

      if (fileFilterType === 'caseOnSiteMap') {
        this.errorMessageOfCaseFileOnSiteMap = showcaseVal.value;
      } else if (fileFilterType === 'case') {
        this.errorMessageOfCaseFile = showcaseVal.value;
      } else {
        this.errorMessageOnBuildingPopUp = floorstackVal.value;
      }
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
        if (fileFilterType === 'case' || fileFilterType === 'caseOnSiteMap') {
          this.buildingData.caseUrl = ev.target.result;
          this.buildingData.caseImageChanged = true;
        } else {
          this.buildingData.floorUrl = ev.target.result;
          this.buildingData.floorImageChanged = true;
        }
      };
    }
  }

  /**
   * onBuildingNameClick - on click of building name highlight the selected building
   * @param ev
   * @param buildingId
   * @param serialNumber
   */
  onBuildingNameClick(ev, buildingId, serialNumber) {
    this.selectedBuildingSerialNumber = serialNumber;
    this.selectedBuildingId = buildingId;
    this.buildingsDetails.forEach(buildingObj => {
      if (buildingObj.buildingSerialNumber === serialNumber) {
        buildingObj.isSelectedBuilding = true;
        this.floorsData = buildingObj.floors;
      } else {
        buildingObj.isSelectedBuilding = false;
      }
    });
  }

  /**
   * onRemoveBuildingClick - Remove the building which you have selected
   * @param ev
   */
  onRemoveBuildingClick(ev) {
    if (this.selectedBuildingId === MapTypes.SiteMap && this.selectedBuildingSerialNumber !== undefined) {
      const btnVal: any = this.translate.get('editBuilding.ok');
      const siteDel: any = this.translate.get('editBuilding.sitedeletionisnotallowed');
      swal({
        title: siteDel.value,
        text: '',
        type: 'warning',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: btnVal.value,
        buttonsStyling: false
      });
    } else if (this.selectedBuildingSerialNumber === undefined) {
      const btnVal: any = this.translate.get('editBuilding.ok');
      const buildDel: any = this.translate.get('editBuilding.pleaseselectthebuildingyouwanttoremove');
      swal({
        title: buildDel.value,
        text: '',
        type: 'warning',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: btnVal.value,
        buttonsStyling: false
      });
    } else {
      const deleteConfirmVal: any = this.translate.get('editBuilding.areyousureyouwanttodeletethisbuilding');
      const nonRevertConfirmVal: any = this.translate.get('editBuilding.youwouldnotbeabletorevertthis');
      const deleteVal: any = this.translate.get('editBuilding.yesDeleteIt');
      const cancel: any = this.translate.get('editBuilding.cancel');
      swal({
        title: deleteConfirmVal.value,
        text: nonRevertConfirmVal.value,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        cancelButtonText: cancel.value,
        confirmButtonText: deleteVal.value,
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (!this.selectedBuildingSerialNumber) {
            const pleaseselectthebuildingyouwanttoremove: any = this.translate.get('editBuilding.pleaseselectthebuildingyouwanttoremove');
            const ok: any = this.translate.get('editBuilding.ok');
            swal({
              title: pleaseselectthebuildingyouwanttoremove.value,
              type: 'warning',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: ok.value,
              buttonsStyling: false
            });
          } else {
            this.buildingsDetails.forEach(buildingObj => {
              if (buildingObj.buildingSerialNumber === this.selectedBuildingSerialNumber) {
                // if building already created in the database then update action to delete otherwise delete from the list
                if (buildingObj.buildingId) {
                  buildingObj.action = ActionType.Delete;
                } else {
                  this.buildingsDetails.splice(this.selectedBuildingSerialNumber - 1, 1);
                }
              }
            });
          }
        }
      });
    }
  }

  /**
   * onBuildingSubmitted - create or update the building
   * @param ev
   */
  onBuildingSubmitted(ev) {
    this.errorMessageOnBuildingPopUp = '';

    /**
     * if name is empty then return error
     */
    if (!this.buildingData.buildingName) {
      const nameIsRequiredMessage: any = this.translate.get('editBuilding.nameIsRequired');
      this.errorMessageOnBuildingPopUp += nameIsRequiredMessage.value + ' \n';
    }

    if (this.buildingData.buildingSlotNo < 1 || !this.buildingData.buildingSlotNo) {
      const numberOfFloorsRequired: any = this.translate.get('editBuilding.numberOfFloorsRequired');
      this.errorMessageOnBuildingPopUp += numberOfFloorsRequired.value + ' \n';
    }

    if (this.buildingData.buildingSlotNo > this.maximumFloors) {
      const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
      this.errorMessageOnBuildingPopUp += maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors);
    }

    /**
     * check if building number is empty then find maximum building number from the list and add 1 in that building number.
     */
    this.calculateMaxBuildingNo();
    /**
     * check if building number same exist already in any other building.
     */
    this.checkIfBuildingNumberAlreadyExist();

    /**
     * if there is no error then it will add or update building.
     */

    if (!this.errorMessageOnBuildingPopUp) {
      if (this.buildingData.action === ActionType.Update || this.buildingData.action === ActionType.None) {
        // update building
        this.updateBuilding();
      } else {
        let isFound = false;
        this.buildingsDetails.forEach(item => {
          if (!isFound) {
            if (item.buildingSerialNumber === this.buildingData.buildingSerialNumber && !item.buildingId) {
              this.buildingData.action = ActionType.Create;
              // update building
              this.updateBuilding();
              isFound = true;
            }
          }
        });
        if (!isFound) {
          // create new building
          this.addNewBuilding();
        }
      }
      this.buildingData = {};
      $('#buildingPropertiesModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  }

  /**
   * onAddBuildingClick - Add a new building click and set action as create
   * @param ev
   */
  onAddBuildingClick(ev) {
    this.errorMessageOnBuildingPopUp = '';
    const getFilteredBuildings = this.buildingsDetails.filter(z => z.buildingSerialNumber > 1 && z.action !== ActionType.Delete);
    if (getFilteredBuildings.length >= this.maximumBuildings) {
      const maximumBuildings: any = this.translate.get('editBuilding.maximumBuildings');
      const ok: any = this.translate.get('editBuilding.ok');
      swal({
        title: maximumBuildings.value.replace('{maxNoOfBuilding}', this.maximumBuildings),
        type: 'warning',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: ok.value,
        buttonsStyling: false
      });
    } else {
      $('#buildingPropertiesModal').modal('show');
      this.disabledFieldOnEdit = false;
      this.floorFileId.nativeElement.value = null;
      this.caseFileId.nativeElement.value = null;
      this.buildingData.action = ActionType.Create;
    }
  }

  /**
   * Return loader property
   */
  isLoader(): boolean {
    return this.loading;
  }

  /**
   * onAddUpdateBuildingDetails - After perform all the operations, add, delete or update the building
   * Make api request
   * @param ev
   */
  onAddUpdateBuildingDetails(ev, isRedirectToMapEdit, mapGuid) {
    console.log(mapGuid);
    this.loading = true;

    this.buildingsDetails.forEach(buildingObj => {
      this.deletedFloors.forEach(delObj => {
        if (delObj.buildingSerialNumber === buildingObj.buildingSerialNumber) {
          buildingObj.floors.push(delObj.floor);
        }
      });
      if (buildingObj.floors) {
        buildingObj.floors.forEach((floorObj, index) => {
          floorObj.slotNo = index;
        });
      }
    });

    const url = urls.saveOrUpdateBuildings;
    this.httpService.postRequest(url, JSON.stringify(this.buildingsDetails)).subscribe((res: any) => {
      if (res != null) {
        if (res.success && res.message.messageCode === 200) {

          // ************************ Start SignalR Implementation
          this.buildingsDetails.forEach(objBuilding => {
            // We will consider the building status change for insert=0, update=1, delete=2. Not for none=0 action
            if (objBuilding.action > 0) {
              this.signalR.sendConfigStatusChanged(ObjectType.Building, objBuilding.buildingGuid, this.utilsService.getChangeTypeByAction(objBuilding.action));
            }

            objBuilding.floors.forEach(objFloor => {
              // Not considuring the action type none (0) to hit SignalR, but when building is site map then allow to change configuration of map
              if (objFloor.action > 0 || objBuilding.buildingId === 0) {
                // If change config for site , that should be always modified
                let type = ChangeType.Modified;
                if (objBuilding.buildingId !== 0) {
                  type = this.utilsService.getChangeTypeByAction(objFloor.action);
                }
                this.signalR.sendConfigStatusChanged(ObjectType.SiteMap, this.local.getSiteGuid() + '_' + objFloor.mapId, type);
              }
            });
          });
          // ************************ End SignalR Implementation

          setTimeout(() => {
            const editRequestFrom: string = this.local.getEditBuildingRequestedFrom();
            if (isRedirectToMapEdit) {
              if (res.data) {
                this.redirectToEditMap(res.data);
              } else {
                this.redirectToEditMap(mapGuid);
              }
            } else if (editRequestFrom === EditBuildingRequestedFrom.Building.toString()) {
              const curBuildingId = this.route.snapshot.params.buildingId;
              this.router.navigate(['./monitoring/site-map/building', { siteId: this.siteId, buildingId: curBuildingId }]);
            } else if (editRequestFrom === EditBuildingRequestedFrom.ShowCase.toString()) {
              this.router.navigate(['./monitoring/site-map/site-showcase']);
            } else {
              this.router.navigate(['./monitoring/site-map']);
            }
          }, 2000);


        } else {
          this.loading = false;
          this.errorMessageFromApi = res.message.description;
        }
      } else {
        this.loading = false;
        this.errorMessageFromApi = 'Something went wrong in the api';
      }
    },
      (err: any) => {
        this.loading = false;
        if (err.error != null && err.error.message != null) {
        }
      }
    );
  }

  /**
   * onEditBuilding - On click of edit building and open edit building popup with all pre-filled details
   * @param ev
   * @param buildingNumber
   */
  onEditBuilding(ev, buildingNumber) {

    this.errorMessageOfCaseFileOnSiteMap = '';
    this.errorMessageOfCaseFile = '';
    this.errorMessageOnBuildingPopUp = '';

    this.disabledFieldOnEdit = true;
    this.errorMessageOnBuildingPopUp = '';
    this.buildingsDetails.forEach(buildingItem => {
      if (buildingItem.number === buildingNumber) {
        this.buildingData.buildingName = buildingItem.name;
        this.buildingData.buildingSlotNo = buildingItem.floors.length;
        this.buildingData.buildingDescription = buildingItem.description ? buildingItem.description : '';
        this.buildingData.buildingNo = buildingItem.number;
        this.buildingData.buildingId = buildingItem.buildingId;
        if (!buildingItem.floorStackImage) {
          this.buildingData.floorUrl = buildingItem.floorStackFile;
        } else {
          this.buildingData.floorUrl = buildingItem.floorStackImage;
        }
        if (!buildingItem.showcaseFileImage) {
          this.buildingData.caseUrl = buildingItem.showcaseFile;
        } else {
          this.buildingData.caseUrl = buildingItem.showcaseFileImage;
        }
        if (buildingItem.buildingId) {
          this.buildingData.action = ActionType.Update;
        }
        this.buildingData.buildingSerialNumber = buildingItem.buildingSerialNumber;
        this.floorFileId.nativeElement.value = null;
        this.caseFileId.nativeElement.value = null;
        $('#buildingPropertiesModal').modal('show');
      }
    });
  }

  /**
   * onEditSiteMap - On click of edit site map and open edit site map popup with all pre-filled details
   * @param ev
   * @param buildingNumber
   */
  onEditSiteMap(ev, buildingNumber) {
    this.disabledFieldOnEdit = true;
    this.errorMessageOnSiteMapPopUp = '';
    this.buildingsDetails.forEach(buildingItem => {
      if (buildingItem.number === buildingNumber) {
        this.buildingData.buildingNo = buildingItem.number;
        this.buildingData.buildingDescription = buildingItem.description ? buildingItem.description : '';
        if (!buildingItem.floorStackImage) {
          this.buildingData.floorUrl = buildingItem.floorStackFile;
        } else {
          this.buildingData.floorUrl = buildingItem.floorStackImage;
        }
        if (!buildingItem.showcaseFileImage) {
          this.buildingData.caseUrl = buildingItem.showcaseFile;
        } else {
          this.buildingData.caseUrl = buildingItem.showcaseFileImage;
        }
        this.buildingData.action = ActionType.Update;
        this.buildingData.buildingSerialNumber = buildingItem.buildingSerialNumber;
        this.floorFileId.nativeElement.value = null;
        this.caseFileId.nativeElement.value = null;
        $('#siteMapPropertiesModal').modal('show');
      }
    });
  }

  /**
   * closeBuildingPopUp - close modal popup of building properties
   * @param ev
   */
  closeBuildingPopUp(ev) {
    this.buildingData = {};
  }
  /**
   * closeSiteMapPopUp - close modal popup of site map properties
   * @param ev
   */
  closeSiteMapPopUp(ev) {
    this.buildingData = {};
  }
  /**
   * onSiteMapSubmitted - update the site map
   * @param ev
   */
  onSiteMapSubmitted(ev) {
    this.buildingsDetails.forEach(item => {
      if (item.number === this.buildingData.buildingNo) {
        item.description = this.buildingData.buildingDescription ? this.buildingData.buildingDescription : '';
        item.isSelectedBuilding = false;
        if (this.buildingData.flooorImageChanged) {
          item.floorStackImage = this.buildingData.floorUrl;
          item.floorStackFile = '';
        }
        if (this.buildingData.caseImageChanged) {
          item.showcaseFileImage = this.buildingData.caseUrl;
          item.showcaseFile = '';
        }
        item.action = this.buildingData.action;
        // item.floorStackUrl = this.buildingData.floorUrl;
        //  item.showcaseFileUrl = this.buildingData.caseUrl;
        item.buildingSerialNumber = this.buildingData.buildingSerialNumber;
      }
    });
    this.buildingData = {};
    $('#siteMapPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * floorActionsKeys - List of menu to display for floor actions
   * @returns list of menu items
   */
  floorActionsKeys(): Array<string> {
    const keys = Object.keys(this.floorLabelActions);
    return keys.slice(keys.length / 2);
  }

  /**
   * onfloorActionClick - On click of floor action items
   * @param ev
   * @param actionPerformed
   * @param selectedFloor
   * @param buildingSerialNumber
   */
  onfloorActionClick(ev, actionPerformed, selectedFloor, buildingSerialNumber) {
    console.log(this.buildingsDetails);
    this.selectedBuildingSerialNumber = buildingSerialNumber;
    this.buildingsDetails.forEach(buildingObj => {
      if (buildingObj.buildingSerialNumber === buildingSerialNumber) {
        this.floorsData = buildingObj.floors;
      }
    });

    switch (actionPerformed) {
      /**
       * Action Item - Edit - Redirect to edit floor component to edit the properties of floor
       */
      case FloorLabelActions[FloorLabelActions.Edit]: {
        const askTextForSaveChangesVal: any = this.translate.get('editBuilding.changeswillbesaved');
        const savechangesVal: any = this.translate.get('editBuilding.ok');
        const cancel: any = this.translate.get('editBuilding.cancel');
        let isChange = false;
        this.buildingsDetails.forEach(buildingObj => {
          if (buildingObj.action !== ActionType.None) {
            isChange = true;
          }
          if (buildingObj.floors) {
            buildingObj.floors.forEach(floorObj => {
              floorObj.isSelected = false;
              if (floorObj.action !== ActionType.None) {
                isChange = true;
              }
            });
          }
        });
        if (isChange) {
          swal({
            title: askTextForSaveChangesVal.value,
            //  text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            cancelButtonText: cancel.value,
            confirmButtonText: savechangesVal.value,
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
              /**
               * first save the changes and then redirect to edit map screen
               */
              selectedFloor.isSelected = true;
              this.onAddUpdateBuildingDetails(ev, true, selectedFloor.mapGuid);
            }
          });
        } else {
          this.redirectToEditMap(selectedFloor.mapGuid);
        }
        break;
      }
      /**
       * Action Item - Copy - Copy properties of one floor to another floor
       */
      case FloorLabelActions[FloorLabelActions.Copy]: {
        this.copyFloor = selectedFloor;
        this.isCopied = true;
        this.isCut = false;
        break;
      }
      /**
       * Action Item - Paste - Update the floor properties with the source floor
       */
      case FloorLabelActions[FloorLabelActions.Paste]: {
        if (this.isCopied) {
          this.copyThenPaste(selectedFloor);
        }
        if (this.isCut) {
          this.cutThenPaste(selectedFloor);
        }
        this.calculatBuildingSlotNo(buildingSerialNumber);
        break;
      }
      /**
       * Action Item - Insert Above - Insert floor in the above direction
       */
      case FloorLabelActions[FloorLabelActions['Insert Above']]: {
        this.copyFloor = {};
        this.isCut = false;
        this.isCopied = false;
        if (this.floorsData.filter(z => z.action !== ActionType.Delete).length >= this.maximumFloors) {
          const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
          const ok: any = this.translate.get('editBuilding.ok');
          swal({
            title: maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors),
            type: 'warning',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: ok.value,
            buttonsStyling: false
          });
        } else {
          if (buildingSerialNumber === this.selectedBuildingSerialNumber) {
            const slotNo = selectedFloor.slotNo - 1;
            this.insertFloorOnAction(selectedFloor, slotNo, FloorLabelActions['Insert Above']);
          }
          this.calculateFloorSlotNo(this.floorsData);
          this.calculatBuildingSlotNo(buildingSerialNumber);
        }
        break;
      }
      /**
       * Action Item - Insert Below - Insert floor in the below direction
       */
      case FloorLabelActions[FloorLabelActions['Insert Below']]: {
        this.copyFloor = {};
        this.isCut = false;
        this.isCopied = false;
        if (this.floorsData.filter(z => z.action !== ActionType.Delete).length >= this.maximumFloors) {
          const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
          const ok: any = this.translate.get('editBuilding.ok');
          swal({
            title: maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors),
            type: 'warning',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: ok.value,
            buttonsStyling: false
          });

        } else {
          if (buildingSerialNumber === this.selectedBuildingSerialNumber) {
            const slotNo = selectedFloor.slotNo + 1;
            this.insertFloorOnAction(selectedFloor, slotNo, FloorLabelActions['Insert Below']);
          }
          this.calculateFloorSlotNo(this.floorsData);
          this.calculatBuildingSlotNo(buildingSerialNumber);
        }
        break;
      }
      /**
       * Action Item - Delete - Delete the selected floor
       */
      case FloorLabelActions[FloorLabelActions.Delete]: {
        const areyousureyouwanttodeletethisfloor: any = this.translate.get('editBuilding.areyousureyouwanttodeletethisfloor');
        const nonRevertConfirmVal: any = this.translate.get('editBuilding.youwouldnotbeabletorevertthis');
        const thisislastbuildingfloorDoyouwanttodeleteit: any = this.translate.get('editBuilding.thisislastbuildingfloorDoyouwanttodeleteit');
        const onedefaultblankfloorwillbeaddedafterdeletingit: any = this.translate.get('editBuilding.onedefaultblankfloorwillbeaddedafterdeletingit');
        const deleteVal: any = this.translate.get('editBuilding.yesDeleteIt');
        const cancel: any = this.translate.get('editBuilding.cancel');
        if (this.floorsData.filter(z => z.action !== ActionType.Delete).length > 1) {
            swal({
              title: areyousureyouwanttodeletethisfloor.value,
              text: nonRevertConfirmVal.value,
              type: 'warning',
              showCancelButton: true,
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              cancelButtonText: cancel.value,
              confirmButtonText: deleteVal.value,
              buttonsStyling: false
            }).then((result) => {
              if (result.value) {
                this.copyFloor = {};
                this.isCut = false;
                this.isCopied = false;
                this.floorsData.forEach(floorObj => {
                  if (floorObj.slotNo === selectedFloor.slotNo) {
                    if (floorObj.mapId) {
                      this.copyDeleted(selectedFloor, buildingSerialNumber);
                    }
                    this.floorsData.splice(selectedFloor.slotNo, 1);
                  }
                });
                /**
                 * If this deleted floor is the last floor in the building then add one empty floor
                 */
                const ch = this.floorsData.filter(z => z.action !== ActionType.Delete);
                if (ch.length === 0) {
                  const slotNo = 1;
                  this.insertFloorOnAction(selectedFloor, slotNo, FloorLabelActions.Delete);
                }
                this.calculatBuildingSlotNo(buildingSerialNumber);
                this.calculateFloorSlotNo(this.floorsData);
              }
            });
        } else if (this.floorsData.filter(z => z.action !== ActionType.Delete).length === 1 ) {
            swal({
              title: thisislastbuildingfloorDoyouwanttodeleteit.value,
              text: onedefaultblankfloorwillbeaddedafterdeletingit.value,
              type: 'warning',
              showCancelButton: true,
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              cancelButtonText: cancel.value,
              confirmButtonText: deleteVal.value,
              buttonsStyling: false
            }).then((result) => {
              if (result.value) {
                this.copyFloor = {};
                this.isCut = false;
                this.isCopied = false;
                this.floorsData.forEach(floorObj => {
                  if (floorObj.slotNo === selectedFloor.slotNo) {
                    if (floorObj.mapId) {
                      this.copyDeleted(selectedFloor, buildingSerialNumber);
                    }
                    this.floorsData.splice(selectedFloor.slotNo, 1);
                  }
                });
                /**
                 * If this deleted floor is the last floor in the building then add one empty floor
                 */
                const ch = this.floorsData.filter(z => z.action !== ActionType.Delete);
                console.log(ch);
                if (ch.length === 0) {
                  const slotNo = 1;
                  this.insertFloorOnAction(selectedFloor, slotNo, FloorLabelActions.Delete);
                }
                this.calculatBuildingSlotNo(buildingSerialNumber);
                this.calculateFloorSlotNo(this.floorsData);
              }
            });
        }
        break;
      }
      /**
       * Action Item - Cut - Cut the selected floor and paste into the another floor (this can be in another building also)
       */
      case FloorLabelActions[FloorLabelActions.Cut]: {
        this.copyFloor = {};
        this.isCut = true;
        this.isCopied = false;
        this.buildingsDetails.forEach(buildingObj => {
          if (buildingObj.typeParseId === MapTypes.Building) {
            if (buildingObj.floors) {
              buildingObj.floors.forEach(floorObj => {
                if (buildingObj.buildingSerialNumber === buildingSerialNumber) {
                  if (floorObj.slotNo === selectedFloor.slotNo) {
                    floorObj.isCut = true;
                    this.buildingSerialNoForCutFloor = buildingObj.buildingSerialNumber;
                  } else {
                    floorObj.isCut = false;
                  }
                }
              });
            }
          }
        });

        break;
      }
      default: {
        break;
      }
    }
  }

  private redirectToEditMap(mapGuid: string) {
    this.copyFloor = {};
    this.isCopied = false;
    this.isCut = false;
    localStorage.setItem('editRequestFrom', EditRequestedFrom.EditBuilding.toString());
    this.router.navigate(['./monitoring/site-map/edit-map', { siteId: this.siteId, mapGuid: mapGuid }]);
  }

  private copyDeleted(floorObj, buildingSerialNumber) {
    floorObj.action = ActionType.Delete;
    const obj: any = {};
    obj.buildingSerialNumber = buildingSerialNumber;
    obj.floor = floorObj;
    this.deletedFloors.push(obj);
  }

  private copyThenPaste(selectedFloor: any) {
    this.isCut = false;
    // check if floor is empty or not and if it is empty then insert one empty floor in the above direction then paste data in it
    if (selectedFloor.name) {
      if (this.floorsData.filter(z => z.action !== ActionType.Delete).length >= this.maximumFloors) {
        const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
        const ok: any = this.translate.get('editBuilding.ok');
        swal({
          title: maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors),
          type: 'warning',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: ok.value,
          buttonsStyling: false
        });
      } else {
        const slotNo = selectedFloor.slotNo - 1;
        const obj: any = {};
        obj.name = this.copyFloor.name;
        obj.description = this.copyFloor.description ? this.copyFloor.description : '';
        obj.slotNo = slotNo;
        obj.action = ActionType.Create;
        obj.image = this.copyFloor.image;
        obj.imageUrl = this.copyFloor.imageUrl;
        obj.mapItems = this.copyFloor.mapItems;
        this.floorsData.splice(selectedFloor.slotNo, 0, obj);
      }
    } else {
      this.floorsData.forEach(floorObj => {
        if (floorObj.slotNo === selectedFloor.slotNo) {
          floorObj.name = this.copyFloor.name;
          floorObj.description = this.copyFloor.description ? this.copyFloor.description : '';
          floorObj.image = this.copyFloor.image;
          if (this.copyFloor.image) {
            floorObj.imageUrl = '';
          }
          floorObj.imageUrl = this.copyFloor.imageUrl;
          floorObj.mapItems = this.copyFloor.mapItems;
          if (floorObj.mapId) {
            floorObj.action = ActionType.Update;
          }
        }
      });
    }
    this.calculateFloorSlotNo(this.floorsData);
    this.isCopied = false;
    this.copyFloor = {};
  }

  private cutThenPaste(selectedFloor: any) {
    this.isCopied = false;
    const obj: any = {};
    // get source floor (from cut option)
    this.buildingsDetails.forEach(buildingObj => {
      if (buildingObj.typeParseId === MapTypes.Building) {
        if (buildingObj.floors) {
          buildingObj.floors.forEach(floorObj => {
            if (floorObj.isCut) {
              if (this.floorsData.filter(z => z.action !== ActionType.Delete).length >= this.maximumFloors) {
                floorObj.isCut = false;
                const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
                const ok: any = this.translate.get('editBuilding.ok');
                swal({
                  title: maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors),
                  type: 'warning',
                  confirmButtonClass: 'btn btn-success',
                  confirmButtonText: ok.value,
                  buttonsStyling: false
                });
              } else {
                obj.name = floorObj.name;
                obj.description = floorObj.description ? floorObj.description : '';
                obj.action = ActionType.Create;
                obj.image = floorObj.image;
                obj.imageUrl = floorObj.imageUrl;
                obj.mapItems = floorObj.mapItems;
                if (buildingObj.buildingSerialNumber === this.buildingSerialNoForCutFloor) {
                  if (floorObj.mapId) {
                    this.copyDeleted(floorObj, buildingObj.buildingSerialNumber);
                  }
                  buildingObj.floors.splice(floorObj.slotNo, 1);
                  this.calculateFloorSlotNo(buildingObj.floors);
                }
                /**
                 * If this deleted floor is the last floor in the building then add one empty floor
                 */
                const ch = buildingObj.floors.filter(z => z.action !== ActionType.Delete && buildingObj.buildingSerialNumber === this.buildingSerialNoForCutFloor);
                if (ch.length === 0) {
                  const ob: any = {};
                  ob.name = '';
                  ob.slotNo = 1;
                  ob.description = '';
                  ob.image = '';
                  ob.imageUrl = '';
                  ob.mapItems = [];
                  ob.action = ActionType.Create;
                  buildingObj.floors.push(ob);
                }
              }
            }
          });

        }
      }
    });
    if (selectedFloor.name) {
      if (this.floorsData.filter(z => z.action !== ActionType.Delete).length >= this.maximumFloors) {
        const maximumfloors: any = this.translate.get('editBuilding.maximumfloors');
        const ok: any = this.translate.get('editBuilding.ok');
        swal({
          title: maximumfloors.value.replace('{maxNoOfFloor}', this.maximumFloors),
          type: 'warning',
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: ok.value,
          buttonsStyling: false
        });
      } else {
        const slotNo = selectedFloor.slotNo - 1;
        obj.slotNo = slotNo;
        this.floorsData.splice(selectedFloor.slotNo, 0, obj);
      }
    } else {
      if (this.floorsData) {
        this.floorsData.forEach(floorObj => {
          if (floorObj.slotNo === selectedFloor.slotNo) {
            floorObj.name = obj.name;
            floorObj.description = obj.description ? obj.description : '';
            floorObj.image = obj.image;
            floorObj.imageUrl = obj.imageUrl;
            floorObj.mapItems = obj.mapItems;
            if (floorObj.mapId) {
              floorObj.action = ActionType.Update;
            }
          }
        });
      }
    }
    this.calculateFloorSlotNo(this.floorsData);
    this.isCut = false;
    this.copyFloor = {};
  }

  /**
   * check if building number is empty then find maximum building number from the list and add 1 in that building number.
   */
  private calculateMaxBuildingNo() {
    const maxNumber = Math.max.apply(Math, this.buildingsDetails.map(function(o) { return o.number; }));
    if (!this.buildingData.buildingNo) {
      this.buildingData.buildingNo = maxNumber + 1;
    }
  }

  /**
   * check if building number same exist already in any other building.
   */
  private checkIfBuildingNumberAlreadyExist() {
    this.buildingsDetails.forEach(buildingItem => {
      if (buildingItem.number === this.buildingData.buildingNo && this.buildingData.action === ActionType.Create) {
        this.errorMessageOnBuildingPopUp = 'This building number already exists.';
      } else if (buildingItem.number === this.buildingData.buildingNo && (this.buildingData.action === ActionType.Update || this.buildingData.action === ActionType.None) && buildingItem.buildingSerialNumber !== this.buildingData.buildingSerialNumber) {
        this.errorMessageOnBuildingPopUp = 'This building number already exists.';
      }
    });
  }

  /**
   * updateBuilding - Update the selected building
   */
  private updateBuilding() {
    this.buildingsDetails.forEach(item => {
      if (item.number === this.buildingData.buildingNo) {
        item.name = this.buildingData.buildingName;
        item.slots = this.buildingData.buildingSlotNo;
        item.description = this.buildingData.buildingDescription ? this.buildingData.buildingDescription : '';
        item.number = this.buildingData.buildingNo;
        item.isSelectedBuilding = false;
        if (this.buildingData.flooorImageChanged) {
          item.floorStackImage = this.buildingData.floorUrl;
          item.floorStackFile = '';
        }
        if (this.buildingData.caseImageChanged) {
          item.showcaseFileImage = this.buildingData.caseUrl;
          item.showcaseFile = '';
        }
        item.action = this.buildingData.action;
        //  item.floorStackUrl = this.buildingData.floorUrl;
        //   item.showcaseFileUrl = this.buildingData.caseUrl;

        item.buildingSerialNumber = this.buildingData.buildingSerialNumber;
      }
    });
  }

  /**
   * addNewBuilding - Add New Building
   */
  private addNewBuilding() {
    const buildingObj = {
      name: this.buildingData.buildingName,
      slots: this.buildingData.buildingSlotNo,
      description: this.buildingData.buildingDescription ? this.buildingData.buildingDescription : '',
      isSelectedBuilding: false,
      number: this.buildingData.buildingNo,
      floorStackImage: this.buildingData.floorUrl,
      showcaseFileImage: this.buildingData.caseUrl,
      //  floorStackUrl: this.buildingData.floorUrl,
      //   showcaseFileUrl: this.buildingData.caseUrl,
      action: ActionType.Create,
      buildingSerialNumber: this.buildingsDetails.length + 1,
      type: MapTypes.Building,
      typeParseId: MapTypes.Building,
      siteId: this.siteId,
      floors: []
    };
    for (let i = 1; i <= this.buildingData.buildingSlotNo; i++) {
      const obj: any = {};
      obj.action = ActionType.Create;
      obj.description = '';
      obj.image = '';
      obj.imageUrl = '';
      obj.mapItems = [];
      obj.slotNo = i;
      buildingObj.floors.push(obj);
    }
    this.buildingsDetails.push(buildingObj);
  }

  /**
   * calculateFloorSlotNo - Calculate slot number of floor according to the index
   * @param floorData
   */
  private calculateFloorSlotNo(floorData: any) {
    if (floorData) {
      floorData.forEach((floorObj, index) => {
        floorObj.slotNo = index;
        if (floorObj.mapId && floorObj.action !== ActionType.Delete) {
          floorObj.action = ActionType.Update;
        }
      });
    }
  }

  /**
   * calculatBuildingSlotNo - Calculate Building slot number
   */
  private calculatBuildingSlotNo(buildingSerialNumber) {
    this.buildingsDetails.forEach(buildingObj => {
      if (buildingObj.buildingSerialNumber === buildingSerialNumber) {
        const getBuildingFloorsWithoutDeleted = buildingObj.floors.filter(z => z.action !== ActionType.Delete);
        buildingObj.slots = getBuildingFloorsWithoutDeleted.length;
        if (buildingObj.buildingGuid) {
          buildingObj.action = ActionType.Update;
        }
      }
    });
  }

  /**
   * Insert new floor on different actions
   * @param selectedFloor
   * @param slotNo
   * @param actionType
   */
  private insertFloorOnAction(selectedFloor: any, slotNo, actionType) {
    const obj: any = {};
    obj.name = '';
    obj.slotNo = slotNo;
    obj.action = ActionType.Create;
    obj.description = '';
    obj.image = '';
    obj.imageUrl = '';
    obj.mapItems = [];
    if (actionType === FloorLabelActions['Insert Above']) {
      this.floorsData.splice(selectedFloor.slotNo, 0, obj);
    } else if (actionType === FloorLabelActions['Insert Below']) {
      this.floorsData.splice(obj.slotNo, 0, obj);
    } else if (actionType === FloorLabelActions.Delete) {
      this.floorsData.push(obj);
    }
  }

  /**
   * getBuildingsDetails - Get details of building
   */
  private getBuildingsDetails() {
    this.loading = true;
    const url = urls.buildingsDetails + '/' + this.siteId;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.buildingsDetails = res.data;
        this.buildingsDetails.forEach((buildingItem, index) => {
          buildingItem.buildingSerialNumber = index + 1;
          buildingItem.typeParseId = MapTypes[buildingItem.type];
          buildingItem.isSelectedBuilding = false;
          buildingItem.floors = buildingItem.floors;
          buildingItem.slots = buildingItem.floors ? buildingItem.floors.length : 0;
          if (buildingItem.floors) {
            buildingItem.floors.forEach((floorObj, ind) => {
              floorObj.slotNo = ind;
              this.loading = false;
            });
          }
        });
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
      this.loading = false;
    });
  }

}

/**
 * Import dependencies
 */
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { urls } from 'src/app/services/urls';
import { EditBuildingRequestedFrom, EditRequestedFrom, MapItemType, ActionType, ObjectType, ChangeType } from 'src/app/shared/enums';
import { UtilsService } from 'src/app/services/utility.services';
declare var $: any;
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { debug } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { SignalrService } from 'src/app/services/signalR.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-map',
  templateUrl: './edit-map.component.html',
  styleUrls: ['./edit-map.component.css']
})

/**
 * Create edit floor/site component
 */

export class EditMapComponent implements OnInit, OnDestroy {

  /**
   * Variables declaration
   */
  @ViewChild('floorFileId', { static: false }) floorFileId: ElementRef;
  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: (x, y) => void;

  image: string;
  inputData: any;
  accessPointData: any;
  cameraData: any;
  buildingData: any;
  mapGuid: string;
  siteId: number;
  title: string;
  originalSiteMapData: any;
  siteMapData: any;
  addAxisSiteMapData: any = [];
  floorData: any;
  selectedDeleteGuid: number;
  editBuildingData: any = {};
  allowedExtensions = ['jpg', 'jpeg', 'png'];
  errorMessageFileExtension;
  positionXChild: any = 0;
  positionYChild: any = 0;
  backGroundImage: string;
  typeValue: string;
  mapItemType = MapItemType;
  marginX;
  marginY;
  loading = false;
  widthBlank: number;
  heightBlank: number;

  // @ViewChildren('imgsite') imgsite: QueryList<any>;



  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private readonly signalR: SignalrService,
    private dataService: DataService,
    private http: HttpClient) {
    this.siteId = this.route.snapshot.params.siteId;
    this.mapGuid = this.route.snapshot.params.mapGuid;
    this.px = 0;
    this.py = 0;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 20000;
    this.marginX = 300;
    this.marginY = 180;
  }

  /**
   * Bind components (inputs,access point, camera, buildings) to put on map
   */
  ngOnInit() {
    // this.siteId = 5;
    // this.mapGuid = '7ED0E003-45EF-4C93-B89F-05BF5047F159';
    this.dataService.changeMessage(true);
    this.addAxisSiteMapData = [];
    this.bindMapData(this.siteId, this.mapGuid );
    this.utilsService.getSetLanguage();
    this.signalR.initializeSignalRConnect();
  }

  /**
   * Disconnect the signalR
   */
  ngOnDestroy(): void {
    this.dataService.changeMessage(false);
    this.signalR.disconnect();
  }

  // ngAfterViewInit() {
  //  this.imgsite.changes.subscribe(t => {
  //    // const styleElem = document.head.appendChild(document.createElement('style'));
  //    // styleElem.innerHTML = '#imgSitemap {background-image: url(' + this.siteMapData.orginalImage + ');}';

  //    // const vid = document.getElementById('imgSitemap');
  //    // vid.style.content = 'url(' + this.siteMapData.orginalImage + ')';

  //  });
  // }

  area() {
    return this.width * this.height;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;

    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
    this.modelChanged();
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;
    this.width -= offsetX;
    this.height -= offsetY;
    this.modelChanged();
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.y += offsetY;
    this.width += offsetX;
    this.height -= offsetY;
    this.modelChanged();
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.width -= offsetX;
    this.height += offsetY;
    this.modelChanged();
  }

  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;
    this.modelChanged();
  }

  onCornerClick(event: MouseEvent, resizer?: (x, y) => void) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;

    const lastX = this.x;
    const lastY = this.y;
    const pWidth = this.width;
    const pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.area() < this.minArea) {
      this.x = lastX;
      this.y = lastY;
      this.width = pWidth;
      this.height = pHeight;
      this.modelChanged();
    }
    this.px = event.clientX;
    this.py = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }

  /**
   * Bind the datas for floor/Site-map edit
   */
  bindMapData(siteId: any , mapGuid: any) {
    /**
     * Get list of Buildings of site
     * If building id =0 then consider the building edit else floor edit
     */
    const url = urls.siteFloorMap + '?siteId=' + siteId + '&mapGuid=' + mapGuid;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200 && res.data != null) {
          this.siteMapData = res.data;
          this.siteMapData.orginalImage = res.data.image.replace('maps', 'originalmaps');

          this.x = this.siteMapData.x + this.marginX;
          this.y = this.siteMapData.y + this.marginY;

          // if (!this.siteMapData.image) {
          //  this.x = 584;
          //  this.y = 179;
          // }

          // let localHeight = 300;
          // let localWidth = 600;

          const img = new Image();
          img.onload = () => {
            this.width = img.naturalWidth;
            this.height = img.naturalHeight;
          };
          img.src = res.data.image;


          const imgBlank = new Image();
          imgBlank.onload = () => {
            this.widthBlank = imgBlank.naturalWidth;
            this.heightBlank = imgBlank.naturalHeight;
          };
          imgBlank.src = '../assets/img/blank-sitemap.png';

          this.siteMapData.mapItem.forEach(siteObj => {
            siteObj.UniqueId = siteObj.mapItemId;
          });
          // Keep this data to check on submit, to delete status
          this.originalSiteMapData = JSON.parse(JSON.stringify(res.data));

          // If the building is 0 then, consider the site-map else floor
          if (res.data.buildingId === 0) {
            this.title = 'Map Editor';
            this.bindBuildingData();
          } else {
            this.title = 'Map Editor';
            this.getInputs();
            this.getCameras();
            this.getAccessPoints();
          }
        }
      },
      (err: any) => {
        if (err.error != null && err.error.message != null) {
        }
      }
    );

  }

  /**
   * Set blank image for default site map background and convert to into binary string
   */
  setBlankImage() {

    this.http.get('../assets/img/blank-sitemap.png', { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          this.siteMapData.action = ActionType.Update;
          this.siteMapData.image = event.target.result;
        };

        reader.onerror = (event: any) => {
          console.log('File could not be read: ' + event.target.error.code);
        };

      });
  }

  /**
   * Bind site-map detail to display on page
   */
  bindBuildingData() {
    const url = urls.mapComponent + '/' + this.siteId + '?type=' + MapItemType.Building;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.buildingData = res.data;
      }
    });
  }

  /**
   * Get list of Inputs of floor
   */
  getInputs() {
    const url = urls.mapComponent + '/' + this.siteId + '?type=' + MapItemType.Input;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.inputData = res.data;
      }
    });
  }

  /**
   * Get list of Access points of floor
   */
  getAccessPoints() {
    const url = urls.mapComponent + '/' + this.siteId + '?type=' + MapItemType.AccessPoint;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.accessPointData = res.data;
      }
    });
  }

  /**
   * Get list of cameras of floor
   */
  getCameras() {
    const url = urls.mapComponent + '/' + this.siteId + '?type=' + MapItemType.Camera;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        this.cameraData = res.data;
      }
    });
  }

  /**
   * Return loader property
   */
  isLoader(): boolean {
    return this.loading;
  }

  /**
   * Redirect to respective page.
   */
  redirectToPage(mapGuid) {
    const curSiteId = this.siteId;
    this.router.navigate(['./monitoring/site-map/edit-map', { siteId: curSiteId, mapGuid: mapGuid }]);
    this.bindMapData(curSiteId, mapGuid);
  }
  /**
   * Save the entire detail of map and redirect to source page
   * @param event
   */
  onSaveMapDetail(event) {
    this.loading = true;
    // Assign the changed value to original variable and send this object to save
    this.originalSiteMapData.action = this.siteMapData.action;
    this.originalSiteMapData.image = this.siteMapData.image;


    if (this.originalSiteMapData.mapItem.length !== 0 || this.siteMapData.mapItem.length !== 0) {
      if (this.originalSiteMapData.mapItem.length === 0) {
        // If no older items then consider all the items
        this.originalSiteMapData.mapItem = this.siteMapData.mapItem;
      } else {
        // Add the item to save list, that has added newly
        this.siteMapData.mapItem.forEach(siteMapObj => {

          if (siteMapObj.type === MapItemType[MapItemType.Building]) {
            const siteMapTemp = this.originalSiteMapData.mapItem.find(i => i.itemGuid === siteMapObj.itemGuid);
            if (!siteMapTemp) {
              this.originalSiteMapData.mapItem.push(siteMapObj);
            }
          } else {
            const siteMapTemp = this.originalSiteMapData.mapItem.find(i => i.panelGuid === siteMapObj.panelGuid && i.itemId === siteMapObj.itemId && i.type === siteMapObj.type);
            if (!siteMapTemp) {
              this.originalSiteMapData.mapItem.push(siteMapObj);
            }
          }

        });

        // If item removed then change status to delete
        this.originalSiteMapData.mapItem.forEach(obj => {

          if (obj.type === MapItemType[MapItemType.Building]) {
            const siteMapTemp = this.siteMapData.mapItem.find(i => i.itemGuid === obj.itemGuid);
            if (!siteMapTemp) {
              obj.action = ActionType.Delete;
            }
          } else {
            const siteMapTemp = this.siteMapData.mapItem.find(i => i.panelGuid === obj.panelGuid && i.itemId === obj.itemId && i.type === obj.type);
            if (!siteMapTemp) {
              obj.action = ActionType.Delete;
            }
          }

        });
      }

      // Update the axis of original variables
      this.originalSiteMapData.mapItem.forEach(siteMapObj => {
        this.addAxisSiteMapData.forEach(axisSiteMapObj => {
          if (siteMapObj.type === MapItemType[MapItemType.Building]) {
            if (axisSiteMapObj.itemGuid === siteMapObj.itemGuid) {
              siteMapObj.x = axisSiteMapObj.x.toFixed();
              siteMapObj.y = axisSiteMapObj.y.toFixed();
            }
          } else {
            if (axisSiteMapObj.panelGuid === siteMapObj.panelGuid && axisSiteMapObj.itemId === siteMapObj.itemId && axisSiteMapObj.type === siteMapObj.type) {
              siteMapObj.x = axisSiteMapObj.x.toFixed();
              siteMapObj.y = axisSiteMapObj.y.toFixed();
            }
          }

          // If action is null and axis change object has value then consider action of axis status to site object
          if (siteMapObj.action === null) {
            siteMapObj.action = axisSiteMapObj.action;
          }

        });
      });

    }

    this.originalSiteMapData.title = this.siteMapData.title;
    this.originalSiteMapData.x = this.x - this.marginX;
    this.originalSiteMapData.y = this.y - this.marginY;
    this.originalSiteMapData.width = this.width;
    this.originalSiteMapData.height = this.height;


    // Render data to api for save
    const url = urls.siteFloorMap;
    this.httpService.postRequest(url, JSON.stringify(this.originalSiteMapData)).subscribe((res: any) => {
      if (res != null) {
        if (res.success && res.message.messageCode === 200) {
          // this.addAxisSiteMapData = [];
          // this.bindMapData();
          // this.ngOnInit();

          let isMapItemChanged = false;
          // Check any item of site map changed
          this.originalSiteMapData.mapItem.forEach(objData => {
            // Not considuring the action type none (0) to hit SignalR
            if (objData.action > 0) {
              isMapItemChanged = true;
            }
          });


          if (this.originalSiteMapData.action > 0) {
            console.log(ObjectType.Building, this.originalSiteMapData.buildingGuid, this.utilsService.getChangeTypeByAction(this.originalSiteMapData.action));
            this.signalR.sendConfigStatusChanged(ObjectType.Building, this.originalSiteMapData.buildingGuid, this.utilsService.getChangeTypeByAction(this.originalSiteMapData.action));
          }

          // Not considuring the action type none (0) to hit SignalR
          if (this.originalSiteMapData.action > 0 || isMapItemChanged) {
            console.log(ObjectType.SiteMap, this.local.getSiteGuid() + '_' + this.originalSiteMapData.id, ChangeType.Modified);
            this.signalR.sendConfigStatusChanged(ObjectType.SiteMap, this.local.getSiteGuid() + '_' + this.originalSiteMapData.id, ChangeType.Modified);
          }

          setTimeout(() => {
            if (localStorage.getItem('editRequestFrom') === EditRequestedFrom.Floor.toString()) {
              this.router.navigate(['/monitoring/site-map/floor', { siteId: this.siteId, mapGuid: this.mapGuid }]);
            } else {

              const editRequestFrom: string = this.local.getEditBuildingRequestedFrom();
              if (editRequestFrom === EditBuildingRequestedFrom.Building.toString()) {
                const curBuildingId = this.local.getCurrentBuildingId();
                this.router.navigate(['./monitoring/site-map/edit-building', { buildingId: curBuildingId }]);
              } else {
                this.router.navigate(['./monitoring/site-map/edit-building']);
              }
            }
          }, 2000);

        } else {
          this.loading = false;
          const ok: any = this.translate.get('editMap.ok');
          swal({
            title: '',
            text: res.message.description,
            type: 'warning',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: ok.value,
            buttonsStyling: false
          });
        }
      }
    });

  }

  /**
   * When changed the title of site-map, action to be update for site map data
   */
  modelChanged() {
    this.siteMapData.action = ActionType.Update;
  }


  /**
   * Set axis of x and y of site items
   * @param event
   * @param uniqueId
   */
  onDragEnded(event, type, itemGuid, itemId, panelGuid) {
    const outer = document.getElementById('divSource');
    const outerTop = outer.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    const innerTop = event.source.getRootElement().getBoundingClientRect().top + (window.scrollY || window.pageYOffset);

    const outerLeft = outer.getBoundingClientRect().left + (window.scrollX || window.pageXOffset);
    const innerLeft = event.source.getRootElement().getBoundingClientRect().left + (window.scrollX || window.pageXOffset);

    const differenceY = Math.abs(innerTop - outerTop);
    const differenceX = Math.abs(innerLeft - outerLeft);

    let siteMapTemp = null;
    let existAxisSitemMapData = null;

    if (type === MapItemType[MapItemType.Building]) {
      siteMapTemp = this.siteMapData.mapItem.find(i => i.itemGuid === itemGuid);
      existAxisSitemMapData = this.addAxisSiteMapData.find(i => i.itemGuid === itemGuid);
    } else {
      siteMapTemp = this.siteMapData.mapItem.find(i => i.panelGuid === panelGuid && i.itemId === itemId && i.type === type);
      existAxisSitemMapData = this.addAxisSiteMapData.find(i => i.panelGuid === panelGuid && i.itemId === itemId && i.type === type);
    }




    if (existAxisSitemMapData) {
      // If already stored in axis site then only update the axis (Alrady axis changed list)
      existAxisSitemMapData.x = differenceX + 15;
      existAxisSitemMapData.y = differenceY;
    } else {
      // If not found in axis site, but it in site map (Contains all the maps already put on map image)
      const temp = Object.assign({}, siteMapTemp);
      temp.x = differenceX + 15;
      temp.y = differenceY;
      temp.action = ActionType.Update;
      this.addAxisSiteMapData.push(temp);
    }

  }

  /**
   * drop of building
   * @param ev
   */
  drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
  }

  /**
   * Drag of building, and move library data to site
   * @param ev
   */
  drag(ev, sourceItem) {
    const objMapItem: any = {};
    objMapItem.action = ActionType.Create;
    objMapItem.buildingId = this.siteMapData.buildingId;
    objMapItem.itemGuid = sourceItem.itemGuid;
    objMapItem.itemId = sourceItem.itemId;
    objMapItem.mapId = 0;
    objMapItem.mapItemId = 0;
    objMapItem.name = sourceItem.name;
    objMapItem.notes = sourceItem.name;
    objMapItem.panelGuid = sourceItem.panelGuid;
    objMapItem.siteId = this.siteId;
    objMapItem.type = sourceItem.type;
    objMapItem.x = 0;
    objMapItem.y = 0;

    // Created saperate column uniqueId to manipulating data in client sitde. This column not used in database
    let maxNumber = Math.max.apply(Math, this.siteMapData.mapItem.map(function(o) { return o.UniqueId; }));
    if (maxNumber < 0) {
      maxNumber = 0;
    }
    objMapItem.UniqueId = maxNumber + 1;
    this.siteMapData.mapItem.splice(0, 0, objMapItem);
    if (sourceItem.type === MapItemType[MapItemType.Building]) {
      const matchitem = this.buildingData.find(e => e.itemId + e.itemGuid === sourceItem.itemId + sourceItem.itemGuid);
      if (matchitem) {
        matchitem.isUsed = true;
      }
    } else if (sourceItem.type === MapItemType[MapItemType.AccessPoint]) {
      const matchitem = this.accessPointData.find(e => e.itemId + e.panelGuid === sourceItem.itemId + sourceItem.panelGuid);
      if (matchitem) {
        matchitem.isUsed = true;
      }
    } else if (sourceItem.type === MapItemType[MapItemType.Input]) {
      const matchitem = this.inputData.find(e => e.itemId + e.panelGuid === sourceItem.itemId + sourceItem.panelGuid);
      if (matchitem) {
        matchitem.isUsed = true;
      }
    } else if (sourceItem.type === MapItemType[MapItemType.Camera]) {
      const matchitem = this.cameraData.find(e => e.itemId + e.panelGuid === sourceItem.itemId + sourceItem.panelGuid);
      if (matchitem) {
        matchitem.isUsed = true;
      }
    }
    ev.preventDefault();
  }

  /**
   * Selected building item assign for delete
   * * @param ev
   * @param uniqueId
   */
  selectedDeleteBuilding(ev, uniqueId, type) {
    console.log('uniqued id delete ' + uniqueId + 'type deleted ' + type);
    this.selectedDeleteGuid = uniqueId;
    this.typeValue = type;
  }

  /**
   * To delete the building from site map and add building to liberary
   * @param ev
   */
  onRemoveBuildingClick(ev) {
    const deleteConfirmVal: any = this.translate.get('editMap.areYouSureYouWantToDeleteTheItem');
    const nonRevertConfirmVal: any = this.translate.get('editMap.youWouldNotBeAbleToRevertThis');
    const warningVal: any = this.translate.get('editMap.warning');
    const ok: any = this.translate.get('editMap.ok');
    const deleteVal: any = this.translate.get('editMap.yesDeleteIt');
    const cancel: any = this.translate.get('editMap.cancel');
    const pleaseselectanyitemwhichyouwanttoremove: any = this.translate.get('editMap.pleaseselectanyitemwhichyouwanttoremove');
    if (this.selectedDeleteGuid === undefined || this.selectedDeleteGuid < 0) {
      swal({
        title: pleaseselectanyitemwhichyouwanttoremove.value,
        type: 'warning',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: ok.value,
        buttonsStyling: false
      });
    } else {
      swal({
        title: deleteConfirmVal.value,
        text: nonRevertConfirmVal.value,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        cancelButtonText : cancel.value,
        confirmButtonText: deleteVal.value,
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          // Find item from site map building and assign no axis and
          // Add that building data for left pannel list of building
          const obj: any = this.siteMapData.mapItem.find(i => i.UniqueId === this.selectedDeleteGuid);
          obj.x = 0;
          obj.y = 0;
          const sDetail = this.siteMapData.mapItem.find(e => e.UniqueId === this.selectedDeleteGuid);
          if (this.typeValue === MapItemType[MapItemType.Building]) {
            const matchitem = this.buildingData.find(z => z.itemId + z.itemGuid === sDetail.itemId + sDetail.itemGuid );
            if (matchitem) {
              matchitem.isUsed = false;
            }
          } else if (this.typeValue === MapItemType[MapItemType.AccessPoint]) {
            const matchitem = this.accessPointData.find(z => z.itemId + z.panelGuid === sDetail.itemId + sDetail.panelGuid );
            if (matchitem) {
              matchitem.isUsed = false;
            }
          } else if (this.typeValue === MapItemType[MapItemType.Input]) {
            const matchitem = this.inputData.find(z => z.itemId + z.panelGuid === sDetail.itemId + sDetail.panelGuid );
            if (matchitem) {
              matchitem.isUsed = false;
            }
          } else if (this.typeValue === MapItemType[MapItemType.Camera]) {
            const matchitem = this.cameraData.find(z => z.itemId + z.panelGuid === sDetail.itemId + sDetail.panelGuid );
            if (matchitem) {
              matchitem.isUsed = false;
            }
          }
          // Remove the building from site map after delete
          const index = this.siteMapData.mapItem.map(function(e) { return e.UniqueId; }).indexOf(this.selectedDeleteGuid);
          if (index > -1) {
            this.siteMapData.mapItem.splice(index, 1);
          }
          // Remove the selected guid id, because only one building can delete ones,
          this.selectedDeleteGuid = -1;
        }
      });
    }
  }

  /**
   * Set blank image on clicking on "No Image" forcefully
   */
  useBlankImage() {
    this.siteMapData.image = '';
    this.siteMapData.action = ActionType.Update;
  }

  /**
   * To upload the image for map
   * @param event
   */
  onOpenUpload(event) {
    this.errorMessageFileExtension = '';
    this.backGroundImage = this.siteMapData.image;
  }

  /**
   * Chnage site image on upload
   * @param ev
   */
  onSelectFloorFile(ev) {
    this.errorMessageFileExtension = '';
    this.readImageFile(event);
  }

  /**
   * Change background image of floor
   * @param ev
   */
  onUploadSubmitted(ev) {
    this.siteMapData.image = this.backGroundImage;
    this.siteMapData.orginalImage = this.backGroundImage;
    this.siteMapData.action = ActionType.Update;
    this.x = this.marginX;
    this.y = this.marginY;
    this.px = 0;
    this.py = 0;
    this.height = 400;
    this.width = 1000;
    $('#siteMapImageUpload').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * readImageFile - read image file from the browser
   * @param event
   */
  readImageFile(event) {
    if (event.target.files.length === 0) {
      return;
    }
    const fname = event.target.files[0].name;
    const fextension = fname.substring(fname.lastIndexOf('.') + 1);
    const self = this;

    /**
     * check if extension of selected file exists in the array
     */
    if (!this.utilsService.isInArray(this.allowedExtensions, fextension)) {
      this.errorMessageFileExtension = 'Only ' + this.allowedExtensions.toString() + ' images are supported.';
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

        // Check height width of image
        // const img = new Image();
        // img.onload = function() {
        //  const fixedImageHeight = 600;
        //  const fixedImageWidth = 1300;
        //  if (img.naturalHeight > fixedImageHeight || img.naturalWidth > fixedImageWidth) {
        //    self.backGroundImage = self.siteMapData.image;
        //    self.errorMessageFileExtension = 'Invalid image size. Maximum size should be less than or equal to ' + fixedImageHeight + '*' + fixedImageWidth + ' px.';
        //    return;
        //  }
        // };
        // img.src = ev.target.result;
        this.backGroundImage = ev.target.result;
      };
    }
  }

}

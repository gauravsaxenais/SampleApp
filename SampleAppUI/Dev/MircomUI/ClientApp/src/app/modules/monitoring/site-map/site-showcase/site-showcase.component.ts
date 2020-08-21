import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditBuildingRequestedFrom } from '../../../../shared/enums';
import { ConfigService } from '../../../../services/config.service';


@Component({
  selector: 'app-site-showcase',
  templateUrl: './site-showcase.component.html',
  styleUrls: ['./site-showcase.component.css']
})
export class SiteShowcaseComponent implements OnInit {

  /**
   * Variables declaration
   */
  eventsData: any = [];
  isExpandable: boolean;
  siteId: string = this.local.getSiteId();
  siteShowCaseList: any = [];
  selectedShowCaseName: string;

  constructor(
    private httpService: HttpService,
    private local: LocalStorageService,
    private config: NgbCarouselConfig,
    private router: Router,
    private localConfig: ConfigService
  ) {
    config.interval = this.localConfig.getConfig().carouselConfigInterval;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
  }


  ngOnInit() {
    this.bindEventsData();
    this.getBuildingsDetails();
  }

  /**
   * getBuildingsDetails - Get details of building
   */
  getBuildingsDetails() {
    const url = urls.siteshowcase + '/' + this.siteId;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        res.data.forEach((buildingItem, index) => {
          const obj: any = {};
          obj.eventDescription = buildingItem.description;
          obj.img = buildingItem.showcaseFile;
          obj.slideId = index;
          this.siteShowCaseList.push(obj);
        });
        this.selectedShowCaseName = this.siteShowCaseList[0].eventDescription;
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
    });
  }

  /**
   * Redirect to edit building mode
   * @param event
   */
  redirectToEditBuilding(event) {
    this.local.sendEditBuildingRequestedFrom(EditBuildingRequestedFrom.ShowCase.toString());
    this.router.navigate(['./monitoring/site-map/edit-building']);
  }

  /**
   * Redirect to edit building mode
   * @param event
   */
  redirectToMap($event) {
    this.router.navigate(['./monitoring/site-map']);
  }

  /**
   * Get events data from the api and bind response locally
   */
  bindEventsData() {
    const reqModel: EventRequest = {
      startTime: null,
      endTime: null,
      description: '',
      severity: [],
      siteIds: [
        this.local.getSiteId()
      ],
      mostRecent: 0
    };
    const url = urls.events;
    this.httpService.postRequest(url, reqModel).subscribe((response: any) => {
      if (response.success && response.data != null) {
        // response ok
        if (response.success) {
          this.eventsData = response.data;
        }
      }
    }, (error) => {
      // error
      console.log(error);
    });
  }

  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

  onSlide(slideData) {
    const showCaseName = this.siteShowCaseList.find(z => z.slideId === slideData.current);
    if (showCaseName) {
      this.selectedShowCaseName = showCaseName.eventDescription;
    }
  }

}

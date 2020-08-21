import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditBuildingRequestedFrom } from '../../../../shared/enums';


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

  constructor(
    private httpService: HttpService,
    private local: LocalStorageService,
    private config: NgbCarouselConfig,
    private router: Router
  ) {
    config.interval = 2000;
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
        console.log(res.data);
        res.data.forEach((buildingItem) => {
          const obj: any = {};
          obj.eventDescription = buildingItem.description;
          obj.img = buildingItem.showcaseFile;
          this.siteShowCaseList.push(obj);
        });
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

}

/**
 * Import dependencies
 */
import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { MapsAPILoader } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { google } from 'google-maps';
import { UtilsService } from 'src/app/services/utility.services';
import { TranslateService } from '@ngx-translate/core';

declare var google: google;


@Component({
  selector: 'app-site-map-view',
  templateUrl: './site-map-view.component.html',
  styleUrls: ['./site-map-view.component.css']
})

/**
 * Create site map view component
 */
export class SiteMapViewComponent implements OnInit {
  /**
   * Variables declaration
   */
  lat: number;
  lng: number;
  zoom: number;
  markers: any = [];
  selectedSiteId: any;
  sitesData: any;
  geocoder: any;
  previous: any;

  /**
   * Inject the services in the constructor
   * @param router
   * @param httpService
   * @param local
   * @param mapsApiLoader
   * @param zone
   * @param wrapper
   * @param ref
   */
  constructor(
    private router: Router,
    private httpService: HttpService,
    private local: LocalStorageService,
    public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef

  ) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;

  }

  /**
   * OnInit - get last zoom level
   * Get last selected Map coordinates
   * Get sites data
   */
  ngOnInit() {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      if (this.local.getZoomValue()) {
        this.zoom = Number(this.local.getZoomValue());
      } else {
        this.zoom = 17;
      }
      this.lat = Number(this.local.getLastSelectedLatitude());
      this.lng = Number(this.local.getLastSelectedLongitude());
      this.selectedSiteId = this.local.getSiteId();
      this.getSites();
      this.utilsService.getSetLanguage();
    });

  }

  /**
   * onMapclick - save map coordinates in local storage
   * @param event
   */
  onMapclick(event) {
    this.local.sendLastSelectedLatitude(event.coords.lat);
    this.local.sendLastSelectedLongitude(event.coords.lng);
  }

  /**
   * zoomChange - save zoom level in local storage
   * @param event
   */
  zoomChange(event) {
    this.local.sendZoom(event);
  }

  /**
   * findLocation - fetch map coordinates from address by using geocoder API
   * @param address
   * @param siteInfo
   */
  findLocation(address, siteInfo) {
    if (address) {
      if (!this.geocoder) {
        this.geocoder = new google.maps.Geocoder();
      }
      /**
       * Call Geocoder API with Address as a parameter
       */
      this.geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0].geometry.location) {
            const markerObj: any = {};
            markerObj.lat = results[0].geometry.location.lat();
            markerObj.lng = results[0].geometry.location.lng();
            markerObj.siteInfo = siteInfo;
            markerObj.label = {};
            markerObj.label.fontWeight = 'bold';
            markerObj.label.text = siteInfo.name;
            markerObj.label.color = 'red';
            if (siteInfo.id === Number(this.selectedSiteId)) {
              markerObj.selectedSite = true;
              if (!this.lat || !this.lng) {
                this.lat = results[0].geometry.location.lat();
                this.lng = results[0].geometry.location.lng();
              }
            } else {
              markerObj.selectedSite = false;
            }
            this.markers.push(markerObj);
            this.ref.detectChanges();
          }
        } else {
          const searchError: any = this.translate.get('siteMapView.searchError');
          // alert(searchError.value);
        }
      });
    }
  }

  /**
   * redirectToDashboard - on click of arrow icon, go to dashboard screen
   * @param selectedMarker
   */
  redirectToDashboard(selectedMarker, ev) {
    this.local.sendLastSelectedLatitude(selectedMarker.lat);
    this.local.sendLastSelectedLongitude(selectedMarker.lng);
    const selectedSite = selectedMarker.siteInfo;
    this.markers.forEach(markerObj => {
      if (selectedSite.id === markerObj.siteInfo.id) {
        markerObj.selectedSite = true;
      } else {
        markerObj.selectedSite = false;
      }
    });
    if (selectedSite.mapGuid !== '00000000-0000-0000-0000-000000000000') {
      /**
       * siteId, siteGuid, mapGuid and mapId parameters are required in Dashboard
       */
      this.local.sendSiteId(selectedSite.id);
      this.local.sendMapGuid(selectedSite.mapGuid);
      this.local.sendMapId(selectedSite.mapId);
      this.local.sendSiteGuid(selectedSite.siteGuid);

      /**
       * Redirect to Monitoring dashboard
       */
      this.router.navigate(['/monitoring/dashboard']);
    } else {
      const noDataMessage: any = this.translate.get('siteMapView.noDataMessage');
      alert(noDataMessage.value);
    }
  }

  /**
   * clickedMarker - close previos info window
   * @param infowindow
   */
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  /**
   * redirectToSiteListView - Redirect to site list view
   * @param ev
   */
  redirectToSiteListView(ev) {
    this.router.navigate(['/site']);
  }

  /**
   * redirectToEditSite - Redirect to edit site screen
   * @param ev
   */
  redirectToEditSite(ev) {
    this.router.navigate(['/site/site-edit']);
  }

  /**
   * getSites - Get sites data from api
   * then find location by sending address as a parameter
   */
  private getSites() {
    const url = urls.sites;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.message !== null) {
        if (res.message.messageCode === 200 && res.data !== null) {
          this.sitesData = res.data;
          this.sitesData.forEach(siteObj => {
            let fullAddress: string = siteObj.address || '';
            if (siteObj.city) {
              fullAddress = fullAddress + ' ' + siteObj.city;
            }
            if (siteObj.province) {
              fullAddress = fullAddress + ' ' + siteObj.province;
            }
            if (siteObj.country) {
              fullAddress = fullAddress + ' ' + siteObj.country;
            }
            this.findLocation(fullAddress, siteObj);
          });

        } else {
          alert(res.message.description);
        }
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
        alert(err.error.message.description);
      }
    });

  }

}

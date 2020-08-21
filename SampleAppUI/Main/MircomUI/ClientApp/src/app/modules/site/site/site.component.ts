/**
 * Import dependencies
 */
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTable, MatSort, MatSortable, MatSortHeader, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http.service';
import { urls } from 'src/app/services/urls';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utility.services';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
/**
 * Create site component
 */
export class SiteComponent implements OnInit {
  /**
   * Variables declaration
   */
  @ViewChild('table', { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['name', 'description', 'rowSelectedArrow'];
  dataSource: any = new MatTableDataSource([]);
  sitesData: [];
  selectedSiteId: any;

  /**
   * Inject the services in the constructor
   * @param local
   * @param httpService
   * @param router
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private router: Router,
    private util: UtilsService
  ) { }

  /**
   * OnInit - Get sites data
   */
  ngOnInit() {
    /**
     * Get or set local language
     */
    this.util.getSetLanguage();
    this.selectedSiteId = this.local.getSiteId();
    this.getSites();
  }

  /**
   * redirectToSiteMapView - Redirect to site map view on map icon
   * @param ev
   */
  redirectToSiteMapView(ev) {
    this.router.navigate(['/site/site-map-view']);
  }

  /**
   * redirectToEditSite - Redirect to site edit view on map icon
   * @param ev
   */
  redirectToEditSite(ev) {
    this.router.navigate(['/site/site-edit']);
  }

  /**
   * selectSite - site selected on arrow click
   * @param ev
   * @param selectedElement
   */
  selectSite(ev, selectedElement) {
    selectedElement.isSiteHighlighted = true;
    /**
     * siteId, siteGuid, mapGuid and mapId parameters are required in Dashboard
     */
    this.local.sendSiteId(selectedElement.id);
    this.local.sendMapGuid(selectedElement.mapGuid);
    this.local.sendMapId(selectedElement.mapId);
    this.local.sendSiteGuid(selectedElement.siteGuid);
    this.local.sendReportGuid(selectedElement.reportGuid);

    /**
     * Redirect to Monitoring dashboard
     */
    this.router.navigate(['/monitoring/dashboard']);
  }

  /**
   * Get sites data from api
   */
  private getSites() {
    const url = urls.sites;
    this.httpService.getRequest(url).subscribe((res: any) => {
      if (res.success && res.data != null) {
        /**
         * Map data into DataSource
         */
        this.dataSource = new MatTableDataSource(res.data);

        /**
         *  Implementing sorting in the table
         */
        this.dataSource.sortingDataAccessor = (value, sortHeaderId) => value[sortHeaderId].toLocaleLowerCase();
        this.dataSource.sort = this.sort;
      }
    }, (err: any) => {
      if (err.error != null && err.error.message != null) {
      }
    });

  }
}

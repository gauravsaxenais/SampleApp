/**
 * Import dependencies
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventSeverity } from 'src/app/shared/enums';
import { SignalrService } from 'src/app/services/signalR.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-monitoring-event',
  templateUrl: './monitoring-event.component.html',
  styleUrls: ['./monitoring-event.component.css']
})

/**
 * Create access event component
 */
export class MonitoringEventComponent implements OnInit {

  /**
   * variables declaration
   */
  @Output() eventExpandableChanged: EventEmitter<boolean> = new EventEmitter();
  eventModel: any;
  @Input() eventsData: any;
  @Input() isExpand: boolean;
  eventSeverity = EventSeverity;

  /**
   * Inject the services in the constructor
   */
  constructor(private readonly signalR: SignalrService, private router: Router) { }

  /**
   * Initilize the objects
   */
  ngOnInit() {
  }

  /**
   * Initilize access point data
   */
  eventsExpand(event: Event) {
    this.isExpand = true;
    this.eventExpandableChanged.emit(this.isExpand);
    // $('.table-container').removeAttr('style');
  }

  /**
   * @param event
   * Set the expended value for event
   */
  eventsNotExpand(event: Event) {
  //  this.signalR.initializeSignalRConnect();
    // this.signalR.setBroadcastEvent();
    this.isExpand = false;
    this.eventExpandableChanged.emit(this.isExpand);
  }

  popUpCamera(ev, channelGuid, timeStamp) {
    const camPopupWinWidth = 800;
    const camPopupWinHeight = 600;
    const left = (window.screen.width - camPopupWinWidth) / 2;
    const top = (window.screen.height - camPopupWinHeight) / 4;

    if (channelGuid && channelGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/cameraSinglePopup/' + channelGuid + '/' + timeStamp, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=' + camPopupWinWidth + ',height=' + camPopupWinHeight + ',top=' + top + ',left' + left + ',screenX=' + left + ',screenY=' + top);
      });
    }
  }


  popUpMap(ev, mapGuid, mapId) {
    if (mapGuid && mapGuid !== '00000000-0000-0000-0000-000000000000') {
      this.router.navigate([]).then(result => {
        window.open('#/siteMapView/' + mapGuid, '_blank',
          'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
      });
    }
  }

}




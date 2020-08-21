/**
 * Import dependencies
 */
import { Injectable, OnDestroy } from '@angular/core';
declare var $: any;
import { ConfigService } from '../services/config.service';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class SignalrService {

  /**
   * Declare variables
   */
  observableEvent = new BehaviorSubject<string>('');
  observablePanelStatusChange = new BehaviorSubject<string>('');
  observableMapItemsStatus = new BehaviorSubject<string>('');
  observableBuildingStatus = new BehaviorSubject<string>('');
  observableFloorMapItemsStatus = new BehaviorSubject<string>('');
  observableAccessPointItemsStatus = new BehaviorSubject<string>('');
  observableMapConfigStatusChanged = new BehaviorSubject<string>('');
  observableFloorConfigStatusChanged = new BehaviorSubject<string>('');
  observableBuildingConfigStatusChanged = new BehaviorSubject<string>('');


  /**
   * Inject the services in the constructor
   */
  constructor(private local: LocalStorageService, private configService: ConfigService) { }
  private connection: any;
  private proxy: any;

  /**
   * Initilize the signalR connection
   */
  public initializeSignalRConnect(): void {
    const signalRServerEndPoint = this.configService.getConfig().signalRUrl;
    this.connection = $.hubConnection(signalRServerEndPoint);
    this.proxy = this.connection.createHubProxy('SignalRHub');
  }

  /**
   *  Invoke the signalR for events (Alarm, Warning, Normal)
   */
  public setBroadcastEvent() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedEvent(serverMessage));

    this.connection.start().done((data: any) => {
      this.leaveEventsGroup();
      this.proxy.invoke('JoinGroup', 'AlarmEvent_' + this.local.getSiteGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });
      this.proxy.invoke('JoinGroup', 'WarningEvent_' + this.local.getSiteGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });
      this.proxy.invoke('JoinGroup', 'NormalEvent_' + this.local.getSiteGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });
    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Invoke the signalR for Panel status change
   */
  public setBroadcastPanelStatusChange() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedPanelStatusChange(serverMessage));

    this.connection.start().done((data: any) => {
      this.leavePanelStatusChangedGroup();
      this.proxy.invoke('JoinGroup', 'PanelStatusChanged_' + this.local.getSiteGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });
    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Invoke the signalR for map item (site-map)
   */
  public setBroadcastMapItemsStatus() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedStatus(serverMessage));
    this.connection.start().done((data: any) => {
      this.leaveMapStatusGroup();
      this.proxy.invoke('JoinGroup', 'MapStatusChanged_' + this.local.getSiteGuid() + '_' + this.local.getMapId())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Invoke the signalR for Building
   */
  public setBroadcastBuildingStatus() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedBuildingStatus(serverMessage));
    this.connection.start().done((data: any) => {
      this.leaveBuildingStatusGroup();
      this.proxy.invoke('JoinGroup', 'BuildingStatusChanged_' + this.local.getBuildingGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Invoke the signalR for floor items
   */
  public setBroadcastFloorMapItemsStatus(mapId) {
    if (this.proxy) {
      this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedFloorStatus(serverMessage));
      this.connection.start().done((data: any) => {
        this.leaveFloorMapStatusGroup(mapId);
        this.proxy.invoke('JoinGroup', 'MapStatusChanged_' + this.local.getSiteGuid() + '_' + this.local.getFloorMapId())
          .catch((error: any) => {
            console.log('broadcastMessage error -> ' + error);
          });

      }).catch((error: any) => {
        console.log('Notification Hub error -> ' + error);
      });
    }
  }

  /**
   *  Invoke the signalR for access point
   */
  public setBroadcastAccessPointItemsStatus() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedAccessPointStatus(serverMessage));
    this.connection.start().done((data: any) => {
      this.leaveAccessPointStatusGroup();
      this.proxy.invoke('JoinGroup', 'AccessPointStatusChanged_' + this.local.getSiteGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Set the signalR for access point commands
   */
  public sendAccessPointCommand(objectId, command) {
    this.connection.start().done((data: any) => {
      this.proxy.invoke('SendAccessPointCommand', objectId, command)
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Set the signalR for configuration status change
   */
  public sendConfigStatusChanged(objectType, objectId, changeType) {
    this.connection.start().done((data: any) => {
      this.proxy.invoke('NotifyConfigChanged', objectType, objectId, changeType)
        .catch((error: any) => {
          console.log('broadcastMessage for configuration status change error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error for configuration status change-> ' + error);
    });
  }

  /**
   *  Invoke the signalR for Map config change
   */
  public SetBroadcastMapConfigStatusChanged() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedMapConfigStatusChanged(serverMessage));
    this.connection.start().done((data: any) => {
      this.leaveMapConfigStatusChangedGroup();
      this.proxy.invoke('JoinGroup', 'ConfigChanged_' + this.local.getSiteGuid() + '_' + this.local.getMapId())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Invoke the signalR for Floor config change
   */
  public SetBroadcastFloorConfigStatusChanged() {
    if (this.proxy) {
      this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedFloorConfigStatusChanged(serverMessage));
      this.connection.start().done((data: any) => {
        this.leaveFloorConfigStatusChangedGroup();
        this.proxy.invoke('JoinGroup', 'ConfigChanged_' + this.local.getSiteGuid() + '_' + this.local.getFloorMapId())
          .catch((error: any) => {
            console.log('broadcastMessage error -> ' + error);
          });

      }).catch((error: any) => {
        console.log('Notification Hub error -> ' + error);
      });
    }
  }

  /**
   *  Invoke the signalR for Map config change
   */
  public SetBroadcastBuildingConfigStatusChanged() {
    this.proxy.on('addMessage', (serverMessage) => this.onMessageReceivedBuildingConfigStatusChanged(serverMessage));
    this.connection.start().done((data: any) => {
      this.leaveBuildingConfigStatusChangedGroup();
      this.proxy.invoke('JoinGroup', 'ConfigChanged_' + this.local.getBuildingGuid())
        .catch((error: any) => {
          console.log('broadcastMessage error -> ' + error);
        });

    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }

  /**
   *  Stop the signalR connection
   */
  public disconnect(): void {
    if (this.proxy == null) {
      return;
    }
    this.connection.stop(true, true);
    this.proxy = null;
  }

  /**
   *  Assign signalR value to behaviour subject for event
   */
  private onMessageReceivedEvent(serverMessage: string): void {
    this.observableEvent.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for Panel status change
   */
  private onMessageReceivedPanelStatusChange(serverMessage: string): void {
    this.observablePanelStatusChange.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for Status of site-map
   */
  private onMessageReceivedStatus(serverMessage: string): void {
    this.observableMapItemsStatus.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for floor items
   */
  private onMessageReceivedFloorStatus(serverMessage: string): void {
    this.observableFloorMapItemsStatus.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for building
   */
  private onMessageReceivedBuildingStatus(serverMessage: string): void {
    this.observableBuildingStatus.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for access point status
   */
  private onMessageReceivedAccessPointStatus(serverMessage: string): void {
    this.observableAccessPointItemsStatus.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for map configuration status change
   */
  private onMessageReceivedMapConfigStatusChanged(serverMessage: string): void {
    this.observableMapConfigStatusChanged.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for building configuration status change
   */
  private onMessageReceivedBuildingConfigStatusChanged(serverMessage: string): void {
    this.observableBuildingConfigStatusChanged.next(serverMessage);
  }

  /**
   *  Assign signalR value to behaviour subject for floor configuration status change
   */
  private onMessageReceivedFloorConfigStatusChanged(serverMessage: string): void {
    this.observableFloorConfigStatusChanged.next(serverMessage);
  }


  /**
   *  Before invoking new signalR, we are leave the older signalR group for event
   */
  private leaveEventsGroup() {
    this.proxy.invoke('LeaveGroup', 'AlarmEvent_' + this.local.getSiteGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
    this.proxy.invoke('LeaveGroup', 'WarningEvent_' + this.local.getSiteGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
    this.proxy.invoke('LeaveGroup', 'NormalEvent_' + this.local.getSiteGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for site-map
   */
  private leaveMapStatusGroup() {
    this.proxy.invoke('LeaveGroup', 'MapStatusChanged_' + this.local.getSiteGuid() + '_' + this.local.getMapId())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for building
   */
  private leaveBuildingStatusGroup() {
    this.proxy.invoke('LeaveGroup', 'BuildingStatusChanged_' + this.local.getBuildingGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for floor
   */
  private leaveFloorMapStatusGroup(mapId) {
    this.proxy.invoke('LeaveGroup', 'MapStatusChanged_' + this.local.getSiteGuid() + '_' + mapId)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for access point status
   */
  private leaveAccessPointStatusGroup() {
    this.proxy.invoke('LeaveGroup', 'AccessPointStatusChanged_' + this.local.getSiteGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for panel status changed
   */
  private leavePanelStatusChangedGroup() {
    this.proxy.invoke('LeaveGroup', 'PanelStatusChanged_' + this.local.getSiteGuid())
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for map configuration status change
   */
  private leaveMapConfigStatusChangedGroup() {
    this.proxy.invoke('LeaveGroup', 'ConfigChanged_' + this.local.getSiteGuid() + '_' + this.local.getMapId())
      .catch((error: any) => {
        console.log('broadcastMessage map config status changed error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for floor configuration status change
   */
  private leaveFloorConfigStatusChangedGroup() {
    this.proxy.invoke('LeaveGroup', 'ConfigChanged_' + this.local.getSiteGuid() + '_' + this.local.getFloorMapId())
      .catch((error: any) => {
        console.log('broadcastMessage floor config status changed error -> ' + error);
      });
  }

  /**
   *  Before invoking new signalR, we are leave the older signalR group for building configuration status change
   */
  private leaveBuildingConfigStatusChangedGroup() {
    this.proxy.invoke('LeaveGroup', 'ConfigChanged_' + this.local.getBuildingGuid())
      .catch((error: any) => {
        console.log('broadcastMessage building config status changed error -> ' + error);
      });
  }


}

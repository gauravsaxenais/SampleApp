/**
 * Import dependencies
 */
import { Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CameraLayoutID, VideoServerType } from 'src/app/shared/enums';
import { DataService } from 'src/app/services/data.service';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utility.services';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { urls } from 'src/app/services/urls';
import { SignalrService } from 'src/app/services/signalR.service';
import { Subscription, Observable } from 'rxjs';
import { EventRequest } from 'src/app/shared/interfaces/eventInterfaces';
import { ConfigService } from '../../../../services/config.service';
import { TranslateService } from '@ngx-translate/core';
declare var EVWEB2: any;
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})

/**
 * Monitoring camera component
 */
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Variables declaration
   */
  mediaServerUrl = this.configService.getConfig().mediaServerUrl;
  cameraLayoutID = CameraLayoutID;
  siteId = this.local.getSiteId();
  cameraData: any = [];
  isExpandable: boolean;
  subscription: Subscription;
  eventsData: any = [];
  remoteVideo = '_remote_video';

  index = 0;
  v: any;
  selectedTabData: any;
  videoTagsList: any = [];
  myId: any = {};
  remoteVideoElement: any = {};
  pc: any = {};
  vidTag: any = {};
  elemMap = new Map();
  connectionRTC: any = {};
  pcConfig = { iceServers: [{ urls: this.configService.getConfig().iceServerUrl }] };
  mediaConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }
  };
  selectedCamData: any = {};
  execQServerUrl: string;
  execQUserId: string;
  execQUserPassword: string;

  @ViewChildren('allCameras') allCameraViewItems: QueryList<any>;
  /**
   * Inject the services in the constructor
   */
  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private httpService: HttpService,
    private utilsService: UtilsService,
    private local: LocalStorageService,
    private router: Router,
    private readonly signalR: SignalrService,
    private configService: ConfigService,
    private ref: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  /**
   * OnInit - Get signalR, Event and bind camera data
   */
  ngOnInit() {
    this.signalR.initializeSignalRConnect();
    this.signalR.setBroadcastEvent();
    this.bindEventsData();
    this.subscription = this.signalR.observableEvent
      .subscribe(item => {
        this.mapSignalREventData(item);
      });

    this.bindCameraData();
  }

  /**
   * onGetServersResponse - Get Server List
   * @param response
   * @param servers
   */
  onGetServersResponse(response, servers) {
    if (!response.success) {
      alert('Service.getServers failed: ' + response.errorText);
      return;
    }
    const myServer = servers[1];
    myServer.login(this.onLoginServerResponse.bind(this), this.execQUserId, this.execQUserPassword);

  }

  /**
   * onLoginServerResponse - After Login Get Camera
   * @param response
   * @param server
   */
  onLoginServerResponse(response, server) {
    if (!response.success) {
      alert('Problem logging in. Check your connection settings.');
      return;
    }

    // Retrieve the camera list
    server.getCameras(this.onGetCamerasResponse.bind(this));
  }

  /**
   * onGetCamerasResponse - Get response of camera in case of exacq
   * @param response
   * @param cams
   */
  onGetCamerasResponse(response, cams) {
    if (!response.success) {
      alert('Problem retrieving camera list.');
      return;
    }
    let cameraCount = 0;

    cams.forEach(objCamera => {
      const that = this;
      const cameraItem = that.selectedTabData.cameraViewItems.filter(p => p.serverType === VideoServerType.ExecQ);
      if (cameraItem) {
        cameraItem.forEach(obj => {
          if (obj.connectionId === String(cams[cameraCount].id)) {
            obj.videoUrl = cams[cameraCount].getVideo(EVWEB2.cameraFormats.h264);
            obj.camObject = cams[cameraCount];
            this.bindVideoStreaming(obj);
          }
        });
      }
      cameraCount++;
    });
  }


  /**
   * AfterViewInit - Bind video streaming after load video tags in the DOM
   */
  ngAfterViewInit() {
    this.allCameraViewItems.changes.subscribe(t => {
      const execQData = this.selectedTabData.cameraViewItems.filter(p => p.serverType === VideoServerType.ExecQ);
      if (execQData.length > 0) {
        this.execQServerUrl = execQData[0].url;
        this.execQUserId = execQData[0].username;
        this.execQUserPassword = execQData[0].password;

        // Bind video stream in call back function onGetCamerasResponse
        const myService = new EVWEB2.Service(this.execQServerUrl, '');
        myService.getServers(this.onGetServersResponse.bind(this));
      }

      const marchNetwordData = this.selectedTabData.cameraViewItems.filter(p => p.serverType !== VideoServerType.ExecQ);
      if (marchNetwordData.length > 0) {
        // const distinctCameraList = this.utilsService.getDistinctCameraConnectionId(marchNetwordData);
        marchNetwordData.forEach(cameraItem => {
          this.bindVideoStreaming(cameraItem);
        });
      }

    });
  }

  /**
   * OnDestroy - Close all the connected streams
   */
  ngOnDestroy() {
    this.videoTagsList.forEach(obj => {
      this.closeStream(obj, true);
    });
  }

  /**
   * signInToServer - Sign in to the streaming server
   * @param videoName
   * @param server
   * @param roomIndex
   * @param cameraData
   * @param isRecorded
   * @param startTime
   * @param playBackSpeed
   */
  signInToServer(videoName, server, roomIndex, cameraData, isRecorded, startTime, playBackSpeed) {
    const obj: any = {};
    obj.videoName = videoName + this.remoteVideo;
    obj.roomIndex = roomIndex;
    this.videoTagsList.push(obj);

    const con = new WebSocket(server);
    roomIndex++;
    this.connectionRTC[roomIndex] = con;

    const self = this;

    // This function is called when websocket connection is open
    this.connectionRTC[roomIndex].onopen = function() {
      let m;
      /**
       * if video requested by user is archive
       * then send all paramters (cameraId,Username,Password,HostString,ServerType,URL,connectionId)
       * with ArchiveStartTime in the MediaServer request
       */
      if (isRecorded) {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.name,
          ArchiveStartTime: startTime,
          PlayBackSpeed: playBackSpeed,
          Username: cameraData.username,
          Password: cameraData.password,
          HostString: cameraData.url,
          ServerType: cameraData.serverType,
          URL: cameraData.videoUrl,
          connectionId: cameraData.connectionId
        });
      } else {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.name,
          Username: cameraData.username,
          Password: cameraData.password,
          HostString: cameraData.url,
          ServerType: cameraData.serverType,
          URL: cameraData.videoUrl,
          connectionId: cameraData.connectionId
        });
      }
      // send the message as an ordinary text
      self.connectionRTC[roomIndex].send(m);
    };

    // This function is called when websocket connection is throwing any error
    this.connectionRTC[roomIndex].onerror = function(error) {
      /**
       * just in there were some problems with connection...
       * stop loading gif and
       * display error message on the camera frame
       */
      const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + videoName);
      errorMessageId.style.display = 'block';
      const videoId = document.getElementById('streamLoader_' + videoName);
      videoId.style.display = 'none';
    };

    // This function is called when websocket is sending any type of message
    // most important part - incoming messages
    this.connectionRTC[roomIndex].onmessage = function(message) {
      // try to parse JSON message. Because we know that the server always returns
      // JSON this should work without any problem but we should make sure that
      // the massage is not chunked or otherwise damaged.
      let json: any = {};
      try {
        json = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      // NOTE: if you're not sure about the JSON structure
      // check the server source code above
      if (json.type === 'message') { // it's a single message
      } else if (json.type === 'self_id') {
        const selfId = json.id;
        self.signInCallback(roomIndex, selfId);
      } else if (json.type === 'user_add') {
      } else if (json.type === 'user_leave') {
        self.process_user_leave(roomIndex);
      } else if (json.type === 'pass_message') {
        if (json.m_type === 'offer') {       // Taha: recieve sdp in offer...
          self.processOffer(json.to, json.from, json.m, roomIndex, self);
        } else if (json.m_type === 'candidate') {
          self.processCandidate(json.to, json.from, json.m, roomIndex);
        } else {
          console.error('Unknown message ', json);
        }

      } else if (json.type === 'offer') {
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this: ', json);
      }
    };
  }

  /**
   * onSessionConnecting - on connecting session
   * @param message
   */
  onSessionConnecting(message) {
    console.log('Session connecting.');
  }

  /**
   * onSessionOpened
   * @param message
   */
  onSessionOpened(message) {
    console.log('Session opened.');
  }

  /**
   * onRemoteStreamRemoved
   * @param event
   */
  onRemoteStreamRemoved(event) {
    console.log('Remote stream removed.');
  }

  /**
   * onRemoteSdpError
   * @param event
   */
  onRemoteSdpError(event) {
    console.error('onRemoteSdpError', event.name, event.message);
  }

  /**
   * onRemoteSdpSucces
   */
  onRemoteSdpSucces() {
    console.log('onRemoteSdpSucces');
  }

  /**
   * sld_success_cb
   */
  sld_success_cb() {
  }

  sld_failure_cb() {
    console.log('setLocalDescription failed');
  }

  aic_success_cb() {
    console.log('+++ Candidate success ++++');
  }

  aic_failure_cb() {
    console.log('addIceCandidate failed');
  }

  /**
   * processOffer - process the offer and bind the stream in the video tag
   * @param peerTo
   * @param peerFrom
   * @param data
   * @param index
   * @param self
   */
  processOffer(peerTo, peerFrom, data, index, self) {
    const dataJson = JSON.parse(data);
    self.createPeerConnection(peerTo, peerFrom, index);
    self.pc[index].setRemoteDescription(new RTCSessionDescription(dataJson), self.onRemoteSdpSucces, self.onRemoteSdpError);

    // This function is called when websocket connection is adding stream on the video source
    self.pc[index].onaddstream = function(i) {
      return function(event) {
        console.log(self.vidTag[i]);
        self.remoteVideoElement[i] = document.getElementById(self.vidTag[i]);
        self.remoteVideoElement[i].srcObject = event.stream;
        const strPos = self.vidTag[i].indexOf(self.remoteVideo);
        const idElem = self.vidTag[i].substring(0, strPos);
        const videoId = document.getElementById('streamLoader_' + idElem);
        videoId.style.display = 'none';
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
        errorMessageId.style.display = 'none';
        const getCamera = self.selectedTabData.cameraViewItems.find(p => p.channelGuid === idElem);
        if (getCamera) {
          getCamera.isBindStream = true;
        }
      };
    }(index);

     // This function is called when websocket connection is removing stream from the video source
    self.pc[index].onremovestream = self.onRemoteStreamRemoved;
    self.pc[index].createAnswer(function(sessionDescription) {
      self.pc[index].setLocalDescription(sessionDescription, self.sld_success_cb, self.sld_failure_cb);

      const msg = JSON.stringify({
        type: 'pass_message',
        to: peerFrom,
        from: peerTo,
        m_type: 'answer',
        m: sessionDescription
      });
      self.connectionRTC[index].send(msg);


    }, function(error) { // error
      console.log('Create answer error:', error);
    }, self.mediaConstraints); // type error  ); //}, null

  }

  // parameter peer_io is myself and peer_from is remote peer
  createPeerConnection(peerTo, peerFrom, index) {
    try {
      const self = this;
      this.pc[index] = new RTCPeerConnection(this.pcConfig);
      this.pc[index].onicecandidate = function(event) {
        if (event.candidate) {
          const candidate = {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          };
          const msg = JSON.stringify({
            type: 'pass_message',
            to: peerFrom,
            from: peerTo,
            m_type: 'candidate',
            m: candidate
          });

          self.connectionRTC[index].send(msg);
        } else {
          console.log('End of candidates.');
        }
      };
      this.pc[index].onconnecting = this.onSessionConnecting;
      this.pc[index].onopen = this.onSessionOpened;
      this.pc[index].onaddstream = function(i) {
        return function(event) {
          this.remoteVideoElement[i] = document.getElementById(this.vidTag[i]);
          console.log('remoteVideoElement : ', this.remoteVideoElement[i]);
          this.remoteVideoElement[i].srcObject = event.stream;
          const strPos = this.vidTag[i].indexOf(this.remoteVideo);
          const idElem = this.vidTag[i].substring(0, strPos);
          const videoId = document.getElementById('streamLoader_' + idElem);
          videoId.style.display = 'none';
          const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
          errorMessageId.style.display = 'none';
          const getCamera = this.selectedTabData.cameraViewItems.filter(p => p.channelGuid === idElem);
          if (getCamera) {
            getCamera.isBindStream = true;
          }
        };
      }(index);

      this.pc[index].onremovestream = this.onRemoteStreamRemoved;
      console.log('Created RTCPeerConnnection with config: ' + JSON.stringify(this.pcConfig));
    } catch (e) {
      console.log('Failed to create PeerConnection with ' + ', exception: ' + e.message);
    }
  }

  /**
   * processCandidate - process the candidate
   * @param peerTo
   * @param peerFrom
   * @param data
   * @param index
   */
  processCandidate(peerTo, peerFrom, data, index) {
    const dataJson = JSON.parse(data);
    const candidate = new RTCIceCandidate({ sdpMLineIndex: dataJson.sdpMLineIndex, candidate: dataJson.candidate });
    this.pc[index].addIceCandidate(candidate, this.aic_success_cb, this.aic_failure_cb);
  }

  /**
   * process_user_leave - when user leaves the process
   * @param index
   */
  process_user_leave(index) {
    console.log(this.pc[index]);
    if (this.pc[index] != null) {
      console.log(' +++ Removing on-going session...');
      this.pc[index].close();
      this.pc[index] = null;
    } else {
      console.log('+++ No on-going session...');
    }
  }

  /**
   * signInCallback - callback after sign in
   * @param index
   * @param selfid
   */
  signInCallback(index, selfid) {
    const idConnected = selfid;
    const selectedVideo = this.videoTagsList.find(z => z.roomIndex === (index - 1));
    if (selectedVideo) {
      const strPos = selectedVideo.videoName.indexOf(this.remoteVideo);
      const idElem = selectedVideo.videoName.substring(0, strPos);
      this.elemMap.set(index, idElem);

      this.myId[index] = idConnected;
      this.vidTag[index] = selectedVideo.videoName;
      console.log('myId[index]: ', this.myId[index]);
    }
  }

  /**
   * listOfArray - Create arrays by number
   * @returns list of input array
   */
  listOfArray(arrayCount): Array<number> {
    return Array(arrayCount).fill(0).map((x, i) => i);
  }

  /**
   * onCameraTabsChange - on change of camera tabs
   * @param ev
   */
  onCameraTabsChange(ev) {
    this.cameraData.forEach((cameraObj, ind) => {
      if (ind !== ev.index) {
          this.videoTagsList.forEach(obj => {
            const strPos = obj.videoName.indexOf(this.remoteVideo);
            const idElem = obj.videoName.substring(0, strPos);
            const getCameraPreviousTab = cameraObj.cameraViewItems.find(z => z.channelGuid === idElem);
            if (getCameraPreviousTab) {
              getCameraPreviousTab.isExecuted = false;
              getCameraPreviousTab.isRecorded = false;
              this.closeStream(obj, true);
            }
          });
      }
    });

    this.selectedTabData = this.cameraData[ev.index];

    const execQData = this.selectedTabData.cameraViewItems.filter(p => p.serverType === VideoServerType.ExecQ);
    if (execQData.length > 0) {
      this.execQServerUrl = execQData[0].url;
      this.execQUserId = execQData[0].username;
      this.execQUserPassword = execQData[0].password;

      // Bind video stream in call back function onGetCamerasResponse
      const myService = new EVWEB2.Service(this.execQServerUrl, '');
      myService.getServers(this.onGetServersResponse.bind(this));
    }

    const marchNetwordData = this.selectedTabData.cameraViewItems.filter(p => p.serverType !== VideoServerType.ExecQ);
    if (marchNetwordData.length > 0) {
      // const distinctCameraList = this.utilsService.getDistinctCameraConnectionId(marchNetwordData);
      marchNetwordData.forEach(cameraItem => {
        this.bindVideoStreaming(cameraItem);
      });
    }
  }

  /**
   * bindCameraData - Bind camera data
   */
  bindCameraData() {
    const url = urls.getCameraData + '/' + this.siteId;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200) {
          this.cameraData = res.data;
          this.selectedTabData = this.cameraData[0];
          this.cameraData.forEach(cameraObj => {
            cameraObj.updatedCameraViewItems = [];
            if (CameraLayoutID[cameraObj.layoutID] !== cameraObj.cameraViewItems.length) {
              for (let i = 0; i < cameraObj.layoutID; i++) {
                const obj: any = {};
                obj.JobID = Number(this.siteId);
                obj.camNum = i + 1;
                obj.viewID = cameraObj.viewId;
                obj.isNotExistInDb = true;
                cameraObj.updatedCameraViewItems.push(obj);
              }
            }
            cameraObj.cameraViewItems.forEach((cameraItem) => {
              if (cameraItem.channelGuid) {
                const originalChannelGuid = cameraItem.channelGuid;
                cameraItem.originalChannelGuid = originalChannelGuid;
                cameraItem.channelGuid = this.utilsService.newGuid();
                cameraItem.isStreamed = true;
                cameraObj.updatedCameraViewItems[cameraItem.camNum - 1] = cameraItem;
              }
            });
            cameraObj.cameraViewItems = cameraObj.updatedCameraViewItems;
          });
        }
      });
  }

  /**
   * bindVideoStreaming - bind video streaming
   */
  bindVideoStreaming(cameraItem) {
    if (!cameraItem.isExecuted && cameraItem.channelGuid) {
      const customName = cameraItem.channelGuid;
      this.signIn(customName, this.mediaServerUrl, cameraItem, false, null, 0);
      let vid: any = document.getElementById(cameraItem.channelGuid);
      if (!vid) {
        vid = document.getElementById(cameraItem.channelGuid + this.remoteVideo);
      }
      if (vid) {
        const videoId = document.getElementById('streamLoader_' + cameraItem.channelGuid);
        videoId.style.display = 'block';
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + cameraItem.channelGuid);
        if (errorMessageId) {
          errorMessageId.style.display = 'none';
        }
        vid.setAttribute('autoplay', 'true');
        vid.style.display = 'block';
        vid.setAttribute('id', customName + this.remoteVideo);
        this.addVideoControlBar(customName, cameraItem.channelGuid);
        cameraItem.isExecuted = true;
      }
    }
  }

  /**
   * signIn - sign in to the streaming server
   * @param name
   * @param server
   * @param cameraData
   * @param isRecorded
   * @param startTime
   * @param playBackSpeed
   */
  signIn(name, server, cameraData, isRecorded, startTime, playBackSpeed) {
    try {
      this.index++;
      cameraData.isBindStream = false;
      this.signInToServer(name, server, this.index, cameraData, isRecorded, startTime, playBackSpeed);
    } catch (e) {
      console.log('error :  ' + e.description);
    }
  }

  /**
   * addRecordedFeedProperties
   * @param ev
   */
  addRecordedFeedProperties(ev) {
    this.selectedCamData.isRecorded = true;
    this.selectedTabData.cameraViewItems.forEach(camObj => {
      if (camObj.channelGuid === this.selectedCamData.channelGuid) {
        camObj.isRecorded = true;
        if (camObj.serverType === VideoServerType.ExecQ) {
          this.liveOrRecordedStreamExecQ(this.selectedCamData);
        } else {
          this.liveOrRecordedStream(this.selectedCamData);
          this.selectedCamData = {};
        }

      }
    });
    this.closeRecordedFeedPopUp();
  }

  /**
   * liveOrRecordedStream in case of march network - play live or recorded stream based on parameters
   * @param camData
   */
  liveOrRecordedStream(camData) {
    // close stream connection
    this.videoTagsList.forEach(obj => {
      const strPos = obj.videoName.indexOf(this.remoteVideo);
      const idElem = obj.videoName.substring(0, strPos);
      if (idElem === camData.channelGuid) {
        this.closeStream(obj);
        const loaderId = document.getElementById('streamLoader_' + idElem);
        if (loaderId) {
          loaderId.style.display = 'block';
        }
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
        if (errorMessageId) {
          errorMessageId.style.display = 'none';
        }
        let startDateTime = null;
        if (camData.isRecorded) {
          this.closeRecordedFeedPopUp();
          const dateTime = new Date(camData.archiveStartDate);
          startDateTime = dateTime.toLocaleString();
        }
        // bind new connection with stream
        this.signIn(camData.channelGuid, this.mediaServerUrl, camData, camData.isRecorded, startDateTime, 0);
      }
    });
  }

  /**
   * liveOrRecordedStreamExecQ - Live or recorded stream in case of exacq
   * @param camData
   */
  liveOrRecordedStreamExecQ(camData) {
    // close stream connection
    this.videoTagsList.forEach(obj => {
      const strPos = obj.videoName.indexOf(this.remoteVideo);
      const idElem = obj.videoName.substring(0, strPos);
      if (idElem === camData.channelGuid) {
        this.closeStream(obj);
        const loaderId = document.getElementById('streamLoader_' + idElem);
        if (loaderId) {
          loaderId.style.display = 'block';
        }
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
        if (errorMessageId) {
          errorMessageId.style.display = 'none';
        }
        let startDateTime = null;
        if (camData.isRecorded) {
          this.closeRecordedFeedPopUp();
          const dateTime = new Date(camData.archiveStartDate);
          startDateTime = dateTime.toLocaleString();
        }

        // Create archive data url
        const devices = this.selectedTabData.cameraViewItems.find(p => p.channelGuid === camData.channelGuid && p.serverType === VideoServerType.ExecQ);
        const start = new Date(startDateTime);
        const end = new Date();
        EVWEB2.getSearch(this.onGetSearchResponse.bind(this), [devices.camObject], start, end);
      }
    });
  }

  /**
   * onGetSearchResponse - get video url in case of exacq
   * @param response
   * @param mySearch
   */
  onGetSearchResponse(response, mySearch) {
    if (response.success) {

      const cameraItem = this.selectedTabData.cameraViewItems.find(p => p.connectionId === String(mySearch.cameras[0].id) && p.serverType === VideoServerType.ExecQ);
      if (cameraItem) {
        cameraItem.videoUrl = mySearch.cameras[0].getVideo(EVWEB2.cameraFormats.h264, mySearch.searchId);
        this.signIn(cameraItem.channelGuid, this.mediaServerUrl, cameraItem, false, null, 0);
      }
    } else {
      const cameraItem = this.selectedTabData.cameraViewItems[0];
      if (this.selectedTabData.cameraViewItems[0]) {
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + cameraItem.channelGuid);
        errorMessageId.style.display = 'block';
        const videoId = document.getElementById('streamLoader_' + cameraItem.channelGuid);
        videoId.style.display = 'none';
      }
    }
    this.selectedCamData = {};
  }

  /**
   * closeRecordedFeedPopUp - close the recorded feed properties popup
   */
  closeRecordedFeedPopUp() {
    $('#recordedPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * closeRecordedFeedPropertiesPopUp
   * @param ev
   */
  closeRecordedFeedPropertiesPopUp(ev) {
    this.selectedCamData = {};
  }

  /**
   * closeStream - close the specific stream
   * @param obj
   */
  closeStream(obj: any, allStreams: boolean = false) {
    if (this.connectionRTC[obj.roomIndex + 1]) {
      this.connectionRTC[obj.roomIndex + 1].close();
      if (!allStreams) {
        const index = this.videoTagsList.indexOf(this.videoTagsList.find(z => z.roomIndex === obj.roomIndex));
        this.videoTagsList.splice(index, 1);
      }
    }
  }

  /**
   * addVideoControlBar - add video controls like play, pause, archive, live, zoom in, zoom out functionalities
   * @param customName
   * @param channelGuid
   */
  addVideoControlBar(customName, channelGuid) {
    let zoom = 1;
    let rotate = 0;
    let t;
    let i;
    let j;
    let calculatedZoomValue;
    /* Array of possible browser specific settings for transformation */
    const properties = ['transform', 'WebkitTransform', 'MozTransform',
      'msTransform', 'OTransform'];
    let prop = properties[0];
    const stage = document.getElementById('stage_' + channelGuid);
    stage.style.display = 'block';
    this.v = document.getElementById(customName + this.remoteVideo);
    const controls = document.getElementById('controls_' + channelGuid);
    const v: any = this.v;
    this.v = v;
    /* Find out which CSS transform the browser supports */
    for (i = 0, j = properties.length; i < j; i++) {
      if (typeof stage.style[properties[i]] !== 'undefined') {
        prop = properties[i];
        break;
      }
    }

    /* Position video */
    v.style.left = 0;
    v.style.top = 0;

    const self = this;

    // This event fires on mouse wheel button on camera frame for zoom in and zoom out functionality (specially for firefox browser)
    this.v.addEventListener('wheel', function(e) {
      if (e.deltaY > 0) {
        // scroll down
        calculatedZoomValue = zoom - 0.1;
        if (calculatedZoomValue >= 1) {
          zoom = calculatedZoomValue;
          v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
        }
      } else {
        // scroll up
        calculatedZoomValue = zoom + 0.1;
        if (calculatedZoomValue >= 1) {
          zoom = calculatedZoomValue;
          v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
        }
      }
    }, false);

    // This event fires on mouse wheel button on camera frame for zoom in and zoom out functionality
    this.v.addEventListener('mousewheel', function(e) {
      if (e.deltaY > 0) {
        // scroll down
        calculatedZoomValue = zoom - 0.1;
        if (calculatedZoomValue >= 1) {
          zoom = calculatedZoomValue;
          v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
        }
      } else {
        // scroll up
        calculatedZoomValue = zoom + 0.1;
        if (calculatedZoomValue >= 1) {
          zoom = calculatedZoomValue;
          v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
        }
      }
    }, false);

    // This event fires on pause button on camera frame
    this.v.addEventListener('pause', function(e) {
      self.onPauseVideo(self, customName, v);
    }, false);


    // This event fires on play button on camera frame
    this.v.addEventListener('play', function(e) {
      self.playAgainVideoAfterPause(self, customName);
    }, false);

    // This event fires on click button on camera frame
    controls.addEventListener('click', function(e) {
      t = e.target;
      const archiveVal: any = self.translate.get('camera.archive');
      const liveVal: any = self.translate.get('camera.live');
      if (t.nodeName.toLowerCase() === 'i') {
        let leftValue = 0;
        let rightValue = 0;

        /* Check the class name of the button and act accordingly */
        switch (t.innerHTML) {

          /* Increase zoom and set the transformation */
          case 'zoom_in':
            calculatedZoomValue = zoom + 0.1;
            if (calculatedZoomValue >= 1) {
              zoom = calculatedZoomValue;
              v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
              //     v.style[prop] = 'max-width:100%';
            }
            break;

          /* Decrease zoom and set the transformation */
          case 'zoom_out':
            calculatedZoomValue = zoom - 0.1;
            if (calculatedZoomValue >= 1) {
              leftValue = 0;
              v.style.left = leftValue + 'px';
              rightValue = 0;
              v.style.top = rightValue + 'px';
              zoom = calculatedZoomValue;
              v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
            }
            break;

          /* Move video around by reading its left/top and altering it */
          case 'keyboard_arrow_left':
            leftValue = (parseInt(v.style.left, 10) - 5);
            if (zoom !== 1) {
              v.style.left = leftValue + 'px';
            }
            break;
          case 'keyboard_arrow_right':
            leftValue = (parseInt(v.style.left, 10) + 5);
            if (zoom !== 1) {
              v.style.left = leftValue + 'px';
            }
            break;
          case 'keyboard_arrow_up':
            rightValue = (parseInt(v.style.top, 10) - 5);
            if (zoom !== 1) {
              v.style.top = rightValue + 'px';
            }
            break;
          case 'keyboard_arrow_down':
            rightValue = (parseInt(v.style.top, 10) + 5);
            if (zoom !== 1) {
              v.style.top = rightValue + 'px';
            }
            break;

          /* Reset all to default */
          case 'settings_backup_restore':
            zoom = 1;
            rotate = 0;
            v.style.top = 0 + 'px';
            v.style.left = 0 + 'px';
            v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
            break;

          case 'fast_rewind':
            v.currentTime += 7;
            break;

          case 'fast_forward':
            v.currentTime = v.currentTime + self.configService.getConfig().mediaForwardTime;
            self.onPauseVideo(self, customName, v);
            self.playAgainVideoAfterPause(self, customName);
            break;
        }
      } else if (t.innerHTML === 'Archive' || t.innerHTML === archiveVal.value) {
        self.selectedTabData.cameraViewItems.forEach(camObj => {
          if (camObj.channelGuid === customName) {
            self.selectedCamData = camObj;
          }
        });
      } else if (t.innerHTML === 'Live' || t.innerHTML === liveVal.value) {
        self.selectedTabData.cameraViewItems.forEach(camObj => {
          if (camObj.channelGuid === customName) {
            self.selectedCamData = camObj;
            self.selectedCamData.isRecorded = false;
            camObj.isRecorded = false;
            if (camObj.serverType !== VideoServerType.ExecQ) {
              self.liveOrRecordedStream(self.selectedCamData);
            } else {

              self.execQServerUrl = self.selectedCamData.url;
              self.execQUserId = self.selectedCamData.username;
              self.execQUserPassword = self.selectedCamData.password;
              self.videoTagsList.forEach(obj => {
                const strPos = obj.videoName.indexOf(self.remoteVideo);
                const idElem = obj.videoName.substring(0, strPos);
                if (idElem === camObj.channelGuid) {
                  self.closeStream(obj);
                  const loaderId = document.getElementById('streamLoader_' + camObj.channelGuid);
                  if (loaderId) {
                    loaderId.style.display = 'block';
                  }

                  // Bind video stream in call back function onGetCamerasResponse
                  camObj.videoUrl = camObj.camObject.getVideo(EVWEB2.cameraFormats.h264);
                  self.signIn(camObj.channelGuid, self.mediaServerUrl, camObj, false, null, 0);
                }
              });
            }
          }
        });
      }
      e.preventDefault();
    }, false);

  }

  /**
   * playAgainVideoAfterPause - Play again after pausing the video
   * @param self
   * @param customName
   */
  playAgainVideoAfterPause(self, customName: any) {
    self.selectedTabData.cameraViewItems.forEach(camObj => {
      if (!camObj.isBindStream && camObj.channelGuid === customName) {
        if (camObj.isRecorded) {
          const loaderId = document.getElementById('streamLoader_' + camObj.channelGuid);
          if (loaderId) {
            loaderId.style.display = 'block';
          }
          let startDateTime = null;
          if (!camObj.pauseTime) {
            camObj.pauseTime = 0;
          }
          camObj.archiveStartDate.setSeconds(camObj.archiveStartDate.getSeconds() + camObj.pauseTime);
          const dateTime = new Date(camObj.archiveStartDate);
          startDateTime = dateTime.toLocaleString();
          // bind new connection with stream
          self.signIn(camObj.channelGuid, this.mediaServerUrl, camObj, camObj.isRecorded, startDateTime, 0);
        }
      }
    });
  }

  /**
   * onPauseVideo - pause video on pause button
   * then close the previous stream connection
   * and also stores the time when video is paused
   * @param self
   * @param customName
   * @param v
   */
  onPauseVideo(self, customName: any, v: any) {
    self.selectedTabData.cameraViewItems.forEach(camObj => {
      if (camObj.isRecorded && camObj.channelGuid === customName) {
        camObj.isBindStream = false;
        camObj.pauseTime = v.currentTime;
        self.videoTagsList.forEach(obj => {
          const strPos = obj.videoName.indexOf(self.remoteVideo);
          const idElem = obj.videoName.substring(0, strPos);
          if (idElem === camObj.channelGuid) {
            self.closeStream(obj);
          }
        });
      }
    });
  }

  /**
   * redirectToEditCamera - Redirect to edit camera screen
   * @param e
   */
  redirectToEditCamera(e) {
    this.router.navigate(['./monitoring/camera/edit-camera']);
  }

  /**
   * bindEventsData - Get events data from the api and bind response locally
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
    // tslint:disable-next-line:no-shadowed-variable
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

  /**
   * push the signalR data to event
   * @param serverMessage
   */
  mapSignalREventData(serverMessage: string) {
    if (serverMessage != null) {
      const isJsonValidate = this.utilsService.IsJsonString(serverMessage);
      if (isJsonValidate) {
        const responseMessage = JSON.parse(serverMessage);
        if (responseMessage.hasOwnProperty('EventType') && this.eventsData) {
          this.eventsData.unshift({
            utcTimeStamp: responseMessage.UTCTimeStamp,
            siteName: responseMessage.SiteName,
            description: responseMessage.Description,
            panelName: responseMessage.PanelName,
            severity: responseMessage.Severity,
            channelGuid: responseMessage.ChannelGUID,
            mapGuid: responseMessage.MapGUID
          });
        }
      }
    }
  }

  /**
   * Open full screen mode of tabs
   * @param e
   */
  fullScreenWithNewTab(e) {
    this.router.navigate([]).then(result => {
      window.open('#/cameraView/' + this.selectedTabData.viewGuid, '_blank',
        'fullscreen=yes;toolbar=no;resizable=yes,width=1500,height=900');
    });
  }

  /**
   * mouseEnter - On mouse enter, display video controls
   * @param ctrlBtnId
   * @param channelGuid
   */
  mouseEnter(ctrlBtnId: string, channelGuid: string) {
    const ctrl = document.getElementById(ctrlBtnId);
    const loaderId = document.getElementById('streamLoader_' + channelGuid);
    const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + channelGuid);
    //  const alreadyStreamedId = document.getElementById('alreadyStreamedOnCameraFrame_' + channelGuid);
    // && alreadyStreamedId.style.display === 'none'
    if (errorMessageId && errorMessageId.style.display === 'none' && errorMessageId && loaderId && loaderId.style.display === 'none') {
      ctrl.style.display = 'block';
      const layoutId = document.getElementById('cameraLayoutId_' + channelGuid);
      if (layoutId) {
        layoutId.classList.add('selectedFrame');
      }
    }
  }

  /**
   * mouseLeave - On mouse leave, hide video controls
   * @param ctrlBtnId
   * @param channelGuid
   */
  mouseLeave(ctrlBtnId: string, channelGuid: string) {
    const ctrl = document.getElementById(ctrlBtnId);
    ctrl.style.display = 'none';
    const layoutId = document.getElementById('cameraLayoutId_' + channelGuid);
    if (layoutId) {
      layoutId.classList.remove('selectedFrame');
    }
  }

  /**
   * eventExpandableChangedHandler - This handle the events docked at the bottom of the camera screen(on up down arrow)
   * @param isExpand
   */
  eventExpandableChangedHandler(isExpand: boolean) {
    this.isExpandable = isExpand;
  }

}

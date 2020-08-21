/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit, Input, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CameraLayoutID, ActionType, VideoServerType } from 'src/app/shared/enums';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utility.services';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { DropEvent } from 'angular-draggable-droppable';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
declare var EVWEB2: any;
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-camera-edit',
  templateUrl: './camera-edit.component.html',
  styleUrls: ['./camera-edit.component.css']
})

/**
 * Monitoring camera edit component
 */
export class CameraEditComponent implements OnInit, OnDestroy, AfterViewInit {
/**
 * Variables declaration
 */
  mediaServerUrl = this.configService.getConfig().mediaServerUrl;
  cameraLayoutID = CameraLayoutID;
  siteId = this.local.getSiteId();
  cameraData: any = [];
  url: string;
  cameraComponentLibraryData: any = [];
  remoteVideo = '_remote_video';
  count = 0;
  index = 0;
  v: any;
  droppedData: string;
  selectedTabData: any;
  actionType = ActionType;
  tabData: any = {};
  selectedCamData: any = {};
  errorMessageFromApi: string;
  selectedTab: any;
  cameraUsedData: any = {};
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

  execQServerUrl: string;
  execQUserId: string;
  execQUserPassword: string;

  @ViewChild('stage', { static: false }) d1: ElementRef;
  @ViewChild('dvCameraLayout', { static: false }) cameraLayout: ElementRef;
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
    private translate: TranslateService,
    private configService: ConfigService
  ) { }

  /**
   * OnInit - bind camera data
   */
  ngOnInit() {
    this.dataService.changeMessage(true);
    this.bindCameraComponentLibrary();
    this.bindCameraData();
    this.utilsService.getSetLanguage();
  }

  // Get Server List
  onGetServersResponse(response, servers) {
    if (!response.success) {
      alert('Service.getServers failed: ' + response.errorText);
      return;
    }
    const myServer = servers[1];
    myServer.login(this.onLoginServerResponse.bind(this), this.execQUserId, this.execQUserPassword);

  }

  // After Login Get Camera
  onLoginServerResponse(response, server) {
    if (!response.success) {
      alert('Problem logging in. Check your connection settings.');
      return;
    }

    // Retrieve the camera list
    server.getCameras(this.onGetCamerasResponse.bind(this));
  }


  onGetCamerasResponse(response, cams) {
    if (!response.success) {
      alert('Problem retrieving camera list.');
      return;
    }
    let cameraCount = 0;
    cams.forEach(objCamera => {
      const that = this;
     // const distinctCameraList = that.utilsService.getDistinctCameraConnectionId(that.selectedTabData.cameraViewItems.filter(p => p.serverType === VideoServerType.ExecQ));
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
   * onDrop - drop the camera int he camera frame from the component library
   * @param dropData
   * @param camCount
   */
  onDrop(dropData, camCount) {
    dropData.dropData.isUsed = true;
    if (this.selectedTabData.cameraViewItems[camCount].isNotExistInDb) {
      this.selectedTabData.cameraViewItems[camCount].action = ActionType.Create;
    } else {
      this.selectedTabData.cameraViewItems[camCount].action = ActionType.Update;
    }
    this.selectedTabData.cameraViewItems[camCount].originalChannelGuid = dropData.dropData.channelGuid;
    this.selectedTabData.cameraViewItems[camCount].channelGuid = this.utilsService.newGuid();
    this.selectedTabData.cameraViewItems[camCount].name = dropData.dropData.channelName;
    this.selectedTabData.cameraViewItems[camCount].serverId = dropData.dropData.serverId;
    this.selectedTabData.cameraViewItems[camCount].channelId = dropData.dropData.channelId;
    this.selectedTabData.cameraViewItems[camCount].isStreamed = true;
    this.selectedTabData.cameraViewItems[camCount].connectionId = dropData.dropData.connectionId;
    this.selectedTabData.cameraViewItems[camCount].serverName = dropData.dropData.serverName;
    this.selectedTabData.cameraViewItems[camCount].url = dropData.dropData.url;
    this.selectedTabData.cameraViewItems[camCount].serverType = dropData.dropData.serverType;
    this.selectedTabData.cameraViewItems[camCount].username = dropData.dropData.username;
    this.selectedTabData.cameraViewItems[camCount].password = dropData.dropData.password;
    this.cameraUsedData = this.selectedTabData.cameraViewItems[camCount];
    this.cameraUsedData.dataUsed = true;
  }

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
      marchNetwordData.forEach(cameraItem => {
        this.bindVideoStreaming(cameraItem);
      });
    }

  }

  /**List of layout to display
   * @returns list of camera layouts
   */
  cameraLayoutKeyPair(): Array<string> {
    const keys = Object.keys(this.cameraLayoutID);
    return keys.slice(keys.length / 2);
  }

  /**Create arrays by number
   * @returns list of input array
   */
  listOfArray(arrayCount): Array<number> {
    return Array(arrayCount).fill(0).map((x, i) => i);
  }

  /**
   * Bind camera component library
   */
  bindCameraComponentLibrary() {
    const url = urls.getCameraLibrary + '/' + this.siteId;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200) {
          this.cameraComponentLibraryData = res.data;
        }
      });
  }

  onCameraProperties(ev, camData) {
    this.selectedCamData = camData;
  }

  closeCameraPropertiesPopUp(ev) {
    this.selectedCamData = {};
  }

  /**
   * startPlayingCameraFeed - start playing the camera feed on start preview button
   * @param ev
   * @param camData
   */
  startPlayingCameraFeed(ev, camData) {
    const getVideoId: any = document.getElementById(camData.channelGuid + this.remoteVideo);
    const controls = document.getElementById('controls_' + camData.channelGuid);
    const pause: any = controls.querySelectorAll('.pause');
    if (pause[0] && pause[0].firstChild) {
      pause[0].firstChild.innerHTML = 'pause_arrow';
    }
    getVideoId.play();
  }

  stopPlayingCameraFeed(ev, camData) {
    const getVideoId: any = document.getElementById(camData.channelGuid + this.remoteVideo);
    const controls = document.getElementById('controls_' + camData.channelGuid);
    const pause: any = controls.querySelectorAll('.pause');
    if (pause[0] && pause[0].firstChild) {
      pause[0].firstChild.innerHTML = 'play_arrow';
    }
    getVideoId.pause();
  }

  /**
   * Bind camera data
   */
  bindCameraData() {
    const promise = new Promise((resolve, reject) => {
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
                  obj.action = ActionType.None;
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
            resolve();
          }
        });
    });
    return promise;
  }

  /**
   * bindVideoStreaming - bind video streaming
   */
  bindVideoStreaming(cameraItem) {
    if (cameraItem.isStreamed) {
      this.videoStreaming(cameraItem);
    }
  }

  /**
   * videoStreaming
   * @param cameraItem
   */
  videoStreaming(cameraItem: any) {
    if (this.cameraUsedData.dataUsed && this.cameraUsedData.channelGuid === cameraItem.originalChannelGuid) {
      const layoutId = document.getElementById('cameraLayoutId_' + cameraItem.channelGuid);
      if (layoutId) {
        layoutId.classList.add('selectedFrame');
        layoutId.scrollIntoView();
        this.cameraUsedData.dataUsed = false;
      }
    }
    if (!cameraItem.isExecuted && cameraItem.channelGuid) {
      const customName = cameraItem.channelGuid;
      this.signIn(customName, this.mediaServerUrl, cameraItem, false, null, 0);
      let vid: any = document.getElementById(cameraItem.channelGuid);
      if (!vid) {
        vid = document.getElementById(cameraItem.channelGuid + this.remoteVideo);
      }
      if (vid) {
        const cameraLayout = document.getElementById('cameraLayoutId_' + cameraItem.channelGuid);
        if (cameraLayout) {
          cameraLayout.classList.remove('camera-layout-without-video');
        }
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
      }
      cameraItem.isExecuted = true;
    }
  }

  /**
   *  ngAfterViewInit - After view initialization, this function executes
   *  when all the html elements successfully loaded in the dom then this function executes
   */
  ngAfterViewInit() {
    this.allCameraViewItems.changes.subscribe(t => {
      if (this.selectedTabData) {
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
          marchNetwordData.forEach(cameraItem => {
            this.bindVideoStreaming(cameraItem);
          });
        }
      }

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
    obj.channelGuid = videoName;
    obj.videoName = videoName + this.remoteVideo;
    obj.roomIndex = roomIndex;
    this.videoTagsList.push(obj);
    const con = new WebSocket(server);
    roomIndex++;
    this.connectionRTC[roomIndex] = con;

    const self = this;
    this.connectionRTC[roomIndex].onopen = function() {
      console.log('connection open...');
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
      // just in there were some problems with conenction...
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

  onSessionConnecting(message) {
    console.log('Session connecting.');
  }

  onSessionOpened(message) {
    console.log('Session opened.');
  }

  onRemoteStreamRemoved(event) {
    console.log('Remote stream removed.');
  }

  onRemoteSdpError(event) {
    console.error('onRemoteSdpError', event.name, event.message);
  }

  onRemoteSdpSucces() {
    console.log('onRemoteSdpSucces');
  }

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

  processOffer(peerTo, peerFrom, data, index, self) {
    console.log('******', data);

    const dataJson = JSON.parse(data);
    console.log('received ', dataJson);

    self.createPeerConnection(peerTo, peerFrom, index);
    console.log('*** register data channel event....');
    self.pc[index].setRemoteDescription(new RTCSessionDescription(dataJson), self.onRemoteSdpSucces, self.onRemoteSdpError);

    // This function is called when websocket connection is adding stream on the video source
    self.pc[index].onaddstream = function(i) {
      return function(event) {
        self.remoteVideoElement[i] = document.getElementById(self.vidTag[i]);
        console.log('remoteVideoElement : ', self.remoteVideoElement[i]);
        console.log(event.stream);
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
      console.log('Create answer:', sessionDescription);
      console.log(self.connectionRTC[index]);
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
          const getCamera = this.selectedTabData.cameraViewItems.find(p => p.channelGuid === idElem);
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
   * processCandidate
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
   * process_user_leave - When user leave the websocket connection
   * @param index
   */
  process_user_leave(index) {
    if (this.pc[index] != null) {
      console.log(' +++ Removing on-going session...');
      this.pc[index].close();
      this.pc[index] = null;
    } else {
      console.log('+++ No on-going session...');
    }
  }

  /**
   * signInCallback - callback from signin in media server
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
   * Select layout
   * @param layoutId
   * @param camIndex
   * @param oldLayoutId
   */
  selectLayout(layoutId, camIndex, oldLayoutId) {
    const getExtraItems = this.cameraData[camIndex].cameraViewItems.filter(z => z.camNum > CameraLayoutID[layoutId]);
    let isFound = false;
    if (getExtraItems) {
      for (let i = 0; i < this.cameraData[camIndex].cameraViewItems.length; i++) {
        if (this.cameraData[camIndex].cameraViewItems[i].isStreamed &&
          this.cameraData[camIndex].cameraViewItems[i].channelGuid && this.cameraData[camIndex].cameraViewItems[i].action !== ActionType.Delete) {
          if (Number(CameraLayoutID[layoutId]) < this.cameraData[camIndex].cameraViewItems[i].camNum) {
            isFound = true;
          }
        }
      }
      // Alert if user trying to change layout from higher to lower, because user may lapse the data.
      if (!isFound && (Number(CameraLayoutID[layoutId]) >= this.cameraData[camIndex].cameraViewItems.filter(z => z.action !== ActionType.Delete && z.channelGuid).length || getExtraItems.filter(z => z.channelGuid).length === 0)) {
        this.cameraData[camIndex].layoutID = CameraLayoutID[layoutId];
        this.cameraData[camIndex].action = ActionType.Update;
        for (let i = this.cameraData[camIndex].cameraViewItems.length; i < CameraLayoutID[layoutId]; i++) {
          const obj: any = {};
          obj.action = ActionType.None;
          obj.JobID = Number(this.siteId);
          obj.camNum = i + 1;
          obj.viewGuid = this.cameraData[camIndex].viewGuid;
          obj.viewID = this.cameraData[camIndex].viewId;
          obj.isNotExistInDb = true;
          this.cameraData[camIndex].cameraViewItems.push(obj);
        }
      } else {
        const errorVal: any = this.translate.get('camera.changeLayoutError');
        alert(errorVal.value);
      }
    }
  }

  /**
   * removeTab - Remove tab
   * @param ev
   * @param camData
   */
  removeTab(ev, camData) {
    const totalCamera = this.cameraData.length;
    const deletedCamera = this.cameraData.filter((obj) => obj.action === ActionType.Delete).length;
    const remainingCamera = totalCamera - deletedCamera;
    const btnVal: any = this.translate.get('camera.cancel');
    console.log(btnVal);
    if (remainingCamera === 1) {
      const tabsDel: any = this.translate.get('camera.pleaseDonotDeleteAllTabs');
      swal({
        title: tabsDel.value,
        text: '',
        type: 'warning',
        confirmButtonClass: 'btn btn-success',
        confirmButtonText: btnVal.value,
        buttonsStyling: false
      });
    } else {
      const deleteConfirmVal: any = this.translate.get('camera.areyousureyouwanttodeletethistab');
      const nonRevertConfirmVal: any = this.translate.get('camera.youWouldNotBeAbleToRevertThis');
      const deleteVal: any = this.translate.get('camera.yesDeleteIt');
      swal({
        title: deleteConfirmVal.value,
        text: nonRevertConfirmVal.value,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: deleteVal.value,
        cancelButtonText: btnVal.value,
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          camData.action = ActionType.Delete;
        }
      });
    }
  }

  /**
   * onEditTabClick - edit existing tab
   * @param ev
   * @param camData
   */
  onEditTabClick(ev, camData) {
    this.tabData.name = camData.name;
    this.tabData.layoutId = CameraLayoutID[camData.layoutID];
    this.tabData.action = ActionType.Update;
    this.tabData.cameraViewItems = camData.cameraViewItems;
    this.tabData.viewGuid = camData.viewGuid;
    this.tabData.viewId = camData.viewId;
  }

  /**
   * addTab - Add new tab on camera edit screen
   * @param ev
   */
  addTab(ev) {
    /**
     * if name is empty then return error
     */
    if (!this.tabData.name) {
      alert('Name is required.');
      return;
    }
    /**
     * if layout is empty then return error
     */
    if (!this.tabData.layoutId) {
      alert('Layout is required.');
      return;
    }
    const obj: any = {};
    obj.jobId = this.siteId;
    obj.layoutID = Number(CameraLayoutID[this.tabData.layoutId]);
    obj.name = this.tabData.name;
    if (!this.tabData.action) {
      // Add
      obj.action = ActionType.Create;
      obj.cameraViewItems = [];
      for (let i = 0; i < Number(CameraLayoutID[this.tabData.layoutId]); i++) {
        const itemsObj: any = {};
        itemsObj.action = ActionType.None;
        itemsObj.JobID = this.siteId;
        itemsObj.camNum = i + 1;
        obj.cameraViewItems.push(itemsObj);
      }
      this.cameraData.push(obj);
    } else {
      // Update
      obj.action = this.tabData.action;
      this.cameraData.forEach((camObj, index) => {
        if (this.tabData.viewGuid === camObj.viewGuid && this.tabData.viewId === camObj.viewId) {
          this.selectLayout(this.tabData.layoutId, index, camObj.layoutID);
          this.selectedTabData.name = obj.name;
          this.selectedTabData.layoutID = obj.layoutID;
        }
      });
    }
    this.tabData = {};
    $('#addEditTabModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  closeTabPopUp(ev) {
    this.tabData = {};
  }

  /**
   * Destroy the camera left panel value so that left panel will display on other components
   */
  ngOnDestroy(): void {
    this.dataService.changeMessage(false);
    this.videoTagsList.forEach(obj => {
      if (this.connectionRTC[obj.roomIndex + 1]) {
        this.connectionRTC[obj.roomIndex + 1].close();
      }
    });
  }

  /**
   * addRecordedFeedProperties - set entered archive date
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
   * liveOrRecordedStream - Live or recorded stream in case of march network
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

  closeRecordedFeedPopUp() {
    $('#recordedPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * closeRecordedFeedPropertiesPopUp - close the archive popup modal
   * @param ev
   */
  closeRecordedFeedPropertiesPopUp(ev) {
    this.selectedCamData = {};
  }

  /**
   * closeStream - close the existing stream connections
   * @param obj
   * @param allStreams
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
   * addVideoControlBar - This adds control bar on video frame (zoom in, zoom out, play, pause)
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
    // stage.style.display = 'block';
    const overlay = document.getElementById('overlay_' + channelGuid);
    overlay.style.display = 'block';
    this.v = document.getElementById(customName + this.remoteVideo);
    const controls = document.getElementById('controls_' + channelGuid);
    //  controls.style.display = 'block';
    const v: any = this.v;
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

    // This event fires on click button on camera frame
    this.v.addEventListener('click', function(e) {
      if (self.selectedTabData) {
        self.selectedTabData.cameraViewItems.forEach(camObj => {
          if (camObj.channelGuid === channelGuid) {
            console.log(camObj);
            camObj.isSelected = true;
          } else {
            camObj.isSelected = false;
          }
        });
      }
    });

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
      // self.on_mousewheel(e, zoom, rotate, v, prop);
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
              //  v.style[prop] = 'max-width:100%';
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
            console.log(v.currentTime);
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

            // self.liveOrRecordedStream(self.selectedCamData);
          }
        });
      }
      e.preventDefault();
    }, false);

  }

  /**
   * playAgainVideoAfterPause - play video again after pause on play button
   * it starts the video from where it is last stopped and start new stream connection
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
    console.log(v.currentTime);
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
   * selectVideoFrame
   * @param e
   * @param channelGuid
   */
  selectVideoFrame(e, channelGuid) {
  }

  /**
   * removeCameraFromFrame - remove camera from the frame
   * @param ev
   * @param camObj
   */
  removeCameraFromFrame(ev, camObj) {
    const deleteConfirmVal: any = this.translate.get('camera.areyousureyouwanttodeletethisframe');
    const nonRevertConfirmVal: any = this.translate.get('camera.youWouldNotBeAbleToRevertThis');
    const deleteVal: any = this.translate.get('camera.yesDeleteIt');
    const cancel: any = this.translate.get('camera.cancel');
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
        const selectedVideo: any = this.videoTagsList.find(z => z.channelGuid === camObj.channelGuid);
        if (selectedVideo) {
          if (this.connectionRTC[selectedVideo.roomIndex + 1]) {
            this.connectionRTC[selectedVideo.roomIndex + 1].close();
          }
          const v = document.getElementById(camObj.channelGuid + this.remoteVideo);
          v.removeAttribute('id');
          const cameraLayout = document.getElementById('cameraLayoutId_' + camObj.channelGuid);
          if (cameraLayout) {
            cameraLayout.classList.add('camera-layout-without-video');
          }
        }
        if (!camObj.isNotExistInDb) {
          camObj.action = ActionType.Delete;
        } else {
          camObj.action = ActionType.None;
        }
        let otherMatchCamerasCount = 0;
        let isFound = false;
        this.cameraComponentLibraryData.forEach(cam => {
          const matchCam = cam.cameraDetails.find(z => z.channelGuid === camObj.originalChannelGuid);
          if (matchCam) {
            camObj.isStreamed = false;
            camObj.isExecuted = false;
            camObj.isSelected = false;
            this.cameraData.forEach(camObject => {
              const allCamerasMatch = camObject.cameraViewItems.filter(z => z.originalChannelGuid === camObj.originalChannelGuid && z.isStreamed);
              otherMatchCamerasCount = otherMatchCamerasCount + allCamerasMatch.length;
            });
            if (!isFound) {
              if (otherMatchCamerasCount === 0) {
                isFound = true;
                matchCam.isUsed = false;
              }
            }
          }
        });
      }
    });

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
   * onSaveCameraDetail - save camera details in the database through api request
   * @param ev
   */
  onSaveCameraDetail(ev) {
    this.cameraData.forEach(objCam => {
      if (objCam.cameraViewItems) {
        objCam.cameraViewItems.forEach(camItem => {
          camItem.channelGuid = camItem.originalChannelGuid;
          if (camItem.camObject) {
            delete camItem['camObject'];
          }
        });
      }
    });

    const url = urls.updateCameraData;
    this.httpService.postRequest(url, JSON.stringify(this.cameraData)).subscribe((res: any) => {
      if (res != null) {
        if (res.success && res.message.messageCode === 200) {
          this.router.navigate(['./monitoring/camera']);
        } else {
          this.errorMessageFromApi = res.message.description;
        }
      } else {
        const smthngWentWrong: any = this.translate.get('camera.somethingwentwrongintheapi');
        this.errorMessageFromApi = smthngWentWrong.value;
      }
    },
      (err: any) => {
        if (err.error != null && err.error.message != null) {
        }
      }
    );
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
   // const alreadyStreamedId = document.getElementById('alreadyStreamedOnCameraFrame_' + channelGuid);
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
   * onCameraUsed - on click of done button in the component library
   * it will highlight the selected camera frame
   * @param ev
   * @param camDetail
   */
  onCameraUsed(ev, camDetail) {
    let isFound = false;
    this.cameraUsedData.dataUsed = false;
    Array.from(document.getElementsByClassName('camera-layout')).forEach(function(element, index, array) {
      // do stuff
      const layoutIdFromDiv = document.getElementById(element.id);
      if (layoutIdFromDiv) {
        layoutIdFromDiv.classList.remove('selectedFrame');
      }
    });
    if (this.selectedTabData && !isFound) {
      const cameraMatch = this.selectedTabData.cameraViewItems.find(z => z.originalChannelGuid === camDetail.channelGuid && z.isStreamed);
      if (cameraMatch) {
        const layoutId = document.getElementById('cameraLayoutId_' + cameraMatch.channelGuid);
        if (layoutId) {
          layoutId.classList.add('selectedFrame');
          layoutId.scrollIntoView();
          isFound = true;
        }
      }
    }
    if (!isFound) {
      this.cameraData.forEach((camObj, index) => {
        if (!isFound) {
          const cameraMatch = camObj.cameraViewItems.find(z => z.originalChannelGuid === camDetail.channelGuid && z.isStreamed);
          if (cameraMatch) {
            const layoutId = document.getElementById('cameraLayoutId_' + cameraMatch.channelGuid);
            if (layoutId) {
              layoutId.classList.add('selectedFrame');
              layoutId.scrollIntoView();
              isFound = true;
            } else {
              this.cameraUsedData = camDetail;
              this.cameraUsedData.dataUsed = true;
              this.selectedTab = index;

            }
          }
        }
      });
    }
  }

  /**
   * removeCameraHighlight - remove highlight of camera frame
   */
  removeCameraHighlight() {
    Array.from(document.getElementsByClassName('camera-layout')).forEach(function(element, index, array) {
      const layoutIdFromDiv = document.getElementById(element.id);
      if (layoutIdFromDiv) {
        layoutIdFromDiv.classList.remove('selectedFrame');
      }
    });
  }
}

/**
 * Import dependencies
 */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit, Input, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CameraLayoutID, ActionType } from 'src/app/shared/enums';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utility.services';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { DropEvent } from 'angular-draggable-droppable';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
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

  videoTagsList: any = [];
  myId: any = {};
  remoteVideoElement: any = {};
  pc: any = {};
  vidTag: any = {};
  elemMap = new Map();
  connectionRTC: any = {};
  pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  mediaConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }
  };

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
   * OnInit
   */
  ngOnInit() {
    this.dataService.changeMessage(true);
    this.bindCameraComponentLibrary();
    this.bindCameraData();
    this.utilsService.getSetLanguage();
  }

  onDrop(dropData, camCount) {
    dropData.dropData.isUsed = true;
    if (this.selectedTabData.cameraViewItems[camCount].isNotExistInDb) {
      this.selectedTabData.cameraViewItems[camCount].action = ActionType.Create;
    } else {
      this.selectedTabData.cameraViewItems[camCount].action = ActionType.Update;
    }
    this.selectedTabData.cameraViewItems[camCount].channelGuid = dropData.dropData.channelGuid;
    this.selectedTabData.cameraViewItems[camCount].name = dropData.dropData.channelName;
    this.selectedTabData.cameraViewItems[camCount].serverId = dropData.dropData.serverId;
    this.selectedTabData.cameraViewItems[camCount].channelId = dropData.dropData.channelId;
    this.selectedTabData.cameraViewItems[camCount].isStreamed = true;
  }

  onCameraTabsChange(ev) {
    this.selectedTabData.isUsedCount += 1;
    this.selectedTabData = this.cameraData[ev.index];
    this.bindVideoStreaming();
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
          console.log(this.cameraComponentLibraryData);
        }
      });
  }

  onCameraProperties(ev, camData) {
    this.selectedCamData = camData;
  }

  modifyCameraProperties(ev) {
    this.selectedCamData.action = ActionType.Update;
    this.selectedCamData = {};
    $('#cameraPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  closeCameraPropertiesPopUp(ev) {
    this.selectedCamData = {};
  }

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
              cameraObj.isUsedCount = 0;
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

  bindVideoStreaming() {
    if (this.selectedTabData) {
      const distinctCameraList = this.utilsService.getDistinctCameraNames(this.selectedTabData.cameraViewItems);
      this.selectedTabData.cameraViewItems.forEach(cameraItem => {
        if (cameraItem.isStreamed) {
          if (distinctCameraList.find(z => z.channelGuid === cameraItem.channelGuid)) {
            this.videoStreaming(cameraItem);
          } else {
            const vid = document.getElementById(cameraItem.channelGuid);
            if (vid) {
              vid.style.display = 'block';
              vid.setAttribute('id', cameraItem.channelGuid + this.remoteVideo);
            }
            const overlay = document.getElementById('overlay_' + cameraItem.channelGuid);
            overlay.style.display = 'block';
            const errorMessageId = document.getElementById('alreadyStreamedOnCameraFrame_' + cameraItem.channelGuid);
            errorMessageId.style.display = 'block';
            const errorMessageStreamId = document.getElementById('errorMessageOnCameraFrame_' + cameraItem.channelGuid);
            errorMessageStreamId.style.display = 'none';
            const videoId = document.getElementById('streamLoader_' + cameraItem.channelGuid);
            videoId.style.display = 'none';
          }
        }
      });
    }
  }

  videoStreaming(cameraItem: any) {
    if (!cameraItem.isExecuted && cameraItem.channelGuid) {
      const customName = cameraItem.channelGuid;
      this.signIn(customName, this.mediaServerUrl, cameraItem, false, null, 0);
      const vid = document.getElementById(cameraItem.channelGuid);
      if (vid) {
        vid.setAttribute('autoplay', 'true');
        vid.style.display = 'block';
        vid.setAttribute('id', customName + this.remoteVideo);
        this.addVideoControlBar(customName, cameraItem.channelGuid);
      }
      cameraItem.isExecuted = true;
    } else if (cameraItem.isExecuted && cameraItem.channelGuid && this.selectedTabData.isUsedCount > 1) {
      // play all videos
      const video: any = document.getElementById(cameraItem.channelGuid + this.remoteVideo);
      if (video) {
        const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
        if (!isPlaying) {
          video.pause();
          video.play();
        }
      }
    }
  }

  ngAfterViewInit() {
    this.allCameraViewItems.changes.subscribe(t => {
      this.bindVideoStreaming();
    });
  }

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
      // first we want users to enter their names
      console.log('connection open...');
      let m;
      if (isRecorded) {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.name,
          ArchiveStartTime: startTime,
          PlayBackSpeed: playBackSpeed,
          Username: cameraData.username,
          Password: cameraData.password,
          HostString: cameraData.url
        });
      } else {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.name,
          Username: cameraData.username,
          Password: cameraData.password,
          HostString: cameraData.url
        });
      }
      // send the message as an ordinary text
      self.connectionRTC[roomIndex].send(m);
    };

    this.connectionRTC[roomIndex].onerror = function(error) {
      // just in there were some problems with conenction...
      const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + videoName);
      errorMessageId.style.display = 'block';
      const videoId = document.getElementById('streamLoader_' + videoName);
      videoId.style.display = 'none';
    };

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

    self.pc[index].onaddstream = function(i) {
      return function(event) {
        console.log(self.vidTag[i]);
        self.remoteVideoElement[i] = document.getElementById(self.vidTag[i]);
        console.log('remoteVideoElement : ', self.remoteVideoElement[i]);
        console.log(event.stream);
        self.remoteVideoElement[i].srcObject = event.stream;
        const strPos = self.vidTag[i].indexOf(self.remoteVideo);
        const idElem = self.vidTag[i].substring(0, strPos);
        const videoId = document.getElementById('streamLoader_' + idElem);
        videoId.style.display = 'none';
      };
    }(index);

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
        };
      }(index);

      this.pc[index].onremovestream = this.onRemoteStreamRemoved;
      console.log('Created RTCPeerConnnection with config: ' + JSON.stringify(this.pcConfig));
    } catch (e) {
      console.log('Failed to create PeerConnection with ' + ', exception: ' + e.message);
    }
  }

  processCandidate(peerTo, peerFrom, data, index) {
    const dataJson = JSON.parse(data);
    const candidate = new RTCIceCandidate({ sdpMLineIndex: dataJson.sdpMLineIndex, candidate: dataJson.candidate });
    this.pc[index].addIceCandidate(candidate, this.aic_success_cb, this.aic_failure_cb);
  }

  process_user_leave(index) {
    if (this.pc[index] != null) {
      console.log(' +++ Removing on-going session...');
      this.pc[index].close();
      this.pc[index] = null;
    } else {
      console.log('+++ No on-going session...');
    }
  }

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


  removeTab(ev, camData) {
    const totalCamera = this.cameraData.length;
    const deletedCamera = this.cameraData.filter((obj) => obj.action === ActionType.Delete).length;
    const remainingCamera = totalCamera - deletedCamera;
    if (remainingCamera === 1) {
      const btnVal: any = this.translate.get('camera.cancel');
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
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          camData.action = ActionType.Delete;
        }
      });
    }
  }

  onEditTabClick(ev, camData) {
    this.tabData.name = camData.name;
    this.tabData.layoutId = CameraLayoutID[camData.layoutID];
    this.tabData.action = ActionType.Update;
    this.tabData.cameraViewItems = camData.cameraViewItems;
    this.tabData.viewGuid = camData.viewGuid;
    this.tabData.viewId = camData.viewId;
  }

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

  addRecordedFeedProperties(ev) {
    this.selectedCamData.isRecorded = true;
    this.selectedTabData.cameraViewItems.forEach(camObj => {
      if (camObj.channelGuid === this.selectedCamData.channelGuid) {
        camObj.isRecorded = true;
      }
    });
    this.liveOrRecordedStream(this.selectedCamData);
    this.selectedCamData = {};
    this.closeRecordedFeedPopUp();
  }

  closeRecordedFeedPopUp() {
    $('#recordedPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  closeRecordedFeedPropertiesPopUp(ev) {
    this.selectedCamData = {};
  }

  closeStream(obj: any) {
    if (this.connectionRTC[obj.roomIndex + 1]) {
      this.connectionRTC[obj.roomIndex + 1].close();
    }
  }


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
    this.v.addEventListener('dblclick', function(e) {
      const document: any = window.document;
      if (v.mozRequestFullScreen) {
        if (document.mozFullScreenElement) {
          document.mozCancelFullScreen();
        } else {
          v.mozRequestFullScreen();
        }
      } else if (v.requestFullscreen) {
        if (document.fullScreenElement) {
          document.cancelFullScreen();
        } else {
          v.requestFullscreen();
        }
      } else if (v.msRequestFullscreen) {
        if (document.msFullscreenElement) {
          document.msExitFullscreen();
        } else {
          v.msRequestFullscreen();
        }
      } else if (v.webkitRequestFullscreen) {
        if (document.webkitFullscreenElement) {
          document.webkitCancelFullScreen();
        } else {
          v.webkitRequestFullscreen();
        }
      }
    }, false);

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

    /* If a button was clicked (uses event delegation)...*/
    controls.addEventListener('click', function(e) {
      t = e.target;
      console.log(t);
      if (t.nodeName.toLowerCase() === 'i') {
        let leftValue = 0;
        let rightValue = 0;
        /* Check the class name of the button and act accordingly */
        switch (t.innerHTML) {

          /* Toggle play functionality and button label */
          case 'play_arrow':
            self.playAgainVideoAfterPause(self, customName);
            if (v.paused) {
              v.play();
              t.innerHTML = 'pause_arrow';
            } else {
              v.pause();
              t.innerHTML = 'play_arrow';
            }
            break;

          case 'pause_arrow':
            self.onPauseVideo(self, customName, v);
            if (v.paused) {
              v.play();
              t.innerHTML = 'pause_arrow';
            } else {
              v.pause();
              t.innerHTML = 'play_arrow';
            }
            break;

          case 'fullscreen':
            if (v.requestFullscreen) {
              v.requestFullscreen();
            } else if (v.mozRequestFullScreen) {
              v.mozRequestFullScreen(); // Firefox
            } else if (v.webkitRequestFullscreen) {
              v.webkitRequestFullscreen(); // Chrome and Safari
            }
            break;
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
      } else if (t.innerHTML === 'Archive') {
        self.selectedTabData.cameraViewItems.forEach(camObj => {
          if (camObj.channelGuid === customName) {
            self.selectedCamData = camObj;
          }
        });
      } else if (t.innerHTML === 'Live') {
        self.selectedTabData.cameraViewItems.forEach(camObj => {
          if (camObj.channelGuid === customName) {
            self.selectedCamData = camObj;
            self.selectedCamData.isRecorded = false;
            camObj.isRecorded = false;
            self.liveOrRecordedStream(self.selectedCamData);
          }
        });
      }
      e.preventDefault();
    }, false);

  }

  playAgainVideoAfterPause(self, customName: any) {
    self.selectedTabData.cameraViewItems.forEach(camObj => {
      if (camObj.channelGuid === customName) {
        if (camObj.isRecorded) {
          const loaderId = document.getElementById('streamLoader_' + camObj.channelGuid);
          if (loaderId) {
            loaderId.style.display = 'block';
          }
          let startDateTime = null;
          console.log(camObj.archiveStartDate);
          camObj.archiveStartDate.setSeconds(camObj.archiveStartDate.getSeconds() + camObj.pauseTime);
          const dateTime = new Date(camObj.archiveStartDate);
          startDateTime = dateTime.toLocaleString();
          console.log(startDateTime);
          // bind new connection with stream
          self.signIn(camObj.channelGuid, this.mediaServerUrl, camObj, camObj.isRecorded, startDateTime, 0);
        }
      }
    });
  }

  onPauseVideo(self, customName: any, v: any) {
    self.selectedTabData.cameraViewItems.forEach(camObj => {
      if (camObj.isRecorded && camObj.channelGuid === customName) {
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



  selectVideoFrame(e, channelGuid) {
    console.log('click');
    console.log(channelGuid);
  }

  removeCameraFromFrame(ev, camObj) {
    const deleteConfirmVal: any = this.translate.get('camera.areyousureyouwanttodeletethisframe');
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
        }
        if (!camObj.isNotExistInDb) {
          camObj.action = ActionType.Delete;
        } else {
          camObj.action = ActionType.None;
        }
        this.cameraComponentLibraryData.forEach(cam => {
          const matchCam = cam.cameraDetails.find(z => z.channelGuid === camObj.channelGuid);
          if (matchCam) {
            matchCam.isUsed = false;
            // camObj.channelGuid = null;
            camObj.isStreamed = false;
            camObj.isExecuted = false;
            camObj.isSelected = false;
          }
        });
      }
    });

  }

  signIn(name, server, cameraData, isRecorded, startTime, playBackSpeed) {
    try {
      this.index++;
      this.signInToServer(name, server, this.index, cameraData, isRecorded, startTime, playBackSpeed);
    } catch (e) {
      console.log('error :  ' + e.description);
    }
  }

  onSaveCameraDetail(ev) {
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
    const alreadyStreamedId = document.getElementById('alreadyStreamedOnCameraFrame_' + channelGuid);
    if (errorMessageId && errorMessageId.style.display === 'none' && errorMessageId && alreadyStreamedId.style.display === 'none' && loaderId && loaderId.style.display === 'none') {
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

}

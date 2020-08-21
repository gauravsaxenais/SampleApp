/**
 * Import dependencies
 */
import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { urls } from 'src/app/services/urls';
import { HttpService } from 'src/app/services/http.service';
import { ConfigService } from '../../../../services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utility.services';
import { VideoServerType } from 'src/app/shared/enums';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { debug } from 'util';
declare var $: any;
declare var EVWEB2: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-camera-single-popup',
  templateUrl: './camera-single-popup.component.html',
  styleUrls: ['./camera-single-popup.component.css']
})

/**
 * Monitoring camera single popup component
 */
export class CameraSinglePopupComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Variables declaration
   */
  mediaServerUrl = this.configService.getConfig().mediaServerUrl;
  channelGuid: string;
  timeStamp: string;
  siteId = this.local.getSiteId();
  singleCameraData: any = {};
  videoTagsList: any = [];
  remoteVideo = '_remote_video';
  connectionRTC: any = {};
  pcConfig = { iceServers: [{ urls: this.configService.getConfig().iceServerUrl }] };
  pc: any = {};
  elemMap = new Map();
  myId: any = {};
  vidTag: any = {};
  index = 0;
  v: any;
  remoteVideoElement: any = {};
  execQServerUrl: string;
  execQUserId: string;
  execQUserPassword: string;

  @ViewChildren('singleCamera') singleCameraItem: any;
  /**
   * Inject the services in the constructor
   */
  constructor(
    private local: LocalStorageService,
    private httpService: HttpService,
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) { }

  /**
   * OnInit
   * bind the left side component library
   * bind the right side camera data
   */
  ngOnInit() {
    let localLanguage = this.local.getLanguage();
    if (!localLanguage || localLanguage === 'null') {
      localLanguage = 'en';
    }
    this.translate.use(localLanguage);
    this.channelGuid = this.route.snapshot.paramMap.get('channelGuid');
    this.timeStamp = this.route.snapshot.paramMap.get('timeStamp');
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
      if (this.singleCameraData.connectionId === String(cams[cameraCount].id) && this.singleCameraData.serverType === VideoServerType.ExecQ) {
        this.singleCameraData.camObject = cams[cameraCount];
        this.liveOrRecordedStreamExecQ(this.singleCameraData);
      }
      cameraCount++;
    });
  }

  /**
   *  bindCameraData - bind the single camera data
   */
  bindCameraData() {
    const url = urls.getSingleCameraData + '/' + this.siteId + '?channelGuid=' + this.channelGuid;
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200 && res.data) {
          this.singleCameraData = res.data;
          if (this.timeStamp) {
            const sTime = new Date(this.timeStamp);
            sTime.setSeconds(sTime.getSeconds() - this.configService.getConfig().eventTimeBefore);
            this.singleCameraData.archiveStartDate = sTime;
            this.singleCameraData.isRecorded = true;
          }

        }
      });
  }

  /**
   * AfterViewInit - Bind video streaming after load video tags in the DOM
   */
  ngAfterViewInit() {
    this.singleCameraItem.changes.subscribe(t => {
      if (this.singleCameraData.serverType === VideoServerType.ExecQ) {
        this.execQServerUrl = this.singleCameraData.url;
        this.execQUserId = this.singleCameraData.username;
        this.execQUserPassword = this.singleCameraData.password;
        // Bind video stream in call back function onGetCamerasResponse
        const myService = new EVWEB2.Service(this.execQServerUrl, '');
        myService.getServers(this.onGetServersResponse.bind(this));
      } else {
        this.liveOrRecordedStream(this.singleCameraData);
      }
    });
  }

  /**
   * OnDestroy - Close all the connected streams
   */
  ngOnDestroy() {
    this.videoTagsList.forEach(obj => {
      if (this.connectionRTC[obj.roomIndex + 1]) {
        this.connectionRTC[obj.roomIndex + 1].close();
      }
    });
  }

  /**
   * Sign in to media server
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
    this.connectionRTC[roomIndex].onopen = function() {
      // first we want users to enter their names
      let m;
      if (isRecorded) {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.channelName,
          ArchiveStartTime: cameraData.archiveStartDate,
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
          CameraId: cameraData.channelName,
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

  /**
   * To check session connection
   * @param message
   */
  onSessionConnecting(message) {
    console.log('Session connecting.');
  }

  /**
   * To check session opened
   * @param message
   */
  onSessionOpened(message) {
    console.log('Session opened.');
  }

  /**
   * To check remove stream
   * @param message
   */
  onRemoteStreamRemoved(event) {
    console.log('Remote stream removed.');
  }

  /**
   * To check sdp error
   * @param message
   */
  onRemoteSdpError(event) {
    console.error('onRemoteSdpError', event.name, event.message);
  }

  /**
   * To check session success
   * @param message
   */
  onRemoteSdpSucces() {
    console.log('onRemoteSdpSucces');
  }

  /**
   * To check sld success
   * @param message
   */
  sld_success_cb() {
  }

  /**
   * To check sld failure
   * @param message
   */
  sld_failure_cb() {
    console.log('setLocalDescription failed');
  }

  /**
   * To check aic success
   * @param message
   */
  aic_success_cb() {
    console.log('+++ Candidate success ++++');
  }

  /**
   * To check aic failure
   * @param message
   */
  aic_failure_cb() {
    console.log('addIceCandidate failed');
  }

  /**
   * Process media server request
   * @param peerTo
   * @param peerFrom
   * @param data
   * @param index
   * @param self
   */
  processOffer(peerTo, peerFrom, data, index, self) {
    console.log('******', data);

    const dataJson = JSON.parse(data);
    console.log('received ', dataJson);

    self.createPeerConnection(peerTo, peerFrom, index);
    console.log('*** register data channel event....');
    self.pc[index].setRemoteDescription(new RTCSessionDescription(dataJson), self.onRemoteSdpSucces, self.onRemoteSdpError);

    self.pc[index].onaddstream = function(i) {
      return function(event) {
        self.remoteVideoElement[i] = document.getElementById(self.vidTag[i]);
        self.remoteVideoElement[i].srcObject = event.stream;
        const strPos = self.vidTag[i].indexOf(self.remoteVideo);
        const idElem = self.vidTag[i].substring(0, strPos);
        const videoId = document.getElementById('streamLoader_' + idElem);
        videoId.style.display = 'none';
        const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
        errorMessageId.style.display = 'none';
        self.singleCameraData.isBindStream = true;
      };
    }(index);

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

  /**
   * Create peer connection --parameter peer_io is myself and peer_from is remote peer
   * @param peerTo
   * @param peerFrom
   * @param index
   */
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
          this.remoteVideoElement[i].srcObject = event.stream;
          const strPos = this.vidTag[i].indexOf(this.remoteVideo);
          const idElem = this.vidTag[i].substring(0, strPos);
          const videoId = document.getElementById('streamLoader_' + idElem);
          videoId.style.display = 'none';
          const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
          errorMessageId.style.display = 'none';
          this.singleCameraData.isBindStream = true;
        };
      }(index);

      this.pc[index].onremovestream = this.onRemoteStreamRemoved;
    } catch (e) {
      console.log('Failed to create PeerConnection with ' + ', exception: ' + e.message);
    }
  }

  /**
   * Add candidate detail for web RTC
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
   * Leave stream
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
   * Sign in call back to if type is self for media connection
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
   * Send parameter to media
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
   * Event of archive click after date time selection
   * @param ev
   */
  addRecordedFeedProperties(ev) {
    this.singleCameraData.isRecorded = true;
    this.closeRecordedFeedPopUp();
  }

  /**
   * To run live or recorded stream for March Network
   * @param camData
   */
  liveOrRecordedStream(camData) {

    // bind new connection with stream
    const vid = document.getElementById(this.channelGuid);

    if (this.videoTagsList.length > 0) {
      this.videoTagsList.forEach(obj => {
        const strPos = obj.videoName.indexOf(this.remoteVideo);
        const idElem = obj.videoName.substring(0, strPos);
        if (idElem === camData.channelGuid) {
          this.closeStream(obj);
          const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
          if (errorMessageId) {
            errorMessageId.style.display = 'none';
          }

          const loaderId = document.getElementById('streamLoader_' + idElem);
          if (loaderId) {
            loaderId.style.display = 'block';
          }
        }
      });
    } else if (vid) {
      const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + this.channelGuid);
      if (errorMessageId) {
        errorMessageId.style.display = 'none';
      }
      vid.setAttribute('autoplay', 'true');
      vid.style.display = 'block';
      vid.setAttribute('id', this.channelGuid + this.remoteVideo);
      this.addVideoControlBar(this.channelGuid, this.channelGuid);
      camData.isExecuted = true;
    }

    if (camData.isRecorded) {
      let startDateTime = null;
      if (camData.isRecorded) {
        this.closeRecordedFeedPopUp();
        const dateTime = new Date(camData.archiveStartDate);
        startDateTime = dateTime.toLocaleString();
      }
      // bind new connection with stream
      this.signIn(camData.channelGuid, this.mediaServerUrl, camData, camData.isRecorded, startDateTime, 0);
    } else {
      this.signIn(camData.channelGuid, this.mediaServerUrl, camData, this.singleCameraData.isRecorded, null, 0);
    }
  }

  /**
   * To run live or recorded stream for Exaq
   * @param camData
   */
  liveOrRecordedStreamExecQ(camData) {

    // bind new connection with stream
    const vid = document.getElementById(this.channelGuid);

    if (this.videoTagsList.length > 0) {
      this.videoTagsList.forEach(obj => {
        const strPos = obj.videoName.indexOf(this.remoteVideo);
        const idElem = obj.videoName.substring(0, strPos);
        if (idElem === camData.channelGuid) {
          this.closeStream(obj);
          const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + idElem);
          if (errorMessageId) {
            errorMessageId.style.display = 'none';
          }

          const loaderId = document.getElementById('streamLoader_' + idElem);
          if (loaderId) {
            loaderId.style.display = 'block';
          }
        }
      });
    } else if (vid) {
      const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + this.channelGuid);
      if (errorMessageId) {
        errorMessageId.style.display = 'none';
      }
      vid.setAttribute('autoplay', 'true');
      vid.style.display = 'block';
      vid.setAttribute('id', this.channelGuid + this.remoteVideo);
      this.addVideoControlBar(this.channelGuid, this.channelGuid);
      camData.isExecuted = true;
    }

    let startDateTime = null;
    if (camData.isRecorded) {
      this.closeRecordedFeedPopUp();
      const dateTime = new Date(camData.archiveStartDate);
      startDateTime = dateTime.toLocaleString();

      const start = new Date(startDateTime);
      const end = new Date();
      EVWEB2.getSearch(this.onGetSearchResponse.bind(this), [camData.camObject], start, end);
    } else {
      // const myService = new EVWEB2.Service(this.execQServerUrl, '');
      // myService.getServers(this.onGetServersResponse.bind(this));
      this.singleCameraData.videoUrl = this.singleCameraData.camObject.getVideo(EVWEB2.cameraFormats.h264);
      this.signIn(this.singleCameraData.channelGuid, this.mediaServerUrl, this.singleCameraData, this.singleCameraData.isRecorded, null, 0);
    }
  }

  /**
   * Exaq Archive stream
   * @param response
   * @param mySearch
   */
  onGetSearchResponse(response, mySearch) {
    if (response.success) {
      const that = this;
      if (response.success) {
        that.singleCameraData.videoUrl = mySearch.cameras[0].getVideo(EVWEB2.cameraFormats.h264, mySearch.searchId);
        this.signIn(that.singleCameraData.channelGuid, this.mediaServerUrl, that.singleCameraData, that.singleCameraData.isRecorded, null, 0);
      }
    } else {
      const errorMessageId = document.getElementById('errorMessageOnCameraFrame_' + this.channelGuid);
      errorMessageId.style.display = 'block';
      const videoId = document.getElementById('streamLoader_' + this.channelGuid);
      videoId.style.display = 'none';
    }


  }

  /** Close recorded feed */
  closeRecordedFeedPopUp() {
    $('#recordedPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  /**
   * Close date selection popup
   * @param ev
   */
  closeRecordedFeedPropertiesPopUp(ev) {
  }

  /**
   * Close stream
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
   * Add video control bar
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
    // controls.style.display = 'block';
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

    this.v.addEventListener('pause', function(e) {
      self.onPauseVideo(self, customName, v);
    }, false);


    this.v.addEventListener('play', function(e) {
      self.playAgainVideoAfterPause(self, customName);
    }, false);

    /* If a button was clicked (uses event delegation)...*/
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
            v.currentTime += 7;
            break;

          case 'fast_forward':
            v.currentTime = v.currentTime + self.configService.getConfig().mediaForwardTime;
            self.onPauseVideo(self, customName, v);
            self.playAgainVideoAfterPause(self, customName);
            break;
        }

      } else if (t.innerHTML === 'Archive' || t.innerHTML === archiveVal.value) {
      } else if (t.innerHTML === 'Live' || t.innerHTML === liveVal.value) {
        self.singleCameraData.isRecorded = false;
      }
      e.preventDefault();
    }, false);

  }

  /**
   * Add play again video button event
   * @param self
   * @param customName
   */
  playAgainVideoAfterPause(self, customName: any) {
    const camObj = self.singleCameraData;
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
  }

  /**
   * To pause video
   * @param self
   * @param customName
   * @param v
   */
  onPauseVideo(self, customName: any, v: any) {
    const camObj = self.singleCameraData;
    // self.selectedTabData.cameraViewItems.forEach(camObj => {
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
    // });
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
    if (errorMessageId && errorMessageId.style.display === 'none' && loaderId && loaderId.style.display === 'none') {
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

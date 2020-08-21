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
declare var $: any;

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
  siteId = this.local.getSiteId();
  singleCameraData: any = {};
  videoTagsList: any = [];
  remoteVideo = '_remote_video';
  connectionRTC: any = {};
  pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  pc: any = {};
  elemMap = new Map();
  myId: any = {};
  vidTag: any = {};
  index = 0;
  v: any;
  remoteVideoElement: any = {};

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
    this.channelGuid = this.route.snapshot.paramMap.get('channelGuid');
    this.bindCameraData();
    this.utilsService.getSetLanguage();
  }

  /**
   *  bindCameraData - bind the single camera data
   */
  bindCameraData() {
    const url = urls.getSingleCameraData + '/' + this.siteId + '?channelGuid=' + this.channelGuid;
    console.log(url);
    this.httpService.getRequest(url).subscribe(
      (res: any) => {
        if (res.success && res.message.messageCode === 200) {
          console.log(res.data);
          this.singleCameraData = res.data;
        }
      });
  }

  /**
   * AfterViewInit - Bind video streaming after load video tags in the DOM
   */
  ngAfterViewInit() {
    this.singleCameraItem.changes.subscribe(t => {
      this.bindVideoStreaming();
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
   * bindVideoStreaming - bind video
   */
  bindVideoStreaming() {
    const customName = this.channelGuid;
    this.signIn(customName, this.mediaServerUrl, this.singleCameraData, false, null, 0);
    const vid = document.getElementById(this.channelGuid);
    if (vid) {
      vid.setAttribute('autoplay', 'true');
      vid.style.display = 'block';
      vid.setAttribute('id', customName + this.remoteVideo);
      this.addVideoControlBar(customName, this.channelGuid);
    }
  }



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
      console.log('connection open...');

      let m;
      if (isRecorded) {
        m = JSON.stringify({
          type: 'username',
          name: videoName,
          CameraId: cameraData.channelName,
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
          CameraId: cameraData.channelName,
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
        console.log(i);
        console.log(self.vidTag);

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
    console.log(this.pc[index]);
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


  signIn(name, server, cameraData, isRecorded, startTime, playBackSpeed) {
    try {
      this.index++;
      this.signInToServer(name, server, this.index, cameraData, isRecorded, startTime, playBackSpeed);
    } catch (e) {
      console.log('error :  ' + e.description);
    }
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
    this.singleCameraData.isRecorded = true;
    this.liveOrRecordedStream(this.singleCameraData);
    this.closeRecordedFeedPopUp();
  }

  closeRecordedFeedPopUp() {
    $('#recordedPropertiesModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  closeRecordedFeedPropertiesPopUp(ev) {
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
      } else if (t.innerHTML === 'Live') {
        self.singleCameraData.isRecorded = false;
        self.liveOrRecordedStream(self.singleCameraData);
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

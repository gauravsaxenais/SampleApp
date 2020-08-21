'use strict';
//var room_index = 0;
var my_id = {};
var remoteVideoElement = {};
var pc = {};
var vid_tag = {};
var videotag = null;
var elem_map = new Map();
var rootVar = '';
var connection_ = {};

/* WebSocket Server */
//// if user is running mozilla then use it's built-in WebSocket
//window.WebSocket = window.WebSocket || window.MozWebSocket;
//// if browser doesn't support WebSocket, just show some notification and exit
//if (!window.WebSocket) {
//  alert('Sorry, but your browser doesn\'t '
//    + 'support WebSockets.');

//  // return;
//} else
//  console.log('websocket supported...');


var pcConfig = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };
var pcOptions = {
  optional: [
    { DtlsSrtpKeyAgreement: true }
  ]
}
var mediaConstraints = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  }
};

//RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
//RTCSessionDescription = window.RTCSessionDescription || window.RTCSessionDescription;
//RTCIceCandidate = window.RTCIceCandidate || window.RTCIceCandidate;
//getUserMedia = navigator.GetUserMedia || navigator.webkitGetUserMedia;

function disconnect(index) {
  //window.WebSocket.disconnect();
  //window.WebSocket.close();

  console.log(index);
  console.log(elem_map);
  console.log(my_id[index]);
  my_id[index] = -1;
  let elemid = elem_map.get(index);
  console.log(elemid);
  let elem = document.getElementById(elemid);
  elem.style.visibility = 'hidden';
  console.log(elem);
  elem.removeChild(elem.childNodes[0]);

  let elem2 = document.getElementById(elemid + '_s');
  elem2.style.visibility = 'hidden';
  console.log(elem2);
  elem2.removeChild(elem2.childNodes[0]);

  let elem3 = document.getElementById(elemid + '_n');
  elem3.style.visibility = 'hidden';
  console.log(elem3);
  elem3.removeChild(elem3.childNodes[0]);

  let elem4 = document.getElementById(elemid + '_remote_video');
  elem4.style.visibility = 'hidden';
  console.log(elem4);

}


function onSessionConnecting(message) {
  console.log("Session connecting.");
}

function onSessionOpened(message) {
  console.log("Session opened.");
}

function onRemoteStreamRemoved(event) {
  console.log("Remote stream removed.");
}

function onRemoteSdpError(event) {
  console.error('onRemoteSdpError', event.name, event.message);
}

function onRemoteSdpSucces() {
  console.log('onRemoteSdpSucces');
}

//Taha: parameter peer_io is myself and peer_from is remote peer
function createPeerConnection(peer_to, peer_from, index) {
  try {
    pc[index] = new RTCPeerConnection(pcConfig, pcOptions);
    pc[index].onicecandidate = function (event) {
      if (event.candidate) {
        let candidate = {
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        };
        // let cand = JSON.stringify(candidate);
        let msg = JSON.stringify({
          "type": "pass_message",
          "to": peer_from,
          "from": peer_to,
          "m_type": "candidate",
          "m": candidate
        });

        console.log(msg);
        connection_[index].send(msg);
      } else {
        console.log("End of candidates.");
      }
    };
    pc[index].onconnecting = onSessionConnecting;
    pc[index].onopen = onSessionOpened;
    //pc[index].onclose = function (index) {
    //  console.log('++++++ on close ++++++');
    //      console.log(pc[index].oniceconnectionstatechange);
    //      if(pc[index].oniceconnectionstatechange == 'disconnected') {
    //          console.log('++++++ Session Disconnected ++++++');
    //      }
    //  }
    pc[index].onaddstream = function (i) {
      return function (event) {
        remoteVideoElement[i] = document.getElementById(vid_tag[i]);
        console.log('remoteVideoElement : ', remoteVideoElement[i]);
        remoteVideoElement[i].srcObject = event.stream;
      };
    }(index);

    pc[index].onremovestream = onRemoteStreamRemoved;
    console.log("Created RTCPeerConnnection with config: " + JSON.stringify(pcConfig));
  }
  catch (e) {
    console.log("Failed to create PeerConnection with " + connectionId + ", exception: " + e.message);
  }
}


function sld_success_cb() {
}

function sld_failure_cb() {
  console.log("setLocalDescription failed");
}

function aic_success_cb() {
  console.log('+++ Candidate success ++++');
}

function aic_failure_cb() {
  console.log("addIceCandidate failed");
}


function processOffer(peer_to, peer_from, data, index) {
  console.log('******', data);

  var dataJson = JSON.parse(data);
  console.log("received ", dataJson);

  createPeerConnection(peer_to, peer_from, index);
  console.log('*** register data channel event....');
  pc[index].setRemoteDescription(new RTCSessionDescription(dataJson), onRemoteSdpSucces, onRemoteSdpError);

  pc[index].onaddstream = function (i) {
    return function (event) {
      remoteVideoElement[i] = document.getElementById(vid_tag[i]);
      console.log('remoteVideoElement : ', remoteVideoElement[i]);
      remoteVideoElement[i].srcObject = event.stream;
    };
  }(index);

  pc[index].onremovestream = onRemoteStreamRemoved;
  pc[index].createAnswer(function (sessionDescription) {
    console.log("Create answer:", sessionDescription);
    pc[index].setLocalDescription(sessionDescription, sld_success_cb, sld_failure_cb);

    let msg = JSON.stringify({
      "type": "pass_message",
      "to": peer_from,
      "from": peer_to,
      "m_type": "answer",
      "m": sessionDescription
    });

    console.log(msg);
    connection_[index].send(msg);


  }, function (error) { // error
    console.log("Create answer error:", error);
  }, mediaConstraints); // type error  ); //}, null          

}

function processCandidate(peer_to, peer_from, data, index) {
  var dataJson = JSON.parse(data);

  console.log("Adding ICE candiate ", dataJson);
  console.log(dataJson.sdpMLineIndex);
  console.log(dataJson.candidate);

  var candidate = new RTCIceCandidate({ sdpMLineIndex: dataJson.sdpMLineIndex, candidate: dataJson.candidate });
  pc[index].addIceCandidate(candidate, aic_success_cb, aic_failure_cb);
}

function process_user_leave(index) {
  if (pc[index] != null) {
    console.log(' +++ Removing on-going session...');
    pc[index].close();
    pc[index] = null;
  }
  else
    console.log('+++ No on-going session...');
}

function signInCallback(index, selfid) {

  let id_connected = selfid;

  console.log(id_connected);
  console.log(videotag);
  let str_pos = videotag.indexOf("_remote_video");
  let id_elem = videotag.substring(0, str_pos);
  console.log("str_pos : ", str_pos, " id_elem : ", id_elem);

  //room_index++;
  elem_map.set(index, id_elem);

  my_id[index] = id_connected;
  vid_tag[index] = videotag;
  console.log('index: ', index);
  console.log('vid_tag[index]: ', vid_tag[index]);

  console.log('index: ', index);
  console.log('my_id[index]: ', my_id[index]);
  return my_id[index];
}



function signInToServer(Name, server, room_index) {

  console.log(Name);
  console.log(server);
  videotag = Name + "_remote_video";

  let con = new WebSocket(server);

  room_index++;
  console.log(room_index);
  connection_[room_index] = con;

  console.log(Name);
  console.log(server);

  connection_[room_index].onopen = function () {
    // first we want users to enter their names            
    console.log('connection open...');

    console.log(connection_[room_index]);
    let m = JSON.stringify({
      'type': "username",
      'name': Name
    });
    console.log(m);
    // send the message as an ordinary text
    console.log(connection_[room_index]);
    connection_[room_index].send(m);
  };

  connection_[room_index].onerror = function (error) {
    // just in there were some problems with conenction...
    alert('Sorry, but there\'s some problem with your '
      + 'connection or the server is down.');
  };

  // most important part - incoming messages
  connection_[room_index].onmessage = function (message) {
    // try to parse JSON message. Because we know that the server always returns
    // JSON this should work without any problem but we should make sure that
    // the massage is not chunked or otherwise damaged.
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log(message);
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }

    // NOTE: if you're not sure about the JSON structure
    // check the server source code above
    if (json.type === 'message') { // it's a single message

      console.log(json);
    } else if (json.type === 'self_id') {
      let self_id = json.id;
      console.log(json);
      rootVar = signInCallback(room_index, self_id);
      console.log('signInCallback my_id[index]: ', rootVar);
    } else if (json.type === 'user_add') {
      console.log('index: ', room_index);
      console.log(json);
    } else if (json.type === 'user_leave') {
      process_user_leave(room_index);
      console.log(json);
    } else if (json.type === 'pass_message') {
      if (json.m_type === 'offer') {       //Taha: recieve sdp in offer...
        console.log(json.m);
        processOffer(json.to, json.from, json.m, room_index);
      } else if (json.m_type === 'candidate') {
        console.log(json.m);
        processCandidate(json.to, json.from, json.m, room_index);
      } else {
        console.error('Unknown message ', json);
      }

    } else if (json.type === 'offer') {
       console.log(json);
    } else {
      console.log('Hmm..., I\'ve never seen JSON like this: ', json);
    }
  };
}




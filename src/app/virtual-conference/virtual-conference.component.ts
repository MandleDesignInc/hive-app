import {Component, OnInit, ViewChild} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import * as io from 'socket.io-client';
import {AppBarService} from '../app-bar.service';
import {SocketIOService} from './socket-io.service';

@Component({
  selector: 'app-virtual-conference',
  templateUrl: './virtual-conference.component.html',
  styleUrls: ['./virtual-conference.component.scss']
})
export class VirtualConferenceComponent {

    @ViewChild('localVideo') localVideo: any;
    @ViewChild('remoteVideo') remoteVideo: any;


    _navigator = <any> navigator;


    pc: RTCPeerConnection;
    localStream: MediaStream;
    remoteStream: MediaStream;
    isChannelReady: boolean = false;
    isInitiator: boolean = false;
    isStarted: boolean = false;
    turnReady: boolean;

    pcConfig: any = {
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    };


    room: string = 'conference';


    constructor(private appBarSvc: AppBarService, private socketService: SocketIOService) {

        socketService.connect();

        if (this.room !== '') {
            this.socket.emit('create or join', this.room);
            console.log('Attempted to create or join room', this.room);
        }

        socketService.setListeners();


        this.getLocalStream();


        if (location.hostname !== 'localhost') this.requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');

        window.onbeforeunload = () => this.sendMessage('bye');

    }


    getLocalStream(): void {

        // gets local media
        this._navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 }
            }
        }).then((stream) => {
            this.gotStream(stream);
        }).catch((error) => {
            alert('getUserMedia() error: ' + error.name);
        });

    }

    gotStream(stream: MediaStream): void {

        console.log('Adding local stream.');

        let mLocalVideo = this.localVideo.nativeElement;
        mLocalVideo.srcObject = stream;
        this.localStream = stream;


        this.sendMessage('got user media');
        if (this.isInitiator) this.maybeStart();

    }

    maybeStart(): void {

        console.log('>>>>>>> maybeStart() ', this.isStarted, this.localStream, this.isChannelReady);
        if (!this.isStarted && typeof this.localStream !== 'undefined' && this.isChannelReady) {

            console.log('>>>>>> creating peer connection');

            this.createPeerConnection();

            this.pc.addStream(this.localStream);

            this.isStarted = true;

            console.log('isInitiator', this.isInitiator);

            if (this.isInitiator) this.doCall();

        }
    }

    hangup(): void {
        console.log('Hanging up.');
        stop();
        this.sendMessage('bye');
    }

    handleRemoteHangup(): void {
        console.log('Session terminated.');
        this.stop();
        this.isInitiator = false;
    }

    stop(): void {
        this.isStarted = false;
        // isAudioMuted = false;
        // isVideoMuted = false;
        this.pc.close();
        this.pc = null;
    }


    sendMessage(message: any): void {
        console.log('Client sending message: ', message);
        this.socket.emit('message', message);
    }


    createPeerConnection(): void {

        try {

            this.pc = new RTCPeerConnection(null);
            this.pc.onicecandidate = (event) => this.handleIceCandidate(event);
            this.pc.onaddstream = (event) => this.handleRemoteStreamAdded(event);
            this.pc.onremovestream = (event) => this.handleRemoteStreamRemoved(event);

            console.log('Created RTCPeerConnnection');

        } catch (e) {

            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;

        }

    }

    handleIceCandidate(event): void {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
            this.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    }

    handleCreateOfferError(event): void {
        console.log('createOffer() error: ', event);
    }

    doCall(): void {
        console.log('Sending offer to peer');
        this.pc.createOffer((sessionDescription) => this.setLocalAndSendMessage(sessionDescription), (event) => this.handleCreateOfferError(event));
    }

    doAnswer(): void {
        console.log('Sending answer to peer.');
        this.pc.createAnswer().then((sessionDescription) => this.setLocalAndSendMessage(sessionDescription), (error) => this.onCreateSessionDescriptionError(error));
    }

    setLocalAndSendMessage(sessionDescription): void {
        // Set Opus as the preferred codec in SDP if Opus is present.
        //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
        this.pc.setLocalDescription(sessionDescription);
        console.log('setLocalAndSendMessage sending message', sessionDescription);
        this.sendMessage(sessionDescription);
    }

    onCreateSessionDescriptionError(error): void {
        console.log('Failed to create session description: ' + error.toString());
    }

    requestTurn(turnURL): void {

        console.log('requesting turn...');

        let turnExists = false;
        for (let i in this.pcConfig.iceServers) {
            if (this.pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
                turnExists = true;
                this.turnReady = true;
                break;
            }
        }
        if (!turnExists) {
            console.log('Getting TURN server from ', turnURL);
            // No TURN server. Get one from computeengineondemand.appspot.com:
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let turnServer = JSON.parse(xhr.responseText);
                    console.log('Got TURN server: ', turnServer);
                    this.pcConfig.iceServers.push({
                        'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                        'credential': turnServer.password
                    });
                    this.turnReady = true;
                }
            };
            xhr.open('GET', turnURL, true);
            xhr.send();
        }
    }



    handleRemoteStreamAdded(event): void {
        console.log('Remote stream added.');

        // this.remoteVideo.src = window.URL.createObjectURL(event.stream);
        let mRemoteVideo = this.remoteVideo.nativeElement;
        mRemoteVideo.srcObject = event.stream;

        this.remoteStream = event.stream;
    }

    handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }



    preferOpus(sdp): void {
        let sdpLines = sdp.split('\r\n');
        let mLineIndex;
        // Search for m line.
        for (let i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('m=audio') !== -1) {
                mLineIndex = i;
                break;
            }
        }
        if (mLineIndex === null) {
            return sdp;
        }

        // If Opus is available, set it as the default in m line.
        for (let i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('opus/48000') !== -1) {
                let opusPayload = this.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                if (opusPayload) {
                    sdpLines[mLineIndex] = this.setDefaultCodec(sdpLines[mLineIndex],
                        opusPayload);
                }
                break;
            }
        }

        // Remove CN in m line and sdp.
        sdpLines = this.removeCN(sdpLines, mLineIndex);

        sdp = sdpLines.join('\r\n');
        return sdp;
    }

    extractSdp(sdpLine, pattern) {
        let result = sdpLine.match(pattern);
        return result && result.length === 2 ? result[1] : null;
    }

    setDefaultCodec(mLine, payload) {
        let elements = mLine.split(' ');
        let newLine = [];
        let index = 0;
        for (let i = 0; i < elements.length; i++) {
            if (index === 3) { // Format of media starts from the fourth.
                newLine[index++] = payload; // Put target payload to the first.
            }
            if (elements[i] !== payload) {
                newLine[index++] = elements[i];
            }
        }
        return newLine.join(' ');
    }

    removeCN(sdpLines, mLineIndex) {
        let mLineElements = sdpLines[mLineIndex].split(' ');
        // Scan from end for the convenience of removing an item.
        for (let i = sdpLines.length - 1; i >= 0; i--) {
            let payload = this.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
            if (payload) {
                let cnPos = mLineElements.indexOf(payload);
                if (cnPos !== -1) {
                    // Remove CN payload from m line.
                    mLineElements.splice(cnPos, 1);
                }
                // Remove CN line in sdp
                sdpLines.splice(i, 1);
            }
        }

        sdpLines[mLineIndex] = mLineElements.join(' ');
        return sdpLines;
    }



}

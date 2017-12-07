import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable()
export class SocketIOService {

  socket: any;

  connect() {

    this.socket = io('http://localhost:8080');

  }

  setListeners(): void {

      this.socket.on('created', (room) => {

          console.log('Created room ' + room);
          this.isInitiator = true;

      });

      this.socket.on('full', (room) => {
          console.log('Room ' + room + ' is full');
      });

      this.socket.on('join', (room) => {
          console.log('Another peer made a request to join room ' + room);
          console.log('This peer is the initiator of room ' + room + '!');
          this.isChannelReady = true;
      });

      this.socket.on('joined', (room) => {
          console.log('joined: ' + room);
          this.isChannelReady = true;
      });

      this.socket.on('log', (array) => {
          console.log.apply(console, array);
      });


      this.socket.on('message', (message) => {
          console.log('Client received message:', message);
          if (message === 'got user media') {
              this.maybeStart();
          } else if (message.type === 'offer') {
              if (!this.isInitiator && !this.isStarted) {
                  this.maybeStart();
              }
              this.pc.setRemoteDescription(new RTCSessionDescription(message));
              this.doAnswer();
          } else if (message.type === 'answer' && this.isStarted) {
              this.pc.setRemoteDescription(new RTCSessionDescription(message));
          } else if (message.type === 'candidate' && this.isStarted) {
              let candidate = new RTCIceCandidate({
                  sdpMLineIndex: message.label,
                  candidate: message.candidate
              });
              this.pc.addIceCandidate(candidate);
          } else if (message === 'bye' && this.isStarted) {
              this.handleRemoteHangup();
          }
      });

  }



}

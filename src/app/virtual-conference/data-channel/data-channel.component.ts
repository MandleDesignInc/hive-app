import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-data-channel',
  templateUrl: './data-channel.component.html',
  styleUrls: ['./data-channel.component.css']
})
export class DataChannelComponent implements OnInit, OnDestroy {

    localConnection;
    remoteConnection;
    sendChannel;
    receiveChannel;
    pcConstraint;
    dataConstraint;

    @ViewChild('dataChannelSend') dataChannelSendElement: any;
    @ViewChild('dataChannelReceive') dataChannelReceiveElement: any;

    @ViewChild('send') send: HTMLButtonElement;

    dataChannelSend: HTMLTextAreaElement;
    dataChannelReceive: HTMLTextAreaElement;

    messages: string[] = [];

    constructor() { }

    ngOnInit() {
      this.dataChannelSend = this.dataChannelSendElement.nativeElement;
      this.dataChannelReceive = this.dataChannelReceiveElement.nativeElement;

      this.createConnection();
    }

    ngOnDestroy() {
        this.closeDataChannels();
    }


    disableSendButton() {
        this.send.disabled = true;
    }

    createConnection(): void {

        this.dataChannelSend.placeholder = '';

        let servers = null;
        this.pcConstraint = null;
        this.dataConstraint = null;
        this.trace('Using SCTP based data channels');

        // For SCTP, reliable and ordered delivery is true by default.
        // Add localConnection to global scope to make it visible
        // from the browser console.

        // this.localConnection = new RTCPeerConnection(servers, this.pcConstraint);
        this.localConnection = new RTCPeerConnection(servers);

        this.trace('Created local peer connection object localConnection');

        this.sendChannel = this.localConnection.createDataChannel('sendDataChannel', this.dataConstraint);
        this.trace('Created send data channel');

        this.localConnection.onicecandidate = (event) => this.iceCallback1(event);
        this.sendChannel.onopen = () => this.onSendChannelStateChange();
        this.sendChannel.onclose = () => this.onSendChannelStateChange();

        // Add remoteConnection to global scope to make it visible
        // from the browser console.
        // this.remoteConnection = new RTCPeerConnection(servers, pcConstraint);
        this.remoteConnection = new RTCPeerConnection(servers);

        this.trace('Created remote peer connection object remoteConnection');

        this.remoteConnection.onicecandidate = () => { this.iceCallback2(event); };
        this.remoteConnection.ondatachannel = (event) => this.receiveChannelCallback(event);

        this.localConnection.createOffer().then((desc) => { this.gotDescription1(desc); }, (error) => { this.onCreateSessionDescriptionError(error); });

        this.sendChat('Welcome to the virtual conference!');
    }

    onCreateSessionDescriptionError(error): void {
       this.trace('Failed to create session description: ' + error.toString());
    }

    sendData(): void {
        let data = this.dataChannelSend.value;
        this.sendChannel.send(data);
        this.trace('Sent Data: ' + data);

        this.dataChannelSend.value = '';
    }

    closeDataChannels(): void {
        this.trace('Closing data channels');
        this.sendChannel.close();
        this.trace('Closed data channel with label: ' + this.sendChannel.label);
        this.receiveChannel.close();
        this.trace('Closed data channel with label: ' + this.receiveChannel.label);
        this.localConnection.close();
        this.remoteConnection.close();
        this.localConnection = null;
        this.remoteConnection = null;
        this.trace('Closed peer connections');
        this.send.disabled = true;
        this.dataChannelSend.value = '';
        this.dataChannelReceive.value = '';
        this.dataChannelSend.disabled = true;
        this.disableSendButton();
    }

    gotDescription1(desc) {
        this.localConnection.setLocalDescription(desc);
        this.trace('Offer from localConnection \n' + desc.sdp);
        this.remoteConnection.setRemoteDescription(desc);
        this.remoteConnection.createAnswer().then((desc2) => { this.gotDescription2(desc2); }, (error) => { this.onCreateSessionDescriptionError(error); } );
    }

    gotDescription2(desc) {
        this.remoteConnection.setLocalDescription(desc);
        this.trace('Answer from remoteConnection \n' + desc.sdp);
        this.localConnection.setRemoteDescription(desc);
    }

    iceCallback1(event) {

        this.trace('local ice callback');

        if (event.candidate) {

            this.remoteConnection.addIceCandidate(event.candidate).then(() => { this.onAddIceCandidateSuccess(); }, (error) => { this.onAddIceCandidateError(error); });

            this.trace('Local ICE candidate: \n' + event.candidate.candidate);
        }
    }

    iceCallback2(event) {

        this.trace('remote ice callback');

        if (event.candidate) {

            this.localConnection.addIceCandidate(event.candidate).then(() => { this.onAddIceCandidateSuccess(); }, (error) => { this.onAddIceCandidateError(error); });

            this.trace('Remote ICE candidate: \n ' + event.candidate.candidate);
        }
    }

    onAddIceCandidateSuccess() { this.trace('AddIceCandidate success.'); }

    onAddIceCandidateError(error) { this.trace('Failed to add Ice Candidate: ' + error.toString()); }

    receiveChannelCallback(event) {
        this.trace('Receive Channel Callback');
        this.receiveChannel = event.channel;
        this.receiveChannel.onmessage = (msg) => this.onReceiveMessageCallback(msg);
        this.receiveChannel.onopen = () => this.onReceiveChannelStateChange();
        this.receiveChannel.onclose = () => this.onReceiveChannelStateChange();
    }

    onReceiveMessageCallback(event) {
        this.trace('Received Message');
        // this.dataChannelReceive.value = event.data;

        this.sendChat(event.data);
    }

    sendChat(message: string): void {
        this.messages.push(message);
    }

    onSendChannelStateChange() {
        let readyState = this.sendChannel.readyState;
        this.trace('Send channel state is: ' + readyState);

        if (readyState === 'open') {
            this.dataChannelSend.disabled = false;
            this.dataChannelSend.focus();
            this.send.disabled = false;
        } else {
            this.dataChannelSend.disabled = true;
            this.send.disabled = true;
        }
    }

    onReceiveChannelStateChange() {
        let readyState = this.receiveChannel.readyState;
        this.trace('Receive channel state is: ' + readyState);
    }

    trace(text) {
        if (text[text.length - 1] === '\n') {
            text = text.substring(0, text.length - 1);
        }
        if (window.performance) {
            let now = (window.performance.now() / 1000).toFixed(3);
            console.log(now + ': ' + text);
        } else {
            console.log(text);
        }
    }

}

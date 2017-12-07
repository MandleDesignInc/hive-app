import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualConferenceComponent } from './virtual-conference.component';
import {VirtualConferenceRoutingModule} from './virtual-conference-routing.module';
import {MaterialModule} from '../material/material.module';
import { DataChannelComponent } from './data-channel/data-channel.component';
import {SocketIOService} from './socket-io.service';

@NgModule({
  imports: [
      CommonModule,
      MaterialModule,
      VirtualConferenceRoutingModule,

  ],
  declarations: [VirtualConferenceComponent, DataChannelComponent],
  providers: [SocketIOService]
})
export class VirtualConferenceModule { }

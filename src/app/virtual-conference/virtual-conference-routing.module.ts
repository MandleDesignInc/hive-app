import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {VirtualConferenceComponent} from './virtual-conference.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        {path: 'virtual-conference', component: VirtualConferenceComponent}
    ])
  ],
  exports: [RouterModule]
})
export class VirtualConferenceRoutingModule { }

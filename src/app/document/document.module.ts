import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import {DocumentRoutingModule} from './document-routing.module';
import {MaterialModule} from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DocumentRoutingModule
  ],
  declarations: [DocumentComponent]
})
export class DocumentModule { }

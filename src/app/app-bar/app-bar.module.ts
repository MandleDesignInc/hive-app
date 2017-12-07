import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from './app-bar.component';
import {MaterialModule} from '../material/material.module';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule
    ],
    declarations: [AppBarComponent],
    exports: [AppBarComponent]
})
export class AppBarModule { }

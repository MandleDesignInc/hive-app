import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class MaterialModule { }

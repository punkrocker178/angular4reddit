import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        TrumbowygComponent
    ],
    exports: [
        TrumbowygComponent
    ]
  })
  export class SharedComponentsModule { }
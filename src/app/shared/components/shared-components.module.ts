import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
    imports:[
        CommonModule,
        PipeModule
    ],
    declarations: [
        TrumbowygComponent
    ],
    exports: [
        TrumbowygComponent
    ]
  })
  export class SharedComponentsModule { }
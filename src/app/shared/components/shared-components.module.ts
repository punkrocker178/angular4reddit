import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
    imports:[
        CommonModule,
        PipeModule
    ],
    declarations: [
        TrumbowygComponent,
        ToggleButtonComponent
    ],
    exports: [
        TrumbowygComponent,
        ToggleButtonComponent
    ]
  })
  export class SharedComponentsModule { }
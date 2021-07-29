import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { ScrollToTopComponent } from './scroll-to-top-button/scroll-to-top.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
    imports:[
        CommonModule,
        PipeModule
    ],
    declarations: [
        TrumbowygComponent,
        ToggleButtonComponent,
        ScrollToTopComponent
    ],
    exports: [
        TrumbowygComponent,
        ToggleButtonComponent,
        ScrollToTopComponent
    ]
  })
  export class SharedComponentsModule { }
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { GalleryComponent } from './gallery/gallery.component';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
    imports:[
        CommonModule,
        PipeModule
    ],
    declarations: [
        TrumbowygComponent,
        GalleryComponent
    ],
    exports: [
        TrumbowygComponent,
        GalleryComponent
    ]
  })
  export class SharedComponentsModule { }
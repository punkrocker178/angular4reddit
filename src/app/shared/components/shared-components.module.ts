import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModalModule, NgbToastModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedDirectivesModule } from '../directives/directives.module';
import { ScrollToTopComponent } from './scroll-to-top-button/scroll-to-top.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { TrumbowygComponent } from './trumbowyg/trumbowyg.component';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbTypeaheadModule,
    SharedDirectivesModule
  ],
  declarations: [
    TrumbowygComponent,
    ToggleButtonComponent,
    ScrollToTopComponent
  ],
  exports: [
    TrumbowygComponent,
    ToggleButtonComponent,
    ScrollToTopComponent,

    InfiniteScrollModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbTypeaheadModule,
    SharedDirectivesModule
  ]
})
export class SharedModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        NgbModule
    ],
    declarations: [
        SearchBarComponent
    ],
    exports: [
        SearchBarComponent
    ]
  })
  export class SearchModule { }
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SubbredditItemComponent } from './components/search-page/components/subreddit/subbreddit-item.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        NgbModule,
        PipeModule
    ],
    declarations: [
        SearchBarComponent,
        SearchPageComponent,
        SubbredditItemComponent
    ],
    exports: [
        SearchBarComponent,
        SearchPageComponent
    ]
  })
  export class SearchModule { }
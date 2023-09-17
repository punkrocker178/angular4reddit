import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/components/shared-components.module';
import { SearchBarComponent } from '../search/components/search-bar/search-bar.component';
import { NavbarComponent } from './navbar.component';
import { PipeModule } from 'src/app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PipeModule,
    SearchBarComponent
  ],
  declarations: [
    NavbarComponent
  ],
  exports:[
    NavbarComponent
  ]
})
export class NavbarModule { }

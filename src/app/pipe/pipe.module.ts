import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/pipe/safe.pipe';

@NgModule({
    declarations: [
        SafePipe
    ],
    exports: [
        SafePipe
    ]
  })
  export class PipeModule { }
import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { DateTimePipe } from './date-time.pipe';

@NgModule({
    declarations: [
        SafePipe,
        DateTimePipe
    ],
    exports: [
        SafePipe,
        DateTimePipe
    ]
  })
  export class PipeModule { }
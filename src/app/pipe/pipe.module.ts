import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { DateTimePipe } from './date-time.pipe';
import { ReplacePipe } from './replace.pipe';

@NgModule({
    declarations: [
        SafePipe,
        DateTimePipe,
        ReplacePipe
    ],
    exports: [
        SafePipe,
        DateTimePipe,
        ReplacePipe
    ]
  })
  export class PipeModule { }
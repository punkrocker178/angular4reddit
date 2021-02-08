import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { DateTimePipe } from './date-time.pipe';
import { DomParserPipe } from './dom-parser.pipe';
import { ReplacePipe } from './replace.pipe';

@NgModule({
    declarations: [
        SafePipe,
        DateTimePipe,
        ReplacePipe,
        DomParserPipe
    ],
    exports: [
        SafePipe,
        DateTimePipe,
        ReplacePipe,
        DomParserPipe
    ]
  })
  export class PipeModule { }
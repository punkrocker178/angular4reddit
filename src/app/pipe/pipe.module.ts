import { NgModule } from '@angular/core';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { DateTimePipe } from './date-time.pipe';
import { DomParserPipe } from './dom-parser.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { ReplacePipe } from './replace.pipe';

@NgModule({
    declarations: [
        SafePipe,
        DateTimePipe,
        ReplacePipe,
        DomParserPipe,
        FormatNumberPipe
    ],
    exports: [
        SafePipe,
        DateTimePipe,
        ReplacePipe,
        DomParserPipe,
        FormatNumberPipe
    ]
  })
  export class PipeModule { }
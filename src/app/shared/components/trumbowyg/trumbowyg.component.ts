import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'trumbowyg-editor',
    templateUrl: './trumbowyg.component.html'
})
export class TrumbowygComponent {
    @Input() configs;

    @Input() editorId;

    @Output() triggerCommentButton = new EventEmitter();

    keyEventSubscribtion: Subscription;

    private disableCommentButton: boolean;

    @ViewChild('editor') editorInstance: ElementRef;
    @ViewChild('commentEditorInstance') commentEditorInstance: ElementRef;
    
    constructor(private trumbowygService: TrumbowygService) {

    }

    ngAfterViewInit() {
        const trumbowygEditor = this.configs && this.configs.isComment ? 
        TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR + '-' + this.editorId: TrumbowygConstants.TRUMBOWYG_EDITOR;
        
        this.trumbowygService.initEditor(trumbowygEditor, 
            {
                btns: [
                    ['formatting'],
                    ['strong', 'em'],
                    ['link'],
                    ['unorderedList', 'orderedList'],
                    ['horizontalRule'],
                    ['removeformat']
                ]
            });

        let keyup$;

        if (this.configs && this.configs.isComment) {
            keyup$ = fromEvent(this.commentEditorInstance.nativeElement, 'keyup');
        } else {
            keyup$ = fromEvent(this.editorInstance.nativeElement, 'keyup');
        }  

        this.keyEventSubscribtion = keyup$.pipe(tap((event:any) => {
            if ((event.keyCode > 47 && event.keyCode < 91) ||
             (event.keyCode > 95 && event.keyCode < 112) ||
             (event.keyCode > 185 && event.keyCode < 223)) {
                this.disableCommentButton = false;
            } else if (event.keyCode === 8 && event.target.firstChild && event.target.firstChild.innerHTML == '<br>') {
                this.disableCommentButton = true;
            };
        }),debounceTime(400)).subscribe(_ => {
            this.triggerCommentButton.emit(this.disableCommentButton);
        });

    }

    ngOnDestroy() {
        this.keyEventSubscribtion.unsubscribe();
    }
}
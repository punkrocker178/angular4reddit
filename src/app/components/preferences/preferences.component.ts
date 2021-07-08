import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Preferences } from 'src/app/model/preferences.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { PreferencesService } from 'src/app/services/preferences.service';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { UserService } from 'src/app/services/user.service';
@Component({
    selector: 'app-preferences',
    templateUrl: './preferences.component.html'
})

export class PreferencesComponent implements OnInit {

    constructor(private preferencesService: PreferencesService,
        private authenService: RedditAuthenticateService,
        private userService: UserService) { }
    destroy$: Subject<boolean> = new Subject();
    preferences: Preferences;
    showNSFW: boolean;
    updating: boolean;

    ngOnInit() {
        this.preferencesService.preference.pipe(
            takeUntil(this.destroy$),
            tap(next => {
                this.preferences = next;
            })
        ).subscribe();

        if (this.authenService.getIsLoggedIn()) {
            this.authenService.getUserInfo().pipe(takeUntil(this.destroy$), tap(
                (next: UserInterface) => this.showNSFW = next.over_18
            )).subscribe();
        } else {
            this.userService.user$.pipe(takeUntil(this.destroy$), tap((next: UserInterface) => {
                this.showNSFW = !!next.over_18;
            })).subscribe();
        }
        
    }

    updateTogglePreference(setting: string, value: boolean) {

        if (this.updating) {
            return;
        }

        this.updating = true;
        this.preferencesService.setPreference(setting, value);

        if (setting === 'nsfw') {
            this.userService.updateNSFW(value).subscribe(_ => this.updating = false);
        } else {
            this.updating = false;
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
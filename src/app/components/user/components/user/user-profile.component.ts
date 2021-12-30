import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/class/Utils';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'user-profile',
    templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {

    about$: Observable<Object>;
    comments$: Observable<Object>;
    overview$: Observable<Object>;

    userProfile = {};
    username;
    listingsType = 'user-profile';

    constructor(private activatedRoute: ActivatedRoute,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.activatedRoute.paramMap.pipe(
            tap(params => {
                const user = params.get('user');
                this.username = user;
                this.comments$ = this.userService.getUserComments(user).pipe(
                    tap(next => this.userProfile['comments'] = next['data']));

                this.overview$ = this.userService.getUserOverview(user).pipe(
                    tap(next => this.userProfile['overview'] = next['data']));

                this.about$ = this.userService.getUserAbout(user).pipe(
                    tap(next => {
                        this.userProfile['about'] = next['data'];
                        this.clearIcon();
                    }));
            })
        ).subscribe();

    }

    clearIcon() {
        this.userProfile['about'].icon_img = Utils.clearUrl(this.userProfile['about'].icon_img);
    }

}

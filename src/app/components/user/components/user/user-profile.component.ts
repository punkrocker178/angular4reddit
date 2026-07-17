import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/class/Utils';
import { UserInterface } from 'src/app/model/user.interface';

interface UserAboutResponse {
    kind?: string;
    data: UserInterface;
}

interface UserListingResponse {
    kind?: string;
    data: unknown;
}

interface UserProfileState {
    about?: UserInterface;
    comments?: unknown;
    overview?: unknown;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'user-profile',
    templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {

    about$: Observable<UserAboutResponse>;
    comments$: Observable<UserListingResponse>;
    overview$: Observable<UserListingResponse>;

    userProfile: UserProfileState = {};
    username: string;
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
                    tap((next: UserListingResponse) => this.userProfile.comments = next.data)) as Observable<UserListingResponse>;

                this.overview$ = this.userService.getUserOverview(user).pipe(
                    tap((next: UserListingResponse) => this.userProfile.overview = next.data)) as Observable<UserListingResponse>;

                this.about$ = this.userService.getUserAbout(user).pipe(
                    tap((next: UserAboutResponse) => {
                        this.userProfile.about = next.data;
                        this.clearIcon();
                    })) as Observable<UserAboutResponse>;
            })
        ).subscribe();

    }

    clearIcon() {
        if (this.userProfile.about?.icon_img) {
            this.userProfile.about.icon_img = Utils.clearUrl(this.userProfile.about.icon_img);
        }
    }

}

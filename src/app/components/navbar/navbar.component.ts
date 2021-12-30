import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/model/user.interface';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.html'
})

export class NavbarComponent implements OnInit, OnDestroy {

    constructor(private authenService: RedditAuthenticateService,
        private userService: UserService,
        private checkDeviceFeatureService: CheckDeviceFeatureService,
        private router: Router,
        private renderer2: Renderer2,
        private themeService: ThemeService,
        private preferenceService: PreferencesService) { }

    menuToggle = false;
    user: UserInterface;
    userSubscribtion: Observable<UserInterface>;
    destroy$ = new Subject<void>();
    mainElement;

    profilePath: string;
    aboutPath = '/about';
    preferencePath = '/prefs';
    themeToggleState: boolean = false;

    ngOnInit() {
        this.mainElement = document.getElementById('main');
        this.router.events.pipe(
            takeUntil(this.destroy$),
            filter(event => event instanceof NavigationStart),
            tap(_ => {
                this.collapseMenu();
            })
        ).subscribe();

        this.userSubscribtion = this.userService.user$.pipe(
            takeUntil(this.destroy$),
            tap(next => {
                this.user = next;
                this.profilePath = `/u/${this.user.name}`;
            })
        );

        if (this.preferenceService.preferenceValue.theme === 'light') {
            this.themeToggleState = true;
        }
    }

    login() {
        this.authenService.login();
    }

    logout() {
        this.authenService.logout().pipe(take(1),
        switchMap(_ => this.authenService.revokeToken()),
        tap(_ => {
            this.userService.setUser({
                name: 'redditor',
                icon_img: '/assets/images/snoo-profile.png',
                is_login: false
            });
        })).subscribe();
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }

    toggleMenu() {
        this.menuToggle = !this.menuToggle;

        if (this.menuToggle) {
            setTimeout(() => {
                this.renderer2.setStyle(this.mainElement, 'filter', 'brightness(0.3)');
            }, 300);
            this.renderer2.setStyle(document.body, 'overflow', 'hidden');
        } else {
            this.renderer2.removeStyle(document.body, 'overflow');
            this.renderer2.removeStyle(this.mainElement, 'filter');
        }
    }

    goToComponent(componentPath: string) {
        this.collapseMenu();
        this.router.navigateByUrl(componentPath);
    }

    goToProfile() {
        this.collapseMenu();

        this.router.navigateByUrl(`/u/${this.user.name}`);
    }

    goToPreferences() {
        this.collapseMenu();
        this.router.navigateByUrl('prefs');
    }

    openHelpPage() {
        window.open('https://www.reddithelp.com/hc/en-us', '_blank');
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    collapseMenu() {
        if (this.menuToggle) {
            this.menuToggle = false;
            this.renderer2.removeStyle(document.body, 'overflow');
            this.renderer2.removeStyle(this.mainElement, 'filter');
        }
    }

    themeToggle(value) {
        const theme = value ? 'light' : 'dark';
        this.themeToggleState = value;
        this.themeService.changeTheme(theme);
    }
}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/model/user.interface';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html'
})

export class NavbarComponent implements OnInit {

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
    destroy$ = new Subject();
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
            take(2),
            tap(next => {
                this.user = next;
                this.profilePath = `/u/${this.user.name}`;
            })
        );

        if (this.preferenceService.preferenceValue.theme === 'light') {
            this.themeToggleState = true;
        }  
    }

    isLoggedIn() {
        return this.authenService.getIsLoggedIn();
    }

    login() {
        this.authenService.login();
    }

    logout() {
        this.authenService.revokeToken().subscribe(
            res => {
                if (res.ok && res.status === 200) {
                    this.userService.setUser({
                        name: 'anonymous'
                    });
                    this.authenService.logout();
                }
            }
        );
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
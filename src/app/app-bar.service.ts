import { Injectable } from '@angular/core';

export class NavItem {

    constructor(public routerLink: string, public title: string) { }
}

@Injectable()
export class AppBarService {

    isInit: boolean = false;

    publicMenu: NavItem[];
    authenticatedMenu: NavItem[];

    isAuthenticated: boolean = false;


    // virtual conference contextual options
    showToggle: boolean = false;
    isPresenter: boolean = false;

    constructor() { }

    init(): void {

        this.publicMenu = [];
        this.publicMenu.push(new NavItem('/login', 'Login'));
        this.publicMenu.push(new NavItem('/register', 'Register'));
        this.publicMenu.push(new NavItem('/contact', 'Contact'));


        this.authenticatedMenu = [];
        this.authenticatedMenu.push(new NavItem('/my-profile', 'My Profile'));
        this.authenticatedMenu.push(new NavItem('/search', 'Search'));
        this.authenticatedMenu.push(new NavItem('/forum', 'Forum'));
        this.authenticatedMenu.push(new NavItem('/virtual-conference', 'Virtual Conference'));
        this.authenticatedMenu.push(new NavItem('/contact', 'Contact'));


        this.isInit = true;
    }

    getNav(authenticated: boolean): NavItem[] {

        if (authenticated) return this.authenticatedMenu;

        return this.publicMenu;

    }

    // for virtual conference component
    get toggleText(): string {

        return (this.isPresenter) ? 'CURRENT MODE: PRESENTER' : 'CURRENT MODE: ATTENDEE';
        // return (this.isPresenter) ? 'CURRENT MODE: PRESENTER' : 'CURRENT MODE: fairy+unicorns';

    }

    toggleMode(): void {
        this.isPresenter = !this.isPresenter;
    }

}

import {Component, OnInit} from '@angular/core';
import {AppBarService, NavItem} from './app-bar.service';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private appBarSvc: AppBarService) {

  }

  ngOnInit(): void {

    this.appBarSvc.init();

  }

  get navMenu(): NavItem[] {

    return this.appBarSvc.getNav(this.isAuthenticated);
  }

  get isAuthenticated(): boolean { return this.authService.isAuthenticated; }


}

import {Component, Input, OnInit} from '@angular/core';
import {AppBarService, NavItem} from '../app-bar.service';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {

  @Input() navMenu: NavItem[];

  constructor(private appBarSvc: AppBarService) { }

  ngOnInit() {}

}

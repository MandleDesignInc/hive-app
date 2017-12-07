import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchBtnState: boolean = false;

  constructor() { }

  ngOnInit() { }

  onSearch(): void {

  }

    toggleButtonState(): void {
        this.searchBtnState = this.searchBtnState !== true;
    }

}

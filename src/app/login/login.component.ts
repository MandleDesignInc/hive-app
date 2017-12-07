import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    buttonState: boolean[] = [];

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() { }

    toggleButtonState(index: number): void {
        this.buttonState[index] = this.buttonState[index] !== true;
    }

    login(): void {

        this.authService.isAuthenticated = true;
        this.router.navigate(['/home']);

    }

    register(): void {

    }

}

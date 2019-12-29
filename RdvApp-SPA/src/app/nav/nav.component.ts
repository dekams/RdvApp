import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  photoUrl = '';
  model: any = {};

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) { }

  ngOnInit() {
    this.authService.photoSubject.subscribe(url => this.photoUrl = url);
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged In Successfully');
        this.router.navigate(['/members']);
      },
      error => this.alertify.error(error)
    );
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  uniqueName() {
    return this.authService.uniqueName;
  }

  logout() {
    this.model.username = '';
    this.model.password = '';

    this.authService.logout();
    this.router.navigate(['/home']);
    this.alertify.message('logged out');
  }

}

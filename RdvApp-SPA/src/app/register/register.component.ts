import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  model: any = {};

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) { }

  register() {
    this.authService.register(this.model)
      .subscribe(
        _ => this.alertify.success('Succefully Registered'),
        error => this.alertify.error(error));
  }

  cancel(registerForm: NgForm) {
    registerForm.form.reset();
    this.router.navigate(['/home']);
  }

}

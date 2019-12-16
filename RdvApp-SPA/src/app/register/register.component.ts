import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  model: any = {};

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.model)
      .subscribe(
        _ => console.log('Succefully Registered'),
        error => console.log('Registration Error', error));
  }

  cancel(registerForm: NgForm) {
    registerForm.form.reset();
    this.router.navigate(['/home']);
  }

}

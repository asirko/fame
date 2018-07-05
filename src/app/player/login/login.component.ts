import { LoginService } from './../../login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'fame-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: '',
      sessionGame: ''
    });
  }

  login(): void {
    this.loginService.addPlayer(this.loginForm.value.name).subscribe(isAvailable => {
      this.router.navigate(['']);
    });
  }
}

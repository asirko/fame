import { PlayerService } from '../player.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

const STORAGE_LOGIN = 'jumpGame';

@Component({
  selector: 'fame-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginSubscription: Subscription;
  isLoginUsed = false;

  constructor(private formBuilder: FormBuilder, private loginService: PlayerService, private router: Router) { }

  ngOnInit() {
    const login = localStorage.getItem(STORAGE_LOGIN);
    this.loginForm = this.formBuilder.group({
      name: [login, Validators.required]
    });
  }

  login(): void {
    if (!this.loginForm.valid || (this.loginSubscription && !this.loginSubscription.closed)) {
      // form invalid or the request is already running
      return;
    }

    this.loginSubscription = this.loginService.addPlayer(this.loginForm.value.name).subscribe(isAvailable => {
      this.isLoginUsed = !isAvailable;
      if (isAvailable) {
        localStorage.setItem(STORAGE_LOGIN, this.loginForm.value.name);
        this.router.navigate(['waitingroom']);
      }
    });
  }
}

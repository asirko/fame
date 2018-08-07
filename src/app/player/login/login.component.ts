import {PlayerService} from '../player.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

const STORAGE_LOGIN = 'jumpGame';

@Component({
  selector: 'fame-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoginUsed = false;

  constructor(private formBuilder: FormBuilder, private loginService: PlayerService, private router: Router) { }

  ngOnInit() {
    const login = localStorage.getItem(STORAGE_LOGIN);
    this.loginForm = this.formBuilder.group({
      name: login
    });
  }

  login(): void {
    this.loginService.addPlayer(this.loginForm.value.name).subscribe(isAvailable => {
      this.isLoginUsed = !isAvailable;
      if (isAvailable) {
        localStorage.setItem(STORAGE_LOGIN, this.loginForm.value.name);
        this.router.navigate(['waitingroom']);
      }
    });
  }
}

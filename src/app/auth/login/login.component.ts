import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MaterialModule } from '@angular/material';
import { StoreService } from '../../services/store.service';
import { API } from '../../http/http.service';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['../../main.scss'],
  providers: [StoreService, API]
})
export class LoginComponent implements OnInit {
  // define your variables used in template html
  loginForm: FormGroup;
  urlMsg: Boolean = false;
  email:String = "";
  isAuthError: Boolean = false;
  pageMsg: String = '';
  elemTop: number = 150;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private httpService: API
  ) {
        localStorage.clear();
  }
  // getStore() {
  //   console.log(this.storeService.getStore('email'))
  // }
  onReset() {
    this.router.navigate(['reset-password']);
  }
  onRegister() {
    this.router.navigate(['registration']);
    //this.router.navigate(['/']);
    //window.open("https://neomegha.com/registration.html");
  }
  onLogin() {
    let self = this;
    self.urlMsg = true;
    self.httpService.fetchData('post', 'prelogin/v1/login', function (data) {
      var data = data.json();
      if (data) {
        self.storeService.setStore('currentuser', { user: data.user });
       // Cookie.set('token', data.token);
       localStorage.setItem('token',data.token)
       console.log('token: ',data.token);

        if (data.projectExists) {
          self.router.navigate(['project-landing']);
        } else {
          self.router.navigate(['create-project']);
        }
        //Store Email in the Shared Object
      } else {
        self.router.navigate(['login'], { queryParams: { msg: "You have already registered. Please login" } });
      }
      self.loginForm.reset();
    }, function (err) {
      console.log(err);
      self.isAuthError = true;
      self.loginForm.reset();
    }, self.loginForm.value)

  }

  ngOnInit() {
    var self = this;
    self.isAuthError = false;
    self.urlMsg = false;
    self.activatedRoute.queryParams.subscribe(
      (param: any) => {
        //Getting value from url
        self.pageMsg = param['msg'];

        setTimeout(() => {
          self.email = param['email']
        })
      });
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    })
    setTimeout(() => {
      const authWrap = document.getElementsByClassName('auth-wrap')[0]
      const fullHeight = window.innerHeight / 2
      const elemTop = fullHeight - authWrap.clientHeight / 2;
      self.elemTop = elemTop;
    })

  }
}

import { Component, OnInit } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API } from '../../http/http.service';
import { ValidationService } from '../../services/validator.service'
import { StoreService } from '../../services/store.service';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './setup_password.component.html',
  styleUrls: ['../../main.scss'],
  providers: [StoreService, API, ValidationService]
})
export class SetupPasswordComponent implements OnInit {
  elemTop: number = 150;
  termTop: number = 150;
  password: string;
  termCondition: boolean = false;
  setupPassword: FormGroup;
  passwordError: string = "Password can't be blank";
  constructor(private _formBuilder: FormBuilder,
    private httpService: API,
    private storeService: StoreService,
    private router: Router,
    private validateService: ValidationService,
    private activatedRoute: ActivatedRoute) {
  }
  onTermsClick() {
    this.termCondition =!this.termCondition
  }
  onKeyup() {
    var regexWhole = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,20}$/;

    if (this.setupPassword.value.password.length > 8 && this.setupPassword.value.password.length < 20) {
      if (!regexWhole.test(this.setupPassword.value.password)) {
        this.passwordError = "Password should contain atleast one small,caps,special character and digit"
      }
      else
        this.passwordError = ""
    }
    else
      this.passwordError = "Password length should be 8 to 20"
  }
  onBack() { }
  onSubmit = () => {
    let self = this;
    let passwd = self.setupPassword.value;
    let storeData = this.storeService.getStore("newUserReg")
    console.log(passwd);
    let url = "prelogin/v1/setPassword/" + storeData.userId;
    let payload = { "password": passwd.confirmPassword, "code": storeData.vCode }
    self.httpService.fetchData('post', url, function (data) {
      data = data.json()
      if (data && data.success && data.token) {
        //Cookie.set('token', data.token);
        localStorage.setItem('token',data.token)
        self.router.navigate(['create-project']);
      }
    }, function (err) {
      err = err.json()
      console.log(err)
    }, payload)

  }
  ngOnInit() {
    var self = this;
    let userID = null
    let vCode = null
    let storeData = this.storeService.getStore("newUserReg")
    
    if (storeData && storeData.userId) {
      userID = storeData.userId
    }
    if (storeData && storeData.vCode) {
      vCode = storeData.vCode
    }
    let currentPath = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        if (param['uid'] && param['uid'].length > 5)
          userID = param['uid']
          console.log("UserId",userID)
        if (param['code'] && param['code'].length == 6)
          vCode = param['code']
        this.storeService.setStore('newUserReg', { vCode: vCode,userId: userID })
      // this.storeService.setStore('newUserReg', { userId: userID })
       
      });
    storeData = this.storeService.getStore("newUserReg")
    console.log("Store Data",storeData)
    if (!storeData || !storeData.userId || !storeData.vCode) {
      this.router.navigate(['login']);
     }
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    this.setupPassword = this._formBuilder.group({
      password: ['', [Validators.required, self.validateService.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      terms: ['', [Validators.required]]
    })
    setTimeout(() => {
      const authWrap = document.getElementsByClassName('auth-wrap')[0];
      //const termWrap = document.getElementsByClassName('terms-wrap')[0];
      const fullHeight = window.innerHeight / 2
      const elemTop = fullHeight - authWrap.clientHeight / 2;
      self.elemTop = elemTop;

    })
  }
}



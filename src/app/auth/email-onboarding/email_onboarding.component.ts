import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './email-onboarding.component.html',
  styleUrls: ['../../main.scss'],
  providers: [StoreService, API]
})
export class EmailVerificationComponent implements OnInit {



  form: FormGroup;
  uiMsg: String = '';
  resendLink: Boolean = false;
  msg: Array<String> = [];
  disableVerify: Boolean = false;
  elemTop: number = 150;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private httpService: API,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute) {
    const msg = ["Invalid verification code. Retry", "Invalid verification code, Please click on 'RESEND VERIFICATION CODE' to get new verification code.", "Verification code has been resent", "Trouble registering? Kindly contact us on <Phone number>, we will be happy to help!", "Some Error occurred, retry after sometime"]
    this.msg = msg;
    //Cookie.deleteAll();
    localStorage.clear();
  }
  onSubmit() {
    let verification = this.form.value.one + "" + this.form.value.two + "" + this.form.value.three + "" + this.form.value.four + "" + this.form.value.five + "" + this.form.value.six;
    let self = this;
    self.uiMsg = ''
    let userId = this.storeService.getStore("newUserReg").userId
    let url = "prelogin/v1/verify/" + verification + "/" + userId + "/false"
    self.httpService.fetchData('get', url, function (data) {
      data = data.json()
      if (data && data.success) {
        self.storeService.setStore('newUserReg', { userId: userId,vCode: verification });
        self.router.navigate(['setup-password']);
      }
    }, function (err) {
      err = err.json()
      console.log(err)
      self.form.reset();
      self.uiMsg = err.message || self.msg[0];
      if (err.count > 0 && err.count < 9) {
        self.uiMsg = self.msg[0];
        self.resendLink = false;
        //self.disableVerify = true
      } else if (err.count >= 9) {
        self.uiMsg = self.msg[3];
        self.resendLink = true;

      }
    }, {})
    //on button click call the API
    //Show errors , navigate to set password password page and store token in store
    //this.router.navigate(['setup-password']);
  }
  keyValue(e) {
   let self = e.currentTarget;
    if (e.keyCode == 8 && self.previousElementSibling != null) {
       self.previousElementSibling.getElementsByTagName('input')[0].focus();
    }
  }
  onResendCodeClick() {
    console.log("onResendCodeClick");
    let self = this
    let userId = this.storeService.getStore("newUserReg").userId
    let url = "prelogin/v1/resendCode/" + userId
    self.httpService.fetchData('get', url, function (data) {
      data = data.json()
      if (data && data.success) {
        self.disableVerify = false;
        self.uiMsg = self.msg[2];
      }
    }, function (err) {
      err = err.json()
      console.log(err)
      self.uiMsg = err.message || self.msg[4];
    }, {})
    self.form.reset();


  }
  ngOnInit() {
    let inputFields = document.getElementsByClassName("inputs");
    for (let i = 0; i < inputFields.length; i++) {
      inputFields[i].addEventListener("keyup", function (e) {
        this.getElementsByTagName('input')[0].value = this.getElementsByTagName('input')[0].value.trim()
        if (this.getElementsByTagName('input')[0].value.trim().length >= 1 && this.nextElementSibling.getElementsByTagName('input')[0] !== undefined) {
          this.nextElementSibling.getElementsByTagName('input')[0].focus();
        }
      });
    }
    var self = this;
    //Check if UserID is present in Store or Present in Query Params
    //IF not present throw user back to homepage    
    let userID = null
    let storeData = this.storeService.getStore("newUserReg")
    if (storeData && storeData.userId) {
      userID = storeData.userId
    }
    let currentPath = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        if (param['uid'] && param['uid'].length > 5)
          userID = param['uid']
        this.storeService.setStore('newUserReg', { userId: userID })
      });
    console.log("Email Onboarding UserID", userID);
    if (!userID) {
      this.router.navigate(['']);
      console.log("Redirecting user ... , Reason :No UserID associated with the Code Verification Page")
    }

    var numberRegex = /^(([0-9]))$/;
    this.form = this._formBuilder.group({
      one: ['', [Validators.required, Validators.pattern(numberRegex)]],
      two: ['', [Validators.required, Validators.pattern(numberRegex)]],
      three: ['', [Validators.required, Validators.pattern(numberRegex)]],
      four: ['', [Validators.required, Validators.pattern(numberRegex)]],
      five: ['', [Validators.required, Validators.pattern(numberRegex)]],
      six: ['', [Validators.required, Validators.pattern(numberRegex)]]
    })

    setTimeout(function () {
      var elem = document.getElementById('auth-code').getElementsByTagName('input')
      var inputs = document.getElementsByTagName('input')
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() == 'number') {
          inputs[i].style.webkitAppearance = 'none'
        }
      }
      for (var i = 0; i < elem.length; i++) {
        var element = document.getElementById('auth-code').getElementsByTagName('input')[i]
        element.style.textAlign = "center";
      }
      const authWrap = document.getElementsByClassName('auth-wrap')[0]
      const fullHeight = window.innerHeight / 2
      const elemTop = fullHeight - authWrap.clientHeight / 2;
      self.elemTop = elemTop;

    }, 1)

  }
}

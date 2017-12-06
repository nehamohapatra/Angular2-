import { Component, OnInit, Input } from '@angular/core';
import { API } from '../../http/http.service';
import { Router } from '@angular/router';
import { MaterialModule } from '@angular/material';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['../../main.scss']
})
export class SideMenuComponent implements OnInit {
  classValue: String;
  scmArray: Array<any> = [];
  bsLink: String = '';
  ftRepo: Boolean = true;
  selectIndex: Number;
  cloudIndex:Number;
  @Input()

  flag: String = 'six'
  constructor(private router: Router, private httpService: API) { }
  checkFlag(flag) {
    return this.flag == flag ? "act-sidemenu" : "";
  }
  navigation(route, flag) {
    console.log(route,flag);
    this.router.navigate([route]);
  }
  // onCode() {
  //   let self = this;
  //   self.httpService.fetchData('get', 'v1/SCMAccounts/get', function (data) {
  //     data = data.json();
  //     console.log("SCM Array on code", data.data);
  //     self.scmArray = data.data;
  //     if (self.scmArray.length == 0) {
  //       self.ftRepo = false;
  //       self.selectIndex = 2;
  //     }
  //     else {
  //       self.selectIndex = 0;
  //     }
  //   }, function (err) {
  //     console.log("Error Getting SCM Details", err);
  //   }, {});
  // }
  // onCloud() {
  //   let self = this;
  //   self.cloudIndex = 2;
  // }
  ngOnInit() {

  }

}

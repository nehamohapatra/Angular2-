import { Component, OnInit, NgZone, ViewChild, Renderer, Output, EventEmitter, trigger, transition, style, animate, state } from '@angular/core';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

@Component({
  templateUrl: './repToolchain.html',
  styleUrls: ['../../main.scss'],
  selector: 'rep-Toolchain',
  providers: [API, StoreService],
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
          ':enter', [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('500ms')
          ]
        ),
        transition(
          ':leave', [
            animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
          ]
        )
      ]
    )
  ]


})

export class RepToolchain implements OnInit {
  ngOnInit() {

  }
  Status = "Deploying...";
  activeJenkins: Boolean = false;
  activeJenkins1: Boolean = false;
  activeJenkins2: Boolean = false;
  addDetail1: Boolean = false;
  addDetail2: Boolean = false;
  enviroment = [
    { value: 'AWS', viewValue: 'AWS' },
    { value: 'Azure', viewValue: 'Azure' }
  ];
  show: boolean = true;

  toolchainDetail: Array<any> = [];

  selectedIndex: number = 0;
  toolchainselected = false;
  oneSubTab : Boolean = true;
  constructor(private router: Router, private httpService: API, private storeService: StoreService,public zone: NgZone) {
    
    this.httpService.fetchData('get', 'v1/cluster/services/getToolkits', (data) => {
        data = data.json();
        if (data.data.length > 0) {

          let toolkitChainDet = data.data;
          let a = toolkitChainDet.map(a => a);
          let Ip = a[0].ip;
          let Password = a[0].jenkinsPwd;
          let Username = a[0].jenkinsUser;
          let Port = a[0].port;

          this.toolchainDetail.push({
            "Status": this.Status,
            "Ip": Ip, "Port": Port, "Username": Username, "Cloud": "AWS",
            "Password": Password, "Plugins": "Junit(5.2)\nVersCode(3.2)\nSelenium(2.8)"
          });

          this.selectedIndex = 1;
          this.toolchainselected = true;
          this.oneSubTab = false;
        }
      },
      (err) => {
        console.log("Error Not able to find Toolkit deployed", err);
      }, {})
  }



  onJenkinsClick1() {
    this.activeJenkins = true;
    this.activeJenkins1 = true;
    this.addDetail1 = true;
    this.activeJenkins2 = false;
    this.addDetail2 = false;

  }

  onJenkinsClick2() {
    this.activeJenkins = true;
    this.activeJenkins2 = true;
    this.addDetail2 = true;
    this.activeJenkins1 = false;
    this.addDetail1 = false;
  }


  clickMe() {
 
    setTimeout(() => this.zone.run(() => this.Status = "Initializing..."), 60000);

    setTimeout(() => this.zone.run(() => this.Status = "Running..."), 120000);



    let self = this;
    let payload = { toolkit: "toolkit1" }
    this.httpService.fetchData('post', 'v1/cluster/services/launchToolkit', function (data) {
      data = data.json();
      if (data) {
        console.log("Deploy Toolkit Success", payload);

        self.httpService.fetchData('get', 'v1/cluster/services/getToolkits', (data) => {
            data = data.json();
            if (data.data.length > 0) {

              let toolkitChainDet = data.data;
              let a = toolkitChainDet.map(a => a);
              let Ip = a[0].ip;
              let Password = a[0].jenkinsPwd;
              let Username = a[0].jenkinsUser;
              let Port = a[0].port;

              self.toolchainDetail.push({
                "Status": self.Status,
                "Ip": Ip, "Port": Port, "Username": Username, "Cloud": "AWS",
                "Password": Password, "Plugins": "Junit(5.2)\nVersCode(3.2)\nSelenium(2.8)"
              });

              self.selectedIndex = 1;
              self.toolchainselected = true;
               self.oneSubTab = false;
            }
          },
          (err) => {
            console.log("Error Not able to find Toolkit deployed", err);
          }, {})
      }

    }, function (err) {
      console.log("Deploy Toolkit Error ", err);

    }, payload);

  }
  selectedIndexChange($event) {
    this.selectedIndex = $event;
  }

  toolkitdetail() {
    this.show = this.show ? false : true;
  }

  
}


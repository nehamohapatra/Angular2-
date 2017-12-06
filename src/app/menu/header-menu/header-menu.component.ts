import { Component, OnInit, EventEmitter, Output, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { scmConnect } from '../../common/repository';
import * as fireApp from 'firebase';
import { SideMenuComponent } from '../../menu/side-menu/side-menu.component'

@Component({
    selector: 'header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService],
    host: {
    '(document:click)': 'onClick($event)',
  }
})
export class HeaderMenuComponent implements OnInit {
    @Output() changeProject: EventEmitter<any> = new EventEmitter<true>();
    @Output() selectProject: EventEmitter<any> = new EventEmitter<true>();

    projectList: boolean = true;
    projectArray: Array<any> = [];
    selectedProject: String;
    
    name:string;
    data = []; // refer plunker
    content:any[]=new Array();
    counter:number;
    azureAccountId: string;

    public elementRef;

    constructor(private router: Router,
        private storeService: StoreService,
        private activatedRoute: ActivatedRoute,
        private httpService: API, private _eref: ElementRef) {
        this.counter=0;
        let self = this;
        //Initiate Firebase Connection
        fireApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                fireApp.database().ref('/notifications/' + user.uid).on('value', data => {
                    if (data.val()) {
                        self.notificationCount = data.val().notification.length
                        console.log("You have notifications ", data.val());
                        self.notificationslist = data.val().notification;
                    }
                });
            } else {
                self.httpService.fetchData('get', 'v1/notification/auth', function (data) {
                    data = data.json()
                    console.log("FB Auth Data", data.FBToken);
                    try {
                        fireApp.auth().signInWithCustomToken(data.FBToken).then(function (signeduser) {
                            console.log("signeduser", signeduser)
                            fireApp.database().ref('/notifications/' + signeduser.uid).on('value', data => {
                                if (data.val()) {
                                    self.notificationCount = data.val().length
                                    console.log("You have notifications ", data.val())
                                    self.notificationslist = data.val().notification;
                                }
                            });
                        }).catch(function (err) {
                            console.log(err);
                            throw err;
                        });
                    }
                    catch (e) {
                        console.log((<Error>e).message);//conversion to Error type
                    }
                }, {});
            }
        });
    }
    profSet: Boolean = false;
    notifSet: Boolean = false;
    hideloadmore: Boolean = false;
    notificationCount: Number = 0;
    notificationslist: [any];
// getdata function for load more content in notification card
    getData(){

        if(this.oldNotif.length <= 6){
            this.hideloadmore = true;
        }
        for(let i=this.counter+1;i<this.oldNotif.length;i++)
        {
            if( this.oldNotif.length-1<=this.content.length ){
                 this.hideloadmore = true;
            }
            this.content.push(this.oldNotif[i]);
        if(i%6==0) break;
        }
        this.counter+=6;
    }

    onProfSet() {
        this.profSet = !this.profSet;
    }
    onNotifClick() {
        this.notifSet = !this.notifSet;
    }
     onClick(event) {
        if(!this._eref.nativeElement.contains(event.target)){ // or some similar check
            this.notifSet = false;
        }
    }
    logout() {
        localStorage.clear();
        this.storeService.clearStore();
        this.router.navigate(['/']);
    }

    createProject() {
        this.router.navigate(['/create-project'])
    }

    getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    //Todo   --- Need to find the angular 2 way
    insertParam(param, value) {
        var currentURL = window.location.href + '&';
        var change = new RegExp('(' + param + ')=(.*)&', 'g');
        var newURL = currentURL.replace(change, '$1=' + value + '&');

        if (this.getURLParameter(param) !== null) {
            try {
                window.history.replaceState('', '', newURL.slice(0, - 1));
            } catch (e) {
                console.log(e);
            }
        } else {
            var currURL = window.location.href;
            if (currURL.indexOf("?") !== -1) {
                window.history.replaceState('', '', currentURL.slice(0, - 1) + '&' + param + '=' + value);
            } else {
                window.history.replaceState('', '', currentURL.slice(0, - 1) + '?' + param + '=' + value);
            }
        }
    }

    //changed project EventEmitter


    changedProject(value) {
        var self = this;
        localStorage.setItem('pId', value);
        this.selectedProject = value
        this.storeService.setStore('project', { id: value })
        scmConnect(self, true);
        self.storeService.setStore('cloudData', { cloud: [] })
        // self.insertParam('pId', self.selectedProject)
        this.changeProject.emit()
        //var elem = document.getElementsByClassName('update-data')
        var elem = <HTMLElement>document.getElementsByClassName('update-data')[0]
        if (elem != undefined) {
            console.log(elem);
            elem.click();
        }

        this.httpService.fetchData('get', 'v1/project/getProject/' + this.selectedProject, function (data) {
            let res = data.json();
            //Cookie.set('projectId',res.data._id)

        },
            function (err) {
                console.log(err)
            })

    }
    
    callManageProfile(){
        this.router.navigate(['/group']);
    }

    getProjects() {
        var self = this;
        var projectId = localStorage.getItem('pId');
        var token = localStorage.getItem('token');

        //Get the value from
        var projectObj = self.storeService.getStore('project');

        //Check the value is not undefined
        if (projectObj) {
            if (projectObj.id) {
                self.selectedProject = projectObj.id;
                self.projectArray = projectObj.projectList;
                self.projectArray.length == 0 ? self.projectList = true : self.projectList = false;
            }
            // self.insertParam('pId',self.selectedProject)
        }

        //Make a API call if no value in store
        else {

            self.httpService.fetchData('get', 'v1/project/get', function (data) {
                var res = data.json();
                const projectArray = res.data;
                console.log(projectArray)
                var pId = null;

                if (projectArray.length != 0) {
                    var pId = projectArray[projectArray.length - 1]._id;
                }

                //save the value in store that you want
                self.storeService.setStore('project', { projectList: projectArray })

                self.projectArray = projectArray
                self.projectArray.length == 0 ? self.projectList = true : self.projectList = false;

                if (projectId) {
                    self.storeService.setStore('project', { id: projectId })
                    self.selectedProject = projectId

                }
                else {
                    localStorage.setItem('pId', pId)
                    self.storeService.setStore('project', { id: pId })
                    self.selectedProject = pId;
                    self.getAzureAccountIdOnLogIn();
                }
                // self.insertParam('pId',self.selectedProject)
                self.selectProject.emit()
            }, function (err) {
                console.log(err)
            })
            // self.storeService.setStore('project', { id: null })
        }

    }

    getAzureAccountIdOnLogIn() {
        let self = this;
        let url = "v1/azure/getAccounts";
        self.httpService.fetchData('get', url, function (response) {
          response = response.json();
          self.azureAccountId = response.data[0]["_id"];
          if (self.azureAccountId) {
            localStorage.setItem('azureAccountId', self.azureAccountId);
          }
          else {
            localStorage.setItem('azureAccountId', 'null');
          }
    
        }, function (err) {
          err = err.json()
          console.log("Error in getting azure account", err);
        }, );
      }
    

    //Notification
    newNotif = [
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '2 mins',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '1 hrs',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '1 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ];
    oldNotif = [
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '1 mins',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '2 mins',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '3 hrs',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '4 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '5 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '6 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '7 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '8 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '9 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '10 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '11 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            notif_id: 'Lorem Ipsum',
            notif_time: '12 day',
            notif_detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    imgnotifClick(impIndex) {
        console.log(impIndex);
        this.notifSet = false;
    }
    notifClick(norIndex) {
        console.log(norIndex);
        this.notifSet = false;
    }
    
    ngOnInit() {

        this.getProjects()
        this.getData();

    }

}

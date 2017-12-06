import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { scmConnect } from '../common/repository';
import { API } from '../http/http.service';
import { MdDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppAccountDialogComponent } from './app-accountDialog.component';
import { MdDialogRef } from '@angular/material';

// import {ExtraValidators} from '../../services/extravalidator.service';

//Componet dependencies
@Component({
    selector: 'apps-account',
    templateUrl: './apps-account.html',
    styleUrls: ['../main.scss']
})

//Component logic container class

export class AppSideComponent implements AfterViewInit {
    microserviceForm: FormGroup;
    mtUser: Boolean = false;
    ftUser: Boolean = false;
    tableShow: Boolean = true;
    listData: Boolean = true;
    @ViewChild('tabGroup') tabGroup;
    vmData: any;
    reservationsData: any;
    enviromentOptions: any;
    iconsList: any;
    formName: any;
    formEnv: any;
    booleanObj: any = {
    }
    notes: any;
    cloudIndex: number = 0;
    flag: String = 'four';
    resWidth: Number = window.innerWidth - 75;
    resHeight: Number = window.innerHeight - 145;
    codeCol: Number;
    cloudCol: Number;
    utilCol: Boolean = false;
    cloudSpan: Number;
    parentCol: Number;
    utilSpan: Number;
    clientWidth: Number;
    inActive: Boolean = false;

    cloudHeight: Number = window.innerHeight - 260;
    contWidth: Number;
    expandOs: Boolean = false;
    instanceType: Boolean = false;
    serviceIndex: Number;
    selectedValueArray: Array<any> = [];
    activeClick: Boolean = false;
    selectedValues: Array<any> = [];
    counter: number = 0;
    dsMongo: any;
    dsPostgres: any;
    dsMaria: any;
    dsMysql: any;
    osUbuntu: any;
    osCent: any;
    osDebian: any;
    osFedora: any;
    plErlang: any;
    plHaskel: any;
    plPython: any;
    selectEnviroment: any;
    selectName: any;
    nextEnabled: Boolean = false;
    nextEnabledData: Boolean = false;
    arrayName: any;
    arrayEnv: any;
    nameEnv: Array<any> = [];
    envBoolean: Boolean = false;
    searchExp: Boolean = false;
    tableSearch: any;
    rotateRefresh: Boolean = false;
    enviromentList: Array<any> = [];
    serviceDetails: Array<any> = [];
    details: Array<any> = [[]];
    name: any;
    portValue: Number;
    clusterLists: Array<any> = [];
    di: any;
    showInstance = 0;
    showDetails: Boolean = false;
    actHeight: Number;
    enviroment = [
        { value: 'Development', viewValue: 'Development' },
        { value: 'Test', viewValue: 'Test' },
        { value: 'Staging', viewValue: 'Staging' }
    ];
    applaunchEnv = [
        { value: 'AWS', viewValue: 'AWS' }
    ];
    Stack = [


        {
            imgageUrl: "../images/mongo-db.png",
            serverName: "MEAN"
        },
        {

            imgageUrl: "../images/postgres.png",
            serverName: "LAMP"
        }

    ];
    Servers = [


        {
            imgageUrl: "../images/mongo-db.png",
            serverName: "MongoDB"
        },
        {

            imgageUrl: "../images/postgres.png",
            serverName: "Postgres"
        },
        {

            imgageUrl: "../images/mariadb-logo.png",
            serverName: "MariaDB"
        },
        {

            imgageUrl: "../images/my-sql.png",
            serverName: "MySQL"
        }
    ];


    manageLoader: Boolean = false;


    operatingSystem = [


        {
            imgageUrl: '../images/ubuntu-logo.png',
            name: 'Ubuntu'
        },
        {

            imgageUrl: '../images/centos.png',
            name: 'CentOS'
        },
        {

            imgageUrl: '../images/debian.png',
            name: 'Debian'
        },
        {

            imgageUrl: '../images/fedoraaa-logo.png',
            name: 'Fedora'
        }
    ];


    progLang = [


        {
            imgageUrl: '../images/erlang.png',
            name: 'Erlang'
        },
        {

            imgageUrl: '../images/haskell.png',
            name: 'Haskell'
        },

        {

            imgageUrl: '../images/python.png',
            name: 'Python'
        }
    ];


    nameFlag: Boolean = true;
    showArrowOne: Boolean = true;
    showArrowTwo: Boolean = false;
    showArrowThree: Boolean = false;
    sortName: String = "name";
    providerFlag: Boolean = true;
    stackFlag: Boolean = true;
    stackName: string;
    stackDeployed: Boolean = false
    archFileSrc = [
        { value: 'Neomegha', viewValue: 'Neomegha' },
        { value: 'Github', viewValue: 'Github' }
    ];

    archF = [
        { value: 'Ref file1', viewValue: 'Ref file1' },
        { value: 'Ref file2', viewValue: 'Ref file2' }
    ];

    cloud = [
        { value: 'AWS', viewValue: 'AWS' },
        { value: 'Azure', viewValue: 'Azure' }
    ];

pattern: any = "^[a-zA-Z0-9_]*$";

    constructor(public toastr: ToastsManager, private router: Router, private httpService: API, public dialog: MdDialog, private _formBuilder: FormBuilder) {
        this.initFormArray();

    }




    get self() {
        return this;
    }

    ngAfterViewInit() {
        this.microServiceList();
    //      const scrollHeight = ((window.innerHeight - 165) - (document.getElementById('act-scroll-height').clientHeight))-15;
    //    this.actHeight = scrollHeight;
    //     //console.log('actHeight', this.actHeight);

        
    }


    ButtonClick(img, text) {
        this.activeClick = true;
        this.counter++;
        this.selectedValues.push({ "img": img, "text": text });
        //console.log('Array values', this.selectedValues);
        //console.log("counter value is:", this.counter);
        // this.inActive = !this.inActive;
        this.booleanObj[text] = true;
        //console.log(this.booleanObj[text])
        //console.log("Selected  Array ", this.selectedValues);
        //console.log(" Array name & env", this.nameEnv);

    }

    removeSelection(i, text) {
        //console.log("Array", this.selectedValues);
        //console.log("Counter before element removal", this.counter);
        this.selectedValues.splice(i, 1);
        //console.log("New Array", this.selectedValues);
        this.counter--;
        //console.log("Counter after element removal", this.counter);
        //console.log("[text]", text);
        this.booleanObj[text] = false;
        //console.log("this.booleanObj[text]", this.booleanObj[text]);

    }


    SelectedOptions() {
        //console.log("Final Array", this.selectedValues);
        this.initFormArray();
        this.nextEnabled = true;
        this.nextEnabledData = true;

    }

    initFormArray() {
        let newFormArray: FormGroup[] = [];
        const v = this.selectedValues;

        if (this.selectedValues.length !== 0) {
            for (let i = 0; i < this.selectedValues.length; i++) {
                newFormArray.push(this._formBuilder.group({
                    name: [null, Validators.required],
                    // envType: [null, Validators.required],
                    textDisp: v[i].text,
                    img: v[i].img
                }));
            }
        } else {
            newFormArray.push(this._formBuilder.group({
                name: [null, Validators.required],
                // envType: [null, Validators.required],
                textDisp: null,
                img: null
            }));
        }

        this.microserviceForm = this._formBuilder.group({
            "someArray": this._formBuilder.array(newFormArray)
        })


    }


    onRefreshClick() {
        let self = this

        self.rotateRefresh = true;

    }
    arrayFillName(name: string) {
        //console.log(" Array fetch name before", this.nameEnv);
        this.nameEnv.push(name);
        //console.log(" Array fetch name after", this.nameEnv);
    }

    arrayFillEnv(env) {
        //console.log(" Array fetch env before", this.nameEnv);
        this.nameEnv.push(name);
        //console.log(" Array fetch env after", this.nameEnv);
    }



    previousView() {
        this.nextEnabled = false;
        //console.log("previous view");

    }

    onSelectChange = ($event: any): void => {
        //console.log('event => ', $event);
        //console.log('index => ', $event.index);
        if ($event.index == 0) {
            this.cloudIndex = 0;

            this.ftUser = !this.ftUser;
            this.nextEnabled = false;
            this.nextEnabledData = false;
            this.tableShow = true;
        }

        else {
            this.cloudIndex = 1;

            this.ftUser = !this.ftUser;
            this.nextEnabled = true;
            this.nextEnabledData = false;
            this.tableShow = false;
        }

    }




    onSearchExp() {
        document.getElementById('tableSearch').click()
        this.searchExp ? this.searchExp = false : this.searchExp = true;
        this.tableSearch = "";
    }
    filter(name) {
        if (name.indexOf('name') != -1) {
            this.nameFlag = !this.nameFlag
            this.showArrowOne = true;
            this.showArrowTwo = false;
            this.showArrowThree = false;
            this.sortName == 'name' ? this.sortName = '!name' : this.sortName = 'name';
        }
        else if (name.indexOf('type') != -1) {
            this.showArrowOne = false;
            this.showArrowTwo = true;
            this.showArrowThree = false;
            this.providerFlag = !this.providerFlag
            this.sortName == 'type' ? this.sortName = '!type' : this.sortName = 'type';
        }
        else {
            this.showArrowOne = false;
            this.showArrowTwo = false;
            this.showArrowThree = true;
            this.stackFlag = !this.stackFlag
            this.sortName == 'stack' ? this.sortName = '!stack' : this.sortName = 'stack';
            //console.log(this.sortName)
        }

    }
    submitForm() {

        this.ftUser = false;
        this.nextEnabled = true;
        this.nextEnabledData = false;
        this.tableShow = false;
        this.cloudIndex = 1;

        this.prepareSaveData();
        var self = this;
        var counter = 0;
        for (let i = 0; i < this.microserviceForm.value.someArray.length; i++) {
            self.portValue = parseInt(self.randomNumber(4, '0123456789'));
            let payload = {
                "name": this.microserviceForm.value.someArray[i].name,
                "image": "mongo",
                "targetPort": 80,
                "publishedPort": self.portValue,
                "replicas": 1
            }
            //console.log("payload", payload);
            this.httpService.fetchData('post', 'v1/cluster/dev/services/create', function (data) {
                var data = data.json();
                // counter++;
                self.microServiceList();
            },
                function (err) {
                    //console.log("Error in created clusterMicroService Manage", err);
                }, payload);
            //  if(counter>0 || i==this.microserviceForm.value.someArray.length-1){
            //     self.microServiceList();
            // }
        }
    }

    prepareSaveData() {
        const selectedformValues = this.microserviceForm.value;
        const valueCopy = selectedformValues.someArray.map((sel) => Object.assign({}, sel))
        //console.log("valueCopy", valueCopy);

        return valueCopy;
    }




    onCustomAppClick() {
        var self = this;
        this.di = this.dialog.open(AppAccountDialogComponent);
        this.di.afterClosed().subscribe(result => {
            //console.log('form -- data', result);
            if (typeof result != 'undefined' && Object.keys(result.controls).length !== 0) {
                //console.log("After closing the form" + result.controls);
                let payload = {
                    "fileSource": "NeoMegha",
                    "name": result.controls.name._value,
                    "refArch": "meanR1",
                    "env": "dev"
                };
                this.httpService.fetchData('post', 'v1/cluster/dev/services/createStack', function (data) {

                    //console.log("Form data", data, data._body);
                    var data = data._body;

                    //  this.serviceDetails.push()
                    //  if (success)
                    self.microServiceList();
                    //console.log("Form Submitted", data);
                },
                    function (err) {
                        //console.log("Form Not Submitted", err);
                        //console.log(payload);
                    }, payload);
                this.initFormArray();
                this.cloudIndex = 1;
            }
        })
        //This is a Working code, Commented out only for Demo29, need to check further
        /* this.httpService.fetchData('get', 'v1/cluster/dev/clusterCheck', (data) => {
           data = data.json();
           //console.log("onclick of Custom App Deploy Link" + data);
           if (Object.keys(data).length !== 0) {
             if (data.isActive === true && data.isIpAvailable === true) {
               this.di = this.dialog.open(AppAccountDialogComponent);
    
               this.di.afterClosed().subscribe(result => {
                 if (Object.keys(result.controls).length !== 0) {
                   //console.log("After closing the form" + result.controls);
                   const payload = {
                     "fileSource": "NeoMegha",
                     "name": "akash",
                     "refArch": "meanR1",
                     "env": "dev"
                   }
    
                   this.httpService.fetchData('get', 'v1/cluster/dev/clusterCheck', (data) => {
                     data = data.json();
                     //console.log("onclick of form submission" + data);
                     if (data.isActive === true && data.isIpAvailable === true) {
                       this.httpService.fetchData('post', 'v1/cluster/dev/services/createStack', function (data) {
                         var data = data.json();
                         if (data)
                           //console.log("Form Submitted", data);
                       },
                         function (err) {
                           //console.log("Form Not Submitted", err);
                         }, payload);
                       this.initFormArray();
                       this.cloudIndex = 1;
                     }
    
                   },
                     (err) => {
                       //console.log("Cluster for custom stack form submitting is not available");
                     }, {})
    
                 }
    
               })
             }else{
               this.toastr.error( " Cluster is not available", null, { animate: 'fade', toastLife: 3000 });
             }
           }
         },
           (err) => {
             this.toastr.error( " Cluster is not available", null, { animate: 'fade', toastLife: 3000 });
             //console.log("Cluster for click of Custom App Deploy link is not available");
           }, {})*/
    }



    microServiceList() {
        //  this.ftUser = false;
        // this.nextEnabled = true;
        this.manageLoader = true;
        this.serviceDetails = [];
        var self = this;
        this.httpService.fetchData('get', 'v1/cluster/dev/services/list', (data) => {
            data = data.json();
            //console.log("qwe", data);
            var stuff = [];
            data['data'].forEach(item => {
                if (!item.Spec.hasOwnProperty('Labels')) {
                    item.Spec.Labels = { 'StackName': '' };
                }
            });
            self.serviceDetails = data['data'];
            //console.log("self.serviceDetails", self.serviceDetails);
            self.clusterLists = self.serviceDetails.sort(this.compareDates);
            for (var j = 0; j < self.clusterLists.length; j++) {
                self.details[j] = [];
            }
            let k = 0;
            let l = 0;
            for (var j = 0; j < self.clusterLists.length; j++) {
                if (j == 0) {
                    self.details[k][l] = self.clusterLists[j];
                } else if (self.clusterLists[j].Spec.Labels.StackName == self.clusterLists[j - 1].Spec.Labels.StackName && self.clusterLists[j].Spec.Labels.StackName != '') {
                    l++;
                    self.details[k][l] = self.clusterLists[j];
                } else if (self.clusterLists[j].Spec.Labels.StackName != self.clusterLists[j - 1].Spec.Labels.StackName || self.clusterLists[j].Spec.Labels.StackName=='') {
                    k++;
                    l = 0;
                    self.details[k][l] = self.clusterLists[j];
                }
            }
            var detailsLen = self.details.length;
            //console.log('ddsee - ', self.details);
            for (var m = 0; m < detailsLen; m++) {
                if (self.details[m].length == 0) {
                    self.details.splice(m, 1);
                } else {
                    self.details[m][0].showDetails = true;
                }
            }
            //console.log('ddsee - ', self.details);
            self.manageLoader = false;
        },
            (err) => {
                //console.log("Error in getting Services", err);
                self.manageLoader = false;
            }, {});
    }
    hideDetails(flag) {
        let detailsLen = this.details.length;
        for (let i = 0; i < detailsLen; i++) {
            if (i == flag) {
                if (this.details[i][0].showDetails)
                    this.details[i][0].showDetails = false;
                else
                    this.details[i][0].showDetails = true;
            } else {
                this.details[i][0].showDetails = true;
            }
        }
    }
    compareDates(a, b) {
        //console.log('a - --', a);
        //console.log('b ---', b);
        if (a.Spec.Labels.StackName == b.Spec.Labels.StackName) return 0;
        else
            return 1;
    }
    randomNumber(length, numbs) {
        var result = '';
        for (var i = length; i > 0; --i) result += numbs[Math.floor(Math.random() * numbs.length)];
        return result;
    }

    instanceDetails(flag) {
        let serviceFilteredLen = this.serviceDetails.length;

        this.showDetails = !this.showDetails;
    }
}

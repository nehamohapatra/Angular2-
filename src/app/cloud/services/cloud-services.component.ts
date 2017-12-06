import { Component, AfterViewInit, OnInit, ViewChild, Renderer, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { scmConnect } from '../../common/repository';
import * as _ from 'lodash';
import { MdDialog } from '@angular/material';
import { API } from '../../http/http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { getAwsStaticRegions } from '../../common/cloud';
@Component({
    selector: 'cloud-services',
    templateUrl: './cloud-services.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class CloudServiceComponent implements AfterViewInit {
    //Inside box height start here
    @ViewChild('tabGroup') tabGroup;
    azureDetail: FormGroup;
    cloudHeight: Number = window.innerHeight - 260;
    contWidth: Number;
    expandOs: Boolean = false;
    instanceType: Boolean = false;
    serviceIndex: Number;
    changeForm: any;
    selectedVendor: any;
    showDisk1: Boolean = false;
    divEnable: Boolean = false;
    iopsDisplay: Boolean = false;
    elasticIpshow: Boolean = true;
    elasticIpType: any;
    diskCount: number = 0;
    entrTxtArray: any[] = [];
    dropGbType: Array<any> = [];
    disks: any;
    rootDiskCount: any;
    keyPairArray: any[];
    keyPairModel: any = '';
    securityGroup: any[];
    manageTitle: [String] = ["", "Repository", "Build", "Something"]
    rotateRefresh: Boolean = false;
    tableSearch: any;
    searchExp: Boolean = false;
    selectedItem: String = null;
    sortName: String = "name";
    nameFlag: Boolean = true;
    showArrowOne: Boolean = true;
    showArrowTwo: Boolean = false;
    showArrowThree: Boolean = false;
    providerFlag: Boolean = true;
    stackFlag: Boolean = true;
    tbody: Boolean = false;
    noData: Boolean = false;
    selectedRepo: String = '';
    repoArray: Array<any> = [];
    vmData: Array<any> = [];
    cloudAccountData: any;
    selectedSCM: String = '';
    onLinkRepo: Boolean = false;
    noBorder: Boolean = false;
    repoLink: Boolean = false;
    nodataTop: number = 150;
    resHeight: Number = window.innerHeight - 146;
    resWidth: Number = window.innerWidth - 75;
    detailHeight: Number = (window.innerHeight - 190) - 311;
    mtUser: Boolean = true;
    ftUser: Boolean = false;
    greyColor: Boolean = true;
    cloudAccountDetails: Array<any> = [];
    AccountDetails: Array<any> = [];
    reservationsData: Array<any> = [];
    instanceFiltered: Array<any> = [];
    btElem: any;
    ipValue: any;
    ipValueFlag: Boolean = false;
    instanceState: any;
    runFlag: Boolean = false;
    stopFlag: Boolean = false;
    replayFlag: Boolean = false;
    countNum: number = 0;

    repository: Array<any> = [
        {
            name: "Domino's",
            provider: "Github",
            access: "http://github.com/futur/project-world",
            stack: "Mobile App Stack"
        },
        {
            name: "Tireoh",
            provider: "Github",
            access: "http://github.com/futur/project-world",
            stack: "little"
        }
    ];
    showTableValue: Boolean = false;
    detailLoader: Boolean = false;
    repoDetail: any;
    uncompData: Boolean = false;
    compData: Boolean = false;
    instanceDetailsFlag: Boolean = false;
    detailArrow: Boolean = false;
    public currentDetail;




    name: any;
    vpcSelect: any;
    subnetRadioSelect: any;
    subnetVpcSelectModel: any;
    familySelect1Model: any;
    familySelect2Model: any;
    osBaseModel: any;
    osBaseUbuntuModel: any;
    osBaseVersionModel: any;
    rootDiskGbModel: any;
    rootDiskRadioType: any;
    disk1Count: Array<any> = [];
    disk1GbModel: Array<any> = [];
    disk1RadioType: Array<any> = [];

    ipAddressType: any;
    securityGroupModel: any;



    vpc = [
        { value: 'VPC 1', viewValue: 'VPC 1' },
        { value: 'VPC 2', viewValue: 'VPC 2' },
        { value: 'VPC 3', viewValue: 'VPC 3' },
        { value: 'VPC 4', viewValue: 'VPC 4' }
    ];


    subnetVpcSelect = [
        { value: 'Subnet 1', viewValue: 'Subnet 1' },
        { value: 'Subnet 1A', viewValue: 'Subnet 1A' },
        { value: 'Subnet 1B', viewValue: 'Subnet 1B' },
        { value: 'Subnet 1C', viewValue: 'Subnet 1C' }
    ];

    familySelect1 = [
        { value: 'General Purpose', viewValue: 'General Purpose' },
        { value: 'Compute Optimized', viewValue: 'Compute Optimized' },
        { value: 'Memory Optimized', viewValue: 'Memory Optimized' },
        { value: 'Storage Optimized', viewValue: 'Storage Optimized' },
        { value: 'Accelerated Computing', viewValue: 'Accelerated Computing' },
        { value: 'Micro instances', viewValue: 'Micro instances' }
    ];

    familySelect2 = [
        { value: 't2.micro', viewValue: 't2.micro' },
        { value: 't2.small', viewValue: 't2.small' },
        { value: 't2.medium', viewValue: 't2.medium' },
        { value: 't2.large', viewValue: 't2.large' }
    ];

    osBase = [
        { value: 'Linux', viewValue: 'Linux' },
        { value: 'Windows', viewValue: 'Windows' }
    ];

    osBaseUbuntu = [
        { value: 'Ubuntu', viewValue: 'Ubuntu' },
        { value: 'CentOS', viewValue: 'CentOS' },
        { value: 'Fedora', viewValue: 'Fedora' },
        { value: 'Debian', viewValue: 'Debian' }
    ];

    osBaseVersion = [

        { value: '16.04', viewValue: '16.04' },
        { value: '14.04', viewValue: '14.04' },
        { value: '12.04', viewValue: '12.04' }
    ];

    rootDiskGb = [
        { value: 'GB', viewValue: 'GB' },
        // { value: 'GB', viewValue: 'GB' }

    ];

    disk1Gb = [
        { value: 'GB', viewValue: 'GB' },
        { value: 'GB', viewValue: 'GB' }

    ];

    tiles = [
        { text: 'vCPU', cols: 1, rows: 1 },
        { text: 'CPU Credits/hour', cols: 2, rows: 1 },
        { text: 'Mem(GiB)', cols: 1, rows: 1 },
        { text: 'Storage', cols: 1, rows: 1 },
    ];


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
        }

    }

    vendors: any = [
        { caps: "AWS", small: "aws" },
        { caps: "AZURE", small: "azure" }
    ];

    @Output() selectedCloudEnv = new EventEmitter();

    constructor(private router: Router, private _formBuilder: FormBuilder, public dialog: MdDialog, private httpService: API,
        private storeService: StoreService, public toastr: ToastsManager, public renderer: Renderer, private cdRef: ChangeDetectorRef) {
        var self = this;

        this.azureDetail = this._formBuilder.group({
            name: ['', [Validators.required]],
            vpcSelect: ['', [Validators.required]],
            subnetRadioSelect: [''],
            subnetVpcSelect: ['', [Validators.required]],
            familySelect1: ['', [Validators.required]],
            familySelect2: ['', [Validators.required]],
            osBase: ['', [Validators.required]],
            osBaseUbuntu: ['', [Validators.required]],
            osBaseVersion: ['', [Validators.required]],
            diskCount: ['', [Validators.required]],
            disk1Count: [''],
            dropGbType: [''],
            disk1RadioType: [''],
            securityGroup: ['', [Validators.required]],
            keyPair: ['', [Validators.required]],
            entrTxtArray: ['']
        })

    }


    launchVm() {
        let self = this;
        this.detailLoader = true;
        let j = 101;
        let diskArray;
        let payload;
        let count = self.entrTxtArray.length;
        for (var i = 0; i < count; i++) {
            j++;
            var letter = String.fromCharCode(j);
            let url = "/dev/sd".concat(letter);
            let size = self.entrTxtArray[i];
            let type = self.disk1RadioType[i];

            diskArray = [
                {
                    "DeviceName": url,
                    "Ebs": {
                        "DeleteOnTermination": true,
                        "VolumeSize": size,
                        "VolumeType": "gp2"
                    }
                }
            ]

            payload = {

                "diskArray": diskArray,
                "imageId": "ami-80861296",
                "tagName": self.azureDetail.value.name,
                "keyName": self.azureDetail.value.keyPair.KeyName,
                "instanceType": "t2.micro",
                "securityGroups": [self.azureDetail.value.securityGroup.GroupName]
            }
            console.log("key Values:", payload);
        }

        self.httpService.fetchData('post', 'v1/aws/createEC2Instance', function (data) {
            var data = data.json();
            if (data) {

                self.detailLoader = false;
                self.AccountDetails = data.data;
                self.diskCount = 0;
                this.disks = [];
                self.toastr.success(self.azureDetail.value.name + " successfully launched", null, { animate: 'fade', toastLife: 3000 })
                setTimeout(() => {
                    self.ftUser = !self.ftUser;
                    self.serviceIndex = 1;
                    self.getManageDetails();
                }, 2000)
                if (data.projectExists) {

                } else {

                }
            }
            self.azureDetail.reset();
        }, function (err) {
            self.detailLoader = false;
            console.log("post request error", err);
            self.toastr.error(self.azureDetail.value.name + " launch failed. Please retry.", null, { animate: 'fade', toastLife: 3000 })

        }, payload);
    }

    onSearchExp() {
        document.getElementById('tableSearch').click()
        this.searchExp ? this.searchExp = false : this.searchExp = true;
        this.tableSearch = "";
    }

    onRefreshClick() {
        let self = this

        self.rotateRefresh = true;
        self.getManageDetails();

    }

    validate(value) {
        value < 0 ? this.rootDiskCount = 0 : this.rootDiskCount = value;
    }

    onSelectOs() {
        this.expandOs = !this.expandOs;
    }
    onInstanceType() {
        this.instanceType = !this.instanceType;
    }
    instanceItem: any = [
        {
            type: 'micro',
            vcpu: '1',
            hour: '6',
            mem: '1'
        },
        {
            type: 'small',
            vcpu: '1',
            hour: '12',
            mem: '2'
        },
        {
            type: 'medium',
            vcpu: '2',
            hour: '24',
            mem: '4'
        }
    ]
    ngAfterViewInit() {
        var self = this;
        var elem = document.querySelector('.bundle-tab-container');
        self.contWidth = (elem.clientWidth) - 50;
        self.serviceIndex = 0;
    }

    onSelectChange = ($event: any): void => {

        if ($event.index == 0) {
            this.serviceIndex = 0;
            this.ftUser = false;
        }

        else {
            this.serviceIndex = 1;
            this.ftUser = true;
        }

    }


    maxRange() {

        if (this.diskCount >= 15) {
            return false;
        }
        else {

            if (this.diskCount < 2) {
                this.disks = Array(this.diskCount).fill(null);
                this.countNum = this.disks.length;
                this.diskCount++;
            }
        }

    }

    minRange() {
        if (this.diskCount <= 0) {
            return false;
        }
        else {
            this.diskCount--;
            if (this.diskCount < 2) {
                this.disks = Array(this.diskCount).fill(null);
                this.countNum = this.disks.length;
            }
        }
    }

    disCountClick() {
        this.showDisk1 = true;
        this.elasticIpshow = false;
    }

    divInfo() {
        this.divEnable = true;
    }

    iopSdIsk(v) {
        if (v == 3) {
            this.iopsDisplay = true;
        }
        else {
            this.iopsDisplay = false;
        }
        return true;
    }

    trackByFn(index) {
        return index;
    }

    ngOnInit() {
        let self = this;
        let url = "v1/aws/list/securityGroups/";
        let obj: any;
        this.httpService.fetchData('get', url, (response) => {
            var obj = JSON.parse(response._body);
            if (obj) {
                this.securityGroup = obj.data.SecurityGroups;
            } else {
                this.securityGroup = [];
            }
        }, (err) => {
            console.log(err);
        }, {});

        this.httpService.fetchData('get', 'v1/aws/getAllKeyNames', (data) => {
            data = data.json();
            console.log("key:", data);

            if (data.data) {
                this.keyPairArray = data.data;
                console.log("KeyPair", data.data);
            }
        }, (err) => {
            console.log("Error Getting List of KeyPairs", err);
        }, {});

        getAwsStaticRegions(self);
        this.getManageDetails();

        this.httpService.fetchData('get', 'v1/cloud/AWS/getAccounts', (data) => {

            let cloudInstance: any;
            data = data.json();

            if (data.data) {
                console.log("Success in getting cloud Accounts", data.data);
                localStorage.setItem("_Id", JSON.stringify(data));

            }
        }, (err) => {
            console.log("Error in getting cloud Accounts", err);
        }, {});


    }

    showDetails() {
        this.showTableValue = true;

    }
    checkTagKeys(paramArray) {
        for (let i = 0; i < paramArray.length; i++) {
            if (paramArray[i]['Key'].toUpperCase() == 'NAME') {
                return paramArray[i]['Value'];
            }
        } return '';
    }
    getManageDetails() {

        this.instanceFiltered = [];
        this.httpService.fetchData('get', 'v1/aws/getAWSInstance', (data) => {

            let vmInstance: any;
            data = data.json();

            if (data.data) {
                this.rotateRefresh = false;
                this.vmData = data;

                var manageDetails = JSON.stringify(this.vmData);
                this.reservationsData = data["data"]["Reservations"];
                let pendingStatus: boolean = false;
                let element;
                let reservationLength = this.reservationsData.length;
                for (let i = 0; i < reservationLength; i++) {
                    let instanceLength = this.reservationsData[i]['Instances'].length;
                    let instance = this.reservationsData[i]['Instances'];
                    for (let j = 0; j < instanceLength; j++) {
                        let tagName = this.checkTagKeys(instance[j]['Tags']);
                        if (tagName != '') {
                            let obj = { 'AvailabilityZone': '', 'PublicIpAddress': '', 'LaunchTime': '', 'InstanceType': '', 'Name': '', 'InstanceId': '', 'PrivateIpAddress': '', 'Value': '', 'runFlag': false, 'stopFlag': false, 'pendingFlag': false, 'showInstance': '' };
                            obj.AvailabilityZone = instance[j].Placement.AvailabilityZone;
                            obj.showInstance = '0';
                            if (typeof instance[j]['PublicIpAddress'] == 'undefined' || typeof instance[j]['PublicIpAddress'] == null) {
                                obj.PublicIpAddress = '';
                            } else {
                                obj.PublicIpAddress = instance[j]['PublicIpAddress'];
                            }
                            obj.LaunchTime = instance[j]['LaunchTime'];
                            obj.InstanceType = instance[j]['InstanceType'];
                            obj.Name = tagName;
                            obj.Value = tagName;
                            obj.InstanceId = instance[j]['InstanceId'];
                            obj.PrivateIpAddress = instance[j]['PrivateIpAddress'];
                            console.log('instance state', instance[j]['State']['Name']);
                            if (instance[j]['State']['Name'] == 'stopped') {
                                obj.runFlag = true;
                            } else if (instance[j]['State']['Name'] == 'running') {
                                obj.stopFlag = true;
                            } else if (instance[j]['State']['Name'] == 'pending') {
                                obj.pendingFlag = true;
                                pendingStatus = true;
                            }
                            this.instanceFiltered.push(obj);
                        }

                    }

                }
                if (pendingStatus == true) {
                    var self = this;
                    setTimeout(function () {
                        self.getManageDetails();
                    }, 60000);
                }
                console.log("instanceFiltered", this.instanceFiltered);
            }
        }, (err) => {
            console.log("Error in listing VMs", err);
        }, {});



    }


    instanceDetails(i) {

        this.instanceDetailsFlag = !this.instanceDetailsFlag;
        i++;
        this.detailArrow = true;
    }

    hideDetails(flag) {
        let instanceFilteredLen = this.instanceFiltered.length;
        for (let i = 0; i < instanceFilteredLen; i++) {
            if (this.instanceFiltered[i]['InstanceId'] == flag) {
                if (this.instanceFiltered[i]['showInstance'] == '1')
                    this.instanceFiltered[i]['showInstance'] = '0';
                else
                    this.instanceFiltered[i]['showInstance'] = '1';
            } else {
                this.instanceFiltered[i]['showInstance'] = '0';
            }
        }
    }

    startInstance(instanceId) {
        var id = JSON.parse(localStorage.getItem('_Id'));
        console.log("localStorage.getItem", id.data[0]._id);
        var cloudAccountId = id.data[0]._id;

        let payload = {


            "instanceId": instanceId,
            "cloudAccountId": cloudAccountId

        }


        this.httpService.fetchData('post', 'v1/aws/startIntance', function (data) {
            var data = data.json();
            if (data) {
                console.log("Instance started", data);

            }
        },
            function (err) {
                console.log("Error in Starting Instanece", err);
            }, payload);
    }


    vendorUpdate(value) {
        console.log(value);
        this.selectedCloudEnv.emit(value);
        console.log("In as Service AWS");
    }

    stopInstance(instanceId) {

        var id = JSON.parse(localStorage.getItem('_Id'));
        console.log("localStorage.getItem", id.data[0]._id);
        var cloudAccountId = id.data[0]._id;

        let payload = {

            "instanceId": instanceId,
            "cloudAccountId": cloudAccountId

        }

        this.httpService.fetchData('post', 'v1/aws/stopIntance', function (data) {
            var data = data.json();
            if (data) {
                console.log("Instance stopped", data);
            }
        },
            function (err) {
                console.log("Error in Stoping Instance", err);
            }, payload);
    }



    terminateInstance(instanceId) {

        var id = JSON.parse(localStorage.getItem('_Id'));
        console.log("localStorage.getItem", id.data[0]._id);
        var cloudAccountId = id.data[0]._id;

        let payload = {


            "instanceId": instanceId,
            "cloudAccountId": cloudAccountId

        }

        this.httpService.fetchData('post', 'v1/aws/terminateInstance', function (data) {
            var data = data.json();
            if (data) {
                console.log("Instance Terminated", data);
            }
        },
            function (err) {
                console.log("Error in Terminating Instance", err);
            }, payload);
    }
}

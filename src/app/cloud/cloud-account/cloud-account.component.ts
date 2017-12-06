import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getAwsRegions } from '../../common/cloud';

@Component({
    selector: 'cloud-account',
    templateUrl: './cloud-account.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})
export class CloudAccountComponent implements OnInit {


    @Output() getConnect: EventEmitter<any> = new EventEmitter<true>();
    @Output() disconnect: EventEmitter<any> = new EventEmitter<true>();
    //   contHeight: Number = ((window.innerHeight - 180)) - 22;
    constructor(public toastr: ToastsManager, private elem: ElementRef, private router: Router, private httpService: API, private storeService: StoreService,
        private _formBuilder: FormBuilder) {
        this.today = new Date();
        console.log("today", this.today);
    }
    today: any;
    defaultStr = 'Select a product';
    public accessType: String = 'password';
    public secType: String = 'password';
    cloudDetail: any = null;
    cloudDetailRegion: any = null;
    awsCloudRegions: String = '';
    awsRegions: Array<any> = [];
    regions: Array<any> = [];
    activeAws: Boolean = false;
    addDetail: Boolean = false;
    awsDetail: FormGroup;
    accessVisible: Boolean = true;
    secVisible: Boolean = true;
    unlinkPop: Boolean = false;
    delEnvPop: Boolean = false;
    enableUpdateFlag: Boolean = true
    formHeight: Number = (((window.innerHeight - 190) - 20) + 18) - 60;
    resHeight: Number = window.innerHeight - 146;
    resWidth: Number = window.innerWidth - 75;
    cloudLoader: Boolean = true;
    removeStaging: Boolean = true;
    azureAdd: Boolean = false;
    azureAct: Boolean = false;
    colorChangeFlag: Boolean = false;
    arrowDisable: Boolean = true;
    DisabledContent1: Boolean = true;
    DisabledContent2: Boolean = true;
    DisabledContent3: Boolean = true;
    disabledCheckBox1: Boolean = true;
    disabledCheckBox2: Boolean = true;
    disabledCheckBox3: Boolean = true;
    disabledRegion1: Boolean = true;
    disabledRegion2: Boolean = true;
    disabledRegion3: Boolean = true;
    enviromentDetails: Array<any> = [];;
    ActiveEnv: Boolean = false;
    envAdded1: Boolean = false;
    envAdded2: Boolean = false;
    envAdded3: Boolean = false;
    disableddev1: Boolean = false;
    disableddev2: Boolean = false;
    disableddev3: Boolean = false;
    devlaunch: Boolean = false;
    urlVariable: String;
    showCredentialsFlag: Boolean = false;
    stackName: String;
    stackCreateDelete: String;
    clusterName: String;
    // envName: String;
    accessKey: String = "Please enter your access key ID";
    secretKey: String = "Please enter your secret access key";
    azureDetailFlag: Boolean = false;
    clusterCreateFlag: Boolean = false;
    self = window;
    showProgressBar: Boolean = false;
    clusterFailed: Boolean = false;
    clusterStatusFlag: Boolean = false;
    enableUpdate() {
        this.enableUpdateFlag = false
    }

    onAccessVisible() {
        this.accessType = 'text';
        this.accessVisible = false;
    }
    onAccessVisibleOff() {
        this.accessType = 'password';
        this.accessVisible = true;
    }
    onSecVisible() {
        this.secType = 'text';
        this.secVisible = false;
    }
    onSecVisibleOff() {
        this.secType = 'password';
        this.secVisible = true;
    }
    onOpenPopUp() {
        this.unlinkPop = !this.unlinkPop;
        this.clusterStatusFlag = false;
    }

    deleteEnvDev() {
        //  this.delEnvPop = !this.delEnvPop;
        // this.envName =
        this.unlinkPop = !this.unlinkPop;
    }

    onUnlink() {

        let self = this;

        let payload = {
            "stackName": this.clusterName
        }


        self.httpService.fetchData('post', 'v1/job/deleteJob', function (data) {
            var data = data.json;
            self.disconnect.emit();
            self.toastr.success("AWS account successfully unlinked", null, { animate: 'fade', toastLife: 3000 });
            self.awsDetail.reset();
            self.unlinkPop = !self.unlinkPop;
            self.addDetail = false;
            self.activeAws = false;
            self.storeService.setStore('cloudData', { cloud: [] });
            self.cloudDeactivate();
            console.log("AWS account successfully unlinked", payload ,"self.addDetail",self.addDetail,"self.activeAws",self.activeAws);
        
        }, function (err) {
             self.unlinkPop = !self.unlinkPop;
            
            self.toastr.error("Error in unlinking AWS account", null, { animate: 'fade', toastLife: 3000 });
            console.log("Error in AWS account unlinking ", err);
        }, payload)


    }

    randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    clusterSetup() {
        let self = this;
        this.clusterName = self.randomString(7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        // self.stackCreateDelete =   text.substring(0, 5);
        let payload = {
            "stackName": this.clusterName
        }
        //Hiding of progress bar
        self.showProgressBar = false;
        //Showing of Cluster Status
        self.clusterStatusFlag = true;

        self.httpService.fetchData('post', 'v1/job/deployJob', function (data) {
            var data = data.json;
            //Hiding of Cluster Status if required
            //self.clusterStatusFlag=false;

            console.log("Success in cluster creation", payload);
        }, function (err) {
            self.clusterFailed = true;
            console.log("Error in cluster creation ", err);
        }, payload)
    }
    onDetailAdd() {
        console.log(this.awsDetail.value);
        let self = this;
        let detail = self.awsDetail.value;
        let url = "v1/aws/create";
        console.log(self.awsDetail.value)
        let payload = { name: detail.name, accessKey: detail.accessKey, secretKey: detail.secretKey, region: detail.selectRepo };
        self.httpService.fetchData('post', url, function (data) {
            //Showing of progress bar
            self.showProgressBar=true;
            data = data.json();
            self.getConnect.emit();
            self.addDetail = true;
            self.azureAdd = false;
            self.toastr.success(data.message, null, { animate: 'fade', toastLife: 3000 });
            getAwsRegions(self, true);

            // }, function (err) {
            // this.router.navigate(['aws-onboard']);
            setTimeout(function () { self.clusterSetup() }, 20000)
        }, function (err) {
            err = err.json()
            console.log("Error in linking to Aws", err)
            if (err.data.code == 'EntityAlreadyExists') {
                self.toastr.error("Your AWS account already linked", null, { animate: 'fade', toastLife: 3000 })
            }
            else if ((err.data.code == 'SignatureDoesNotMatch' || err.data.code == 'InvalidClientTokenId')) {
                self.awsDetail.reset()
                self.accessKey = "Invalid credentials"
                self.secretKey = "Invalid credentials"
                self.toastr.error("Invalid credentials", null, { animate: 'fade', toastLife: 3000 })
            }
            else if (err.data.code === 'AccessDenied') {
                self.toastr.error("AWS account could not be linked. Please retry", null, { animate: 'fade', toastLife: 3000 })
            }
            else {
                self.toastr.error(err.data.message, null, { animate: 'fade', toastLife: 3000 })
            }

        }, payload);

    }


    checkBoxSelectDev() {

        this.DisabledContent1 = !this.DisabledContent1;
        this.disabledCheckBox1 = !this.disabledCheckBox1;
        this.ActiveEnv = true;
        this.disabledRegion1 = !this.disabledRegion1;
        this.disableddev1 = false;
        this.disableddev2 = false;
        this.disableddev3 = false;
        this.urlVariable = "../images/development_org.png"
    }


    selectDevToolkit(flagvalue) {
        if (flagvalue == 1) {
            this.disableddev1 = true;
            this.disableddev2 = false;
            this.disableddev3 = false;
            console.log('first', this.disableddev1);
            console.log('sec', this.disableddev2);
            console.log('third', this.disableddev3);
        } else if (flagvalue == 2) {
            this.disableddev1 = false;
            this.disableddev2 = true;
            this.disableddev3 = false;
            console.log('first', this.disableddev1);
            console.log('sec', this.disableddev2);
            console.log('third', this.disableddev3);
        } else if (flagvalue == 3) {
            this.disableddev1 = false;
            this.disableddev2 = false;
            this.disableddev3 = true;
            console.log('first', this.disableddev1);
            console.log('sec', this.disableddev2);
            console.log('third', this.disableddev3);
        }
    }

    checkBoxSelectTest() {

        this.DisabledContent2 = !this.DisabledContent2;
        this.disabledCheckBox2 = !this.disabledCheckBox2;
        this.ActiveEnv = true;

        this.disabledRegion2 = !this.disabledRegion2;
    }

    checkBoxSelectStage() {
        let self = this
        this.DisabledContent3 = !this.DisabledContent3;
        this.disabledCheckBox3 = !this.disabledCheckBox3;
        this.ActiveEnv = true;

        this.disabledRegion3 = !this.disabledRegion3;

    }
    updateAwsDetail() {
        let self = this
        let url = 'v1/aws/update/1'
        let payload = { region: self.cloudDetailRegion }
        self.httpService.fetchData('post', url, function (data) {
            data = data.json();
            console.log('v1/aws/update/1');
            if (data && data.success) {
                self.toastr.success(data.data.message, null, { animate: 'fade', toastLife: 3000 });
                self.enableUpdateFlag = true;
                getAwsRegions(self, true);
            }

        }, function (err) {
            console.log("Some Error", err);
        }, payload);



    }
    azureAddTextSet(value){
        this.azureAdd = value;
    }
    // Deactivate cloud account
    cloudDeactivate() {
        let payload = { "isActive": false }
        console.log("v1/aws/update", payload);

        let url = 'v1/aws/update'
        let self = this;
        self.httpService.fetchData('post', url, function (data) {
            data = data.json();

            console.log("v1/aws/update inside", payload);
            // self.disconnect.emit()
            // self.toastr.success(data.data.message, null, { animate: 'fade', toastLife: 3000 });
            // self.awsDetail.reset();
            // self.unlinkPop = !self.unlinkPop;
            // self.addDetail = false;
            // self.activeAws = false;
            // self.storeService.setStore('cloudData', { cloud: [] })


        }, function (err) {
            console.log("Some Error", err);
        }, payload);

    }


    onCancel() {
        var self = this;
        console.log("Triggered")
        getAwsRegions(self);
        self.enableUpdateFlag = true;

    }





    updateData() {
        var self = this;
        getAwsRegions(self, true);
        // this.unlinkPop = !this.unlinkPop;
    }
    onAwsClick() {
        this.activeAws = true;
        this.azureAct = false;

    }
    //Azure function
    onAzureClick() {
        if (this.addDetail == true) {
            this.addDetail = true;
            this.colorChangeFlag = true;

        }

        else {
            this.addDetail = false;
            this.colorChangeFlag = false;

        }
        this.azureAct = true;
        this.activeAws = false;
        this.arrowDisable = false;
    }

    awsToggleView() {
        this.activeAws = true;
        this.azureAct = false;
        this.colorChangeFlag = false;
        this.arrowDisable = true;
    }

    ngOnInit() {
        var self = this;
        
        this.awsDetail = this._formBuilder.group({
            name: ['', [Validators.required]],
            accessKey: ['', [Validators.required]],
            secretKey: ['', [Validators.required]],
            selectRepo: ['', [Validators.required]]
        })
        console.log("form values" ,this.awsDetail.value);
        getAwsRegions(self, true);
        this.urlVariable = "../images/development.svg";


        this.httpService.fetchData('get', 'v1/cloud/1/getEnvironment', (data) => {
            data = data.json();
            if (data.data) {

                console.log("Enviroment List", data.data);
            }
        }, (err) => {
            console.log("Error Getting Enviroment List", err);
        }, {});


        // Cluster availablity check
        var self = this;
        self.httpService.fetchData('get', 'v1/cluster/dev/clusterCheck', (data) => {
            data = data.json();
            console.log("Cluster Details", data);

            if (data.isActive == true) {
                console.log("details.isActive ", data.isActive)
                if (data.isIpAvailable == true) {
                    console.log("details.isIpAvailable ", data.isIpAvailable)
                    this.disabledCheckBox1 = !this.disabledCheckBox1;

                }

            }
        },
            (err) => {
                console.log("Cluster Error", err);
                console.log("Cluster Error Data", err._body);

            }, {});



    }
    toolKitLaunch() {
        var self = this;

        var possible = "abcdefghijklmnopqrstuvwxyz";
        var text = possible.substr(Math.floor(Math.random()));
        console.log("this.Text", text);
        console.log("this.Text sub", text.substring(0, 5));

        var payload = {
            "env": "dev",
            "stackName": this.stackName + text.substring(0, 5),
            "toolkit": "toolkit1"
        }
        this.httpService.fetchData('post', 'v1/job/deployJob', (data) => {
            data = data.json();
            if (data.data) {
                console.log("ToolKit Launch", payload);
            }
        }, (err) => {
            console.log("ToolKit Launch Failed", payload);
        }, payload)

    }

    addEnviroment() {
        let self = this;
        console.log("Dev:", this.disabledCheckBox1);
        console.log("Test:", this.disabledCheckBox2);
        console.log("Stage:", this.disabledCheckBox3);

        if (!this.disabledCheckBox1) {
            this.envAdded1 = true;
            this.disabledCheckBox1 = true;
        }


        if (!this.disabledCheckBox2) {
            this.disabledCheckBox2 = true;
            this.envAdded2 = true;
        }


        if (!this.disabledCheckBox3) {
            this.disabledCheckBox3 = true;
            this.envAdded3 = true;
        }
        //Checking the list of Enviroment only dev
        let url = "v1/cloud/1/getEnvironment";
        this.httpService.fetchData('get', url, (response) => {
            console.log("Data Received", response._body);
            let data = JSON.parse(response._body);
            console.log("Enviroment List data", data);
            console.log("Enviroment List", Object.keys(data).length);
            if (Object.keys(data).length < 1) {
                console.log("Create Env ", Object.keys(data).length);
                this.createUpdateDeleteEnv();
                this.toolKitLaunch();
                let dev = data['data'].dev;
                let test = data['data'].test;
                console.log("dev & test", dev, test);
                self.toastr.success("Development Enviroment successfully added.", null, { animate: 'fade', toastLife: 3000 });
            }

            if (Object.keys(data).length >= 1) {
                console.log("Update Env ", Object.keys(data).length);
                this.createUpdateDeleteEnv();
                this.toolKitLaunch();
                let dev = data['data'].dev;
                let test = data['data'].test;
                console.log("dev & test", dev, test);
                self.toastr.success("Development Enviroment successfully added.", null, { animate: 'fade', toastLife: 3000 });
            }

        }, (err) => {
            console.log("NO Enviroment");
        }, {});

        this.devlaunch = !this.devlaunch;

        this.disableddev1 = false;
        this.disableddev2 = false;
        this.disableddev3 = false;
        this.urlVariable = "../images/development_green.svg"

    }
    // create, update and delete enviroment
    createUpdateDeleteEnv() {
        let self = this;
        let payload = {
            "env":
            {
                "dev":
                {
                    "availabilityZone": this.cloudDetailRegion,
                    "keyName": "dfp_dev_key"
                },
                "test":
                {
                    "availabilityZone": this.cloudDetailRegion,
                    "keyName": "dfp_test_key"
                }
            }

        }
        console.log("Payload ", payload);
        self.httpService.fetchData('post', 'v1/cloud/1/updateEnvironment', function (data) {
            console.log("inside update env ", payload);
            var data = data.json();


            if (data) {
                console.log("create request success", data);

                localStorage.setItem("Enviroment", JSON.stringify(data));
                console.log("Enviroment", JSON.stringify(data));

            }

            //  self.stackName = Object.keys(payload.env)[0];
            // console.log("stackName",self.stackName);
            // this.payload.env.forEach(element => {
            //     self.enviromentDetails.push(element);

            // });
            // console.log("enviromentDetails", self.enviromentDetails);
            // // // for(let element in payload ){
            //     self.enviromentDetails.push(element);
            // }
            // console.log("enviromentDetails", self.enviromentDetails);
        }, function (err) {
            console.log("create request error", err);
        }, payload);

        self.stackName = Object.keys(payload.env)[0];
        console.log("stackName", self.stackName);
    }

    showCredentials() {
        this.showCredentialsFlag = !this.showCredentialsFlag;
    }
}

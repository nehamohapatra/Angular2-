import { Component, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getAwsRegions } from '../../common/cloud';


@Component({
    selector: 'azure-account',
    templateUrl: './azure-account.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

export class AzureAccountComponent implements OnInit {
    @Output() getConnect: EventEmitter<any> = new EventEmitter<true>();
    @Output() disconnect: EventEmitter<any> = new EventEmitter<true>();
    azureDetail: FormGroup;
    invalidTxt: String = "Invalid Credentials";
    public idType: String = 'password';
    public secretType: String = 'password';
    public tenantType: String = 'password';
    public subcriptionType: String = 'password';

    cloudDetail: any = null;
    azureAccountId: any[] = null;
    unlinkPop: Boolean = false;
    enableUpdateFlag: Boolean = true;
    cloudLoader: Boolean = true;
    idVisible: Boolean = true;
    azureAdd: Boolean = false;
    azurDetail: Boolean = true;
    addDetail: Boolean = false;
    awsDetail: Boolean = false;
    secretVisible: Boolean = true;
    tenantVisible: Boolean = true;
    azureLoader: Boolean = false;
    azureName: string;
    subcriptionVisible: Boolean = true;
    formHeight: Number = (((window.innerHeight - 190) - 20) + 18) - 60;
    constructor(public toastr: ToastsManager, private router: Router, private httpService: API, private _formBuilder: FormBuilder) { }
    azureRegions = [
        {
            region: 'America',
            america: [{
                city: 'Virgina',
            }]
        }
    ];

    onIdVisible() {
        this.idType = 'text';
        this.idVisible = false;
    }
    onIdVisibleOff() {
        this.idType = 'password';
        this.idVisible = true;
    }

    onSecretVisible() {
        this.secretType = 'text';
        this.secretVisible = false;
    }
    onSecretVisibleOff() {
        this.secretType = 'password';
        this.secretVisible = true;
    }

    onTenantVisible() {
        this.tenantType = 'text';
        this.tenantVisible = false;
    }
    onTenantVisibleOff() {
        this.tenantType = 'password';
        this.tenantVisible = true;
    }

    onSubcriptionVisible() {
        this.subcriptionType = 'text';
        this.subcriptionVisible = false;
    }
    onSubcriptionVisibleOff() {
        this.subcriptionType = 'password';
        this.subcriptionVisible = true;
    }

    getAzureAccountId(){
        let self = this;
        let url = "v1/azure/getAccounts";
        self.httpService.fetchData('get', url, function (response) {
        response = response.json();
        self.getConnect.emit();
        localStorage.setItem('azureAccountId',  response.data[0]["_id"]);

    }, function (err) {
            err = err.json()
            console.log("Error in getting azure account", err);
        }, );

    }
    @Output() azureAddTextSet = new EventEmitter();
    onAzureDetailsAdd(){
        // console.log(this.azureDetail.value);
        let self = this;
        let detail = self.azureDetail.value;
        let url = "v1/azure/onboarding";
        // self.azureDetail.reset();
        self.azureLoader = true
        let payload = { name: detail.name, clientId: detail.clientId, secretId: detail.secretId, subscriptionId: detail.subscriptionId, tenantId: detail.tenantId, region: "east" };

        self.httpService.fetchData('post', url, function (response) {
            response = response.json();
            self.getConnect.emit();
            // self.azureAdd = true;
            // self.addDetail = true;
            self.addDetail = true;
            self.azureAdd = true;
            self.awsDetail = true;
            self.azureAddTextSet.emit(self.azureAdd);
            self.azureLoader = false;
            self.toastr.success("Azure account has been successfully added", null, { animate: 'fade', toastLife: 3000 });

            self.azureName = detail.name;
            self.getAzureAccountId();

        }, function (err) {
            err = err.json()
            console.log("Error in linking to Azure", err)
            if (err.data == 'EntityAlreadyExists') {
                self.toastr.error("Your Azure account already linked", null, { animate: 'fade', toastLife: 3000 })
            }
            else if ((err.data == 'SignatureDoesNotMatch' || err.data == 'InvalidClientTokenId')) {

                self.azureDetail.reset()

                self.toastr.error("Invalid credentials", null, { animate: 'fade', toastLife: 3000 })
            }
            else if (err.data === 'AccessDenied') {
                self.toastr.error("Azure account could not be linked. Please retry", null, { animate: 'fade', toastLife: 3000 })
            }
            else {
                self.toastr.error("Azure account could not be linked. Please retry", null, { animate: 'fade', toastLife: 3000 })
            }


        }, payload);

        //  this.toastr.success('Azure cloud account successfully added', null, { animate: 'fade', toastLife: 3000 });

    }


    onOpenPopUp() {
        this.unlinkPop = !this.unlinkPop;
    }

    onUnlink() {
        var currentUser = localStorage.getItem('azureAccountId');
        let payload = { scmId: currentUser }
        let url = "v1/azure/unlinkAccount";
        let self = this;
        self.httpService.fetchData('post', url, function (data) {
            data = data.json();
            // console.log(data);
            if (data && data.success == true) {
                self.disconnect.emit()
                self.toastr.success("Azure account unlinked successfully", null, { animate: 'fade', toastLife: 3000 });
                
                self.unlinkPop = !self.unlinkPop;
                self.awsDetail = false;
                self.addDetail = false;
                self.azureAddTextSet.emit(self.azureAdd = false);
                self.azureDetail.reset();
            }
            else {

                self.toastr.error("No active accounts found", null, { animate: 'fade', toastLife: 3000 });
            }

        }, function (err) {
            // console.log("Some Error", err);
            self.toastr.error("No active accounts found", null, { animate: 'fade', toastLife: 3000 });
        }, payload);

    }
    ngOnInit() {
        var self = this;
        this.azureDetail = this._formBuilder.group({
           name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9].*\\S.*[a-zA-z0-9_-]{1,200}")]],
           clientId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@+#$/%^=&*_-{ }( )].*\\S.*[a-zA-z0-9!@+#$/%^=&*_-{ }( )]{1,200}")]],
           secretId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@+#$/%^=&*_-{ }( )].*\\S.*[a-zA-z0-9!@+#$/%^=&*_-{ }( )]{1,200}")]],
           tenantId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@+#$/%^=&*_-{ }( )].*\\S.*[a-zA-z0-9!@+#$/%^=&*_-{ }( )]{1,200}")]],
           subscriptionId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9!@+#$/%^=&*_-{ }( )].*\\S.*[a-zA-z0-9!@+#$/%^=&*_-{ }( )]{1,200}")]]

        })
    }
}

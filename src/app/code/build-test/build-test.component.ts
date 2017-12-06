import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AceEditorComponent } from 'ng2-ace-editor';

//Componet dependencies
@Component({
    selector: 'build-test',
    templateUrl: './build-test.html',
    styleUrls: ['../../main.scss'],
    providers: [API, StoreService]
})

//Component logic container class

export class BuildTestComponent implements OnInit {
    @Output() buildClick: EventEmitter<any> = new EventEmitter<true>();
    @Output() createLinkRepo: EventEmitter<any> = new EventEmitter<true>();
    @ViewChild('editor') editor;
    contHeight: Number = (window.innerHeight - 190) - 58;
    onboardHeight: Number = ((window.innerHeight - 190) - 58) - 76;
    resWidth: Number = window.innerWidth - 75;
    resHeight: Number = window.innerHeight - 146;
    contWidth: Number;
    selectedCloud: any= "AWS";
    selectRepo: FormGroup;
    code: any;
    mode: any;
    config: any;
    codeEditorOptions: any;
    showModal: Boolean = false;
    showNoCloudPH: Boolean = false;
    showNoRepoPH: Boolean = false;
    disableDeployButton: Boolean = false;
    repoArray: Array<any> = [];
    cloudAccount: Array<any> = [];
    keyPairArray: Array<any> = [];
    actionId: String = "USER_DEVTEST_REPO_REQUEST";
    editorLoader: Boolean = false;
    commitSHA: any = false;
    dockerStatusBool: any = "Validating...";
    selectedRepository: String = '';
    dockerFileNotValid: Boolean = false;
    dockerExposePortNo: Number = null;
    constructor(private router: Router, private elem: ElementRef, public toastr: ToastsManager, private _formBuilder: FormBuilder, private storeService: StoreService, private httpService: API, ) {
    }

    public buildItem = [
        {
            period: '20-Nov-2016 10:00 PM',
            acname: 'aws-account',
            status: 'passed'
        },
        {
            period: '19-Nov-2016 10:00 PM',
            acname: 'azure-account',
            status: 'stopped'
        },
        {
            period: '18-Nov-2016 10:00 PM',
            acname: 'gsp-account',
            status: 'failed'
        },
        {
            period: '17-Nov-2016 10:00 PM',
            acname: 'aws-account',
            status: ''
        }
    ]
    onBoardClick() {
        this.router.navigate(['cloud-management']);
    }
    onCreateRepoClick() {
        this.createLinkRepo.emit();
    }
    selectRepository: Boolean = false;
    selectBuild: Boolean = true;
    selectIndex: Number;

    onDeployClick() {
        let self = this;
        self.disableDeployButton = true;
        let details = { "action_id": this.actionId, "keyName": this.selectRepo.controls['selectedKeyPair'].value, "repoUrl": this.selectRepo.controls['selectedRepo'].value.repoURL, "portNo": self.dockerExposePortNo }
        console.log("Result", details);
        self.httpService.fetchData('post', "v1/buildAndTest/callPushToQueue", function (data) {
            data = data.json();
            if (data.success === true) {
                console.log("Done!!!");
                self.toastr.info('Success:' + self.selectRepo.controls['selectedRepo'].value.name + ' build in progress', null, { animate: 'fade', toastLife: 3000 })
                self.disableDeployButton = false;
                self.buildClick.emit();
            }
            else {
                self.toastr.error('Error:', null, { animate: 'fade', toastLife: 3000 })
                self.disableDeployButton = false;
            }
        }, function (err) {
            console.log("Error sending deployment request", err);
            self.toastr.error('Error sending deployment request', null, { animate: 'fade', toastLife: 3000 })
        }, details);

        //this.router.navigate(['code']);
        this.selectIndex = 2;
        this.selectRepository = true;
        this.selectBuild = false;
    }
    editDockerCancel() {
        this.showModal = false;
        this.code = '';
    }

    showModalClick() {
        let self = this;
        self.editorLoader = true;
        self.code = '';
        self.fetchFileContent(null, function (err, data) {
            if (err) {
                self.editorLoader = false;
                self.code = "// Dockerfile content";
                self.showModal = true;
                console.log("Error fetching Dockerfile from Github", err);
                self.toastr.info('Dockerfile not found, please create one!', null, { animate: 'fade', toastLife: 3000 });
            } else if (data.data.content) {
                self.code = atob(data.data.content);
                self.commitSHA = data.data.sha;
            }
            else {
                self.code = "// Dockerfile content";
            }
            self.editorLoader = false;
            self.showModal = true;
        });
    }
    checkDockerStatus(repoName) {
        console.log("Printing whole object", repoName);
        console.log("Printing .value", repoName.name);
        let self = this;
        self.dockerStatusBool = "Validating...";
        self.disableDeployButton = true
        self.dockerFileNotValid = true
        self.fetchFileContent(repoName.name, function (err, data) {
            if (err) {
                self.dockerStatusBool = "N/A";
                self.disableDeployButton = true
                self.dockerFileNotValid = true
            } else if (data.data.content) {
                self.dockerValidator({ "dockerFile": data.data.content }, function (err, data) {
                    if (err) {
                        self.dockerStatusBool = "Failure";
                        self.disableDeployButton = true
                        self.dockerFileNotValid = true
                    } else {
                        self.dockerStatusBool = "Success";
                        self.disableDeployButton = false
                        self.dockerFileNotValid = false
                    }
                });
            } else {
                self.dockerStatusBool = "Failure";
                self.disableDeployButton = true
                self.dockerFileNotValid = true;
            }
        });
    }
    fetchFileContent(repo, callback) {
        let self = this;
        let url = "";
        console.log("Setected Repo:", self.selectRepo.controls['selectedRepo'].value.name);
        if (repo === null) {
            url = "v1/github/fetchFile" + "?repo=" + self.selectRepo.controls['selectedRepo'].value.name + "&path=" + "Dockerfile";
        } else if (repo) {
            url = "v1/github/fetchFile" + "?repo=" + repo + "&path=" + "Dockerfile";
        }
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            callback(null, data);

        }, function (err) {
            console.log("Error fetching Dockerfile from Github", err);
            callback(err);
        }, {});
    }

    editDockerVerify() {
        let self = this;
        let encodedCode = btoa(self.code);
        let payload = { "dockerFile": encodedCode };
        // console.log("payload", payload);
        self.dockerValidator(payload, function (err, result) {
            if (err) {
                self.toastr.error(err, null, { animate: 'fade', toastLife: 3000 });
            } else {
                self.toastr.success(result, null, { animate: 'fade', toastLife: 3000 });
            }
        })
    }

    editDockerApply() {
        let self = this;
        let encodedCode = btoa(self.code);
        let payload = { "dockerFile": encodedCode };
        let url = 'v1/github/createOrUpdateFile' + "?repo=" + self.selectRepo.controls['selectedRepo'].value.name + "&path=" + "Dockerfile";
        let body = { message: "Updated Dockerfile", content: encodedCode, sha: "" }
        if (self.commitSHA) {
            body.sha = self.commitSHA;
        }
        // console.log("payload", payload);
        self.dockerValidator(payload, function (err, result) {
            if (err) {
                self.toastr.error(err, null, { animate: 'fade', toastLife: 3000 });
            } else {
                self.httpService.fetchData('post', url, function (data) {
                    data = data.json()
                    if (data && data.success) {
                        console.log("Apply: " + data.data);
                        self.editDockerCancel();
                        self.toastr.success("Successfully updated Dockerfile", null, { animate: 'fade', toastLife: 3000 });
                        self.dockerStatusBool = "Success";
                        self.disableDeployButton = false;
                        self.dockerFileNotValid = false;
                    }
                }, function (err) {
                    err = err.json()
                    console.log("Error in doing post call", err);
                    self.toastr.success("Error sending the request", null, { animate: 'fade', toastLife: 3000 });
                }, body);
            }
        })
    }

    dockerValidator(payload, callback) {
        let self = this;
        console.log("SHA:", self.commitSHA);
        let url = 'v1/docker/lint';
        self.httpService.fetchData('post', url, function (data) {
            data = data.json()
            if (data && data.success && data.data.error.count > 0) {
                console.log(data.data);
                return callback('Error in docker file', null)
            } else if (data.success) {
                //Fetch Port No.  
                let dockerFileContent = atob(payload.dockerFile);
                console.log("fff",dockerFileContent)
                let expPosition = dockerFileContent.search(/EXPOSE/i) ;
                console.log("ddd",dockerFileContent.substring( expPosition+1, expPosition+12))
                let portNo = parseInt(dockerFileContent.substring( expPosition+1, expPosition+12).replace(/\D/g, ''));               
                if (portNo < 65536 && portNo > 1023)
                    self.dockerExposePortNo = portNo
                else
                    self.dockerExposePortNo = null;
                console.info("Found a PortNo in Docker File", self.dockerExposePortNo);
                return callback(null, 'Valid docker file')
            }
        }, function (err) {
            err = err.json()
            console.log("Error in doing post call", err);
            return callback('Error sending the request', null);
        }, payload);
    }

    loadUserRepos() {
        let self = this
        let pId = localStorage.getItem('pId');
        let url = 'v1/project/getProjectRepos/' + pId;
        //To check user connected with gitHub
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            console.log("Repos list", data)
            if (data.data.length > 0) {
                console.log("Done!!!");
                self.repoArray = data.data;
                self.showNoRepoPH = false;
                setTimeout(() => {
                // self.scmTool = self.scmArray[0]._id;
                self.selectRepo.controls['selectedRepo'].setValue(self.repoArray[0]); //Setting first Value as selected
            });
            }
            else {
                self.showNoRepoPH = true;
            }

        }, function (err) {
            console.log("Error Getting List of Repositories", err);
            //self.toastr.error('Error Getting List of Repositories', null, { animate: 'fade', toastLife: 3000 })
            self.showNoRepoPH = true;
        }, {});
    }

    loadUserCloudAccounts() {
        let self = this;
        const url = "v1/aws/get";
        self.httpService.fetchData('get', url, function (data) {
            data = data.json();
            if (data.data) {
                self.cloudAccount = data.data
                self.loadUserKeyPair();
            }
            else {
                console.log("No User Cloud Accounts")
                self.showNoCloudPH = true;
            }

        }, function (err) {
            console.log("Error Getting List of Cloud Accounts", err);
            //self.toastr.error('Error Getting List of Cloud Accounts', null, { animate: 'fade', toastLife: 3000 })
            self.showNoCloudPH = true;
        }, {});
    }

    loadUserKeyPair() {
        console.log("loadUserKeyPair");
        let self = this;
        const url = "v1/aws/get";
        self.httpService.fetchData('get', 'v1/aws/getAllKeyNames', function (data) {
            data = data.json();
            if (data.data) {
                self.keyPairArray = data.data;
                console.log(data.data);
                self.showNoCloudPH = false;
                setTimeout(() => {
                // self.scmTool = self.scmArray[0]._id;
                self.selectRepo.controls['selectedKeyPair'].setValue(self.keyPairArray[0].KeyName); //Setting first Value as selected
            });
            }
            else {
                self.showNoCloudPH = true;
            }
        }, function (err) {
            console.log("Error Getting List of KeyPairs", err);
            //self.toastr.error('Error Getting List of KeyPairs', null, { animate: 'fade', toastLife: 3000 })
            self.showNoCloudPH = true;
        }, {});
    }

    loadData() {
        let self = this
        console.log("Event triggered from child component");
        self.loadUserRepos();
        self.loadUserCloudAccounts();
    }

    ngOnInit() {
        let self = this;
        //this.selectRepo.reset();
        console.log("SHA:", self.commitSHA);
        self.commitSHA = false;
        self.editorLoader = false;
        self.code = "// Dockerfile content";
        // Check if Cloud Accont is Linked and any Repo Created ,Pull Key Details for DDL.
        // TODO: Ucomment next two lines
        self.loadUserRepos();
        self.loadUserCloudAccounts();
        //self.loadUserKeyPair();

        setTimeout(() => {
            self.contWidth = document.querySelector('.deploy-content-container').clientWidth - 1
            //var elem = self.elem.nativeElement.querySelector('#codeMirror')
            // var codeM = codeMirror.CodeMirror(elem);
        }, 1000)

        this.selectRepo = this._formBuilder.group({
            selectedRepo: ['', [Validators.required]],
            selectedCloud: ['', [Validators.required]],
            selectedKeyPair: ['', [Validators.required]]
        })
        // this.code = `// Some code...`;
        //this.mode = 'javascript';
        // this.editor.setMode('dockerfile');

        this.config = {
            lineNumbers: true,
            mode: {
                name: 'javascript',
                json: true
            }
        };
    }
}   
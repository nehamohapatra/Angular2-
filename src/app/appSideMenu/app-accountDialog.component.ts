import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef} from '@angular/material';

@Component({
    templateUrl: './app-accountDialog.html',
    styleUrls: ['../main.scss']
})

export class AppAccountDialogComponent {
    custAppDetail: FormGroup;

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

        enviroment = [
        { value: 'DEVELOPMENT', viewValue: 'Development' },
        { value: 'TEST', viewValue: 'Test' },
        { value: 'STAGE', viewValue: 'Stage' }
    ];

    constructor(private _formBuilder: FormBuilder,public dialogRef: MdDialogRef<AppAccountDialogComponent>){
                this.custAppDetail = this._formBuilder.group({
            archFileSource: ['', [Validators.required]],
            archFile: [{ value: '', disabled: true }, [Validators.required]],
            name: ['', [Validators.required]],
            cloudType: ['', [Validators.required]],
            selEnv: [{ value: '', disabled: true }, [Validators.required]]
        })
    }

    toNeoGit(event){
        const ctrl = this.custAppDetail.get('archFile');

          if (event) {
             ctrl.enable();
        }
    }

    toEnv(event){
        const env = this.custAppDetail.get('selEnv');

          if (event) {
             env.enable();
        }
    }

    submitDialogData(){
        this.dialogRef.close(this.custAppDetail);

    }

microServiceRefArch()
{
     
}

}

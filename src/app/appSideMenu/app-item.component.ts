import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-item',
    template: `
                <div class="relative flex-row mb20" style="padding: 10px; margin:20px; position: relative; width: 300px;height: 161px;border-radius: 2px;border: 1px solid rgba(51, 153, 102, 0.5);background-color: #ffffff;">
                   
                   <img src="{{item.img}}" class="aws-icon" /> {{item.text}}
                    <md-icon class="material-icons" (click)="removeSelection(i)" style="float:right;padding-right:10px">close</md-icon>


                    <div class="flex-container" fxLayout="row">
                        <div class="flex-item mt20" fxFlex="30%">
                            <div class="relative flex-row mb20">
                                <label> Name: </label>
                            </div>
                        </div>
                        <div class="flex-row">
                            
                                <md-input type="text" class="flex-row "  #arrayName (keyup)="arrayFillName(arrayName.value)">

                                </md-input>
                           
                        </div>
                    </div>



                    <div class="flex-container" fxLayout="row">
                        <div class="flex-item mt20" fxFlex="28%">
                            
                                <label> Enviroment: </label>
                            
                        </div>
                        <div class="flex-row">
                            <div class="flex-item mt20" >
                                <div class="project-input mb20">
                                    <md-select placeholder="Choose/Create" (change)="onChange()" class=" flex-row">
                                        <md-option *ngFor="let env of enviroment" [value]="env.value" #arrayEnv (click)="arrayFillEnv(arrayEnv.value)">
                                            {{ env.viewValue }}
                                        </md-option>
                                    </md-select>

                                </div>

                            </div>
                        </div>
                    </div>


                </div>
    
    `
})


export class AppItemCompoenent {
    @Input() item: any;
    @Input() index: any;

    @Output() onItemChange = new EventEmitter();
    @Input() enviroment = [
        { value: 'Development', viewValue: 'Development' },
        { value: 'Test', viewValue: 'Test' },
        { value: 'Staging', viewValue: 'Staging' }
    ];
    onChange() {
        this.onItemChange.emit({ "item": this.item, "index": this.index })
    }

    constructor() {

    }
}


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './user-management.html',
    styleUrls: ['../main.scss']
})

export class UserManagementComponent implements OnInit {
    flag: String = 'six';
    /*Layout Structure Width and Height start here*/
    resWidth: Number = window.innerWidth - 75;
    resHeight: Number = window.innerHeight - 145;
    userHeight: Number = window.innerHeight - 260;
    roleHeight: Number = window.innerHeight - 335;
    userIndex: Number;
    removeRole: Boolean = false;
    constructor(private router: Router) { }
    public roleItem = [
        {
            role: 'developer',
            email: 'xxx@companyname.com'
        },
        {
            role: 'admin',
            email: 'yyy@companyname.com'
        },
        {
            role: 'admin',
            email: 'aaa@companyname.com'
        },
        {
            role: 'developer',
            email: 'ccc@companyname.com'
        },
        {
            role: 'admin',
            email: 'mmm@companyname.com'
        },
        {
            role: 'developer',
            email: 'ppp@companyname.com'
        },
        {
            role: 'developer',
            email: 'vvv@companyname.com'
        }

    ]
    onRemoveRole() {
        this.removeRole = !this.removeRole;
    }
    ngOnInit() {
        var self = this;
        self.userIndex = 0;
    }
}
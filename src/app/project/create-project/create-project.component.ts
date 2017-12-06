import { Component, OnInit } from '@angular/core';
import { HeaderMenuComponent } from 'app/menu/header-menu/header-menu.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { API } from '../../http/http.service';
import { StoreService } from '../../services/store.service';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  templateUrl: './create-project.component.html',
  styleUrls: ['../../main.scss'],
  providers: [StoreService, API]
})
export class CreateProjectComponent implements OnInit {
  elemTop: number = 150;
  project: FormGroup;
  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private httpService: API,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute) {

  }

  onSubmit() {
    let url = "v1/project"
    let self = this;
    // const token = Cookie.get('token');
    const token = localStorage.getItem('token')
    self.httpService.fetchData('post', url, function (data) {

      data = data.json()
      if (data && data.success) {
        localStorage.setItem('pId', data.data._id);
        let projArr = [];
        projArr.push(data.data);
        var projArray = self.storeService.getStore('project').projectList;
        projArray.push(data.data)
        self.storeService.setStore('project', { id: data.data._id, projectList: projArray })
        self.router.navigate(['project-landing']);
      }

    }, function (err) {
      err = err.json()
      console.log(err)
    }, this.project.value);

  }
  ngOnInit() {
    var self = this;
    this.project = this._formBuilder.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectDetails: ['']
    })
    setTimeout(() => {
      const authWrap = document.getElementsByClassName('auth-wrap')[0]
      const fullHeight = window.innerHeight / 2
      const elemTop = fullHeight - authWrap.clientHeight / 2;
      self.elemTop = elemTop;
    })

    self.activatedRoute.queryParams.subscribe(
      (param: any) => {
        console.log("Query changed")
      });

  }
}

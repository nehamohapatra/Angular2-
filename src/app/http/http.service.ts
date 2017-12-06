import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs/Observable';

const appConfig = require('../../../appConfig.js');
// console.log(appConfig);

@Injectable()

export class API {
    constructor(private http: Http) {
    }
    apiPath: String = appConfig.baseUri;
    //token: String = Cookie.get('token')
    token:String = localStorage.getItem('token');

   //For multiple request at same time

    multiFetchData(data, success, error) {
        const headers = new Headers(
            {
                'Content-Type': 'application/json',
                'X-DFP-Token': this.token
            }
        )

        let url = this.apiPath;
        
        Observable.forkJoin(
            this.http.get(url+'v1/project/get', { headers: headers }).map((res: Response) => res.json()),
            this.http.get(url+'v1/project/get', { headers: headers }).map((res: Response) => res.json())
        ).toPromise().then(success).catch(error)
    }

    //For regular http call

    fetchData(method, url, success, error, param ={} ) {
        const headers = new Headers(
            {
                'Content-Type': 'application/json',
                'X-DFP-Token': this.token
            }
        )
        console.log(localStorage.getItem('token'));
        console.log(" bef URL:", url);
        url = this.apiPath + url;
        console.log(" after URL:", url);

        //let pid= Cookie.get('projectId');

        let pid = localStorage.getItem('pId');
        
        if(pid){
            url+= "?pId="+pid;
        }
        if (method == 'get'){
            if(Object.keys(param).length>0)
                url= url+ param["text"];

            var api = this.http.get(url, { headers: headers })
        }

        else if (method == 'post')
            var api = this.http.post(url, param, { headers: headers })

        else if (method == 'put')
            var api = this.http.post(url, param, { headers: headers })

        else if (method == 'delete')
            var api = this.http.delete(url, { headers: headers })

        api.toPromise()
            .then(success).catch(error)
    }

    //Upload a file

    uploadFile(method, url, success, error, param) {

        url = this.apiPath + url;

        const headers = new Headers(
            {
                "mimeType": "multipart/form-data",
                'X-DFP-Token': this.token
            }
        )
        if (method == 'get')
            var api = this.http.get(url, { headers: headers })

        else if (method == 'post')
            var api = this.http.post(url, param, { headers: headers })

        else if (method == 'put')
            var api = this.http.post(url, param, { headers: headers })

        else if (method == 'delete')
            var api = this.http.delete(url, { headers: headers })

        api.toPromise()
            .then(success).catch(error)
    }

}
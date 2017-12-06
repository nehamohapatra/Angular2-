import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StoreService } from './services/store.service';
import { API } from './http/http.service';
import { initializeApp, app } from 'firebase';
import * as fireApp from 'firebase';
// import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [API, StoreService]
})
export class AppComponent implements OnInit {
  constructor(public toastr: ToastsManager, public httpService: API, vRef: ViewContainerRef, private storeService: StoreService) {
    this.toastr.setRootViewContainerRef(vRef);
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyCmQ3jArhEzaXrROh18IShBUmJE2Yb9wCE",
      authDomain: "notifications-6ffed.firebaseapp.com",
      databaseURL: "https://notifications-6ffed.firebaseio.com",
      messagingSenderId: "57889306019"
    };    
    fireApp.initializeApp(config);    
  }

  ngOnInit() {
  
  }
}

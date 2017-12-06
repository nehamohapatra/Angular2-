import {Injectable} from '@angular/core';
import * as _ from 'lodash';

import {STORE} from './store.mock';

@Injectable()
export class StoreService {
    getStore(key){
        const calledObj = STORE[_.indexOf(STORE,_.find(STORE,{key:key}))]
        return calledObj
    }
    setStore(key,data){
       
        var dataObj = Object.assign(data,{key:key})
        var index = _.indexOf(STORE,_.find(STORE,{key:key}))
        if(index==-1)
            STORE.push(dataObj)
        else{
             var oldObj =STORE[index]
             var newObj = Object.assign(oldObj,dataObj)
             STORE[index] = newObj

        }
       
    }
    clearStore(){
        STORE.length = 0
        console.log(STORE)
    }
    
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: Array<any>, args?) {
    if (array) {
      // check if exclamation point 
      var index = 1;
      var value = args;
      if (args.charAt(0) == "!") {
        index = -1
        value = args.substring(1)
      }
        array.sort((a: any, b: any) => {
          if (a[value] < b[value]) {
            return -1*index;
          } else if (a[value] > b[value]) {
            return 1*index;
          } else {
            return 0;
          }
        });
          return array;
    }
    //
  }

}

import { Pipe, PipeTransform } from '@angular/core'
@Pipe({
    name: 'search'
})
export class InputFilter implements PipeTransform {
    transform(value, args) {
        if (!args) {
            return value;
           
        } else if (value) {
            return value.filter(item => {
                for (let key in item) {
                    if ((typeof item[key] === 'string' || item[key] instanceof String) &&
                        (item[key].toUpperCase().indexOf(args.toUpperCase()) !== -1)) {
                        return true
                    }
                }
            })
        }
    }
}
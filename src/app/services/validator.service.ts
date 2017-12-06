export class ValidationService {
     getValidatorErrorMessage(name, value) {
         var validatorName = name;
         var validatorValue = value
        if(validatorValue.length>8 && validatorValue.length <20){
            validatorName = ""
        }
        else
            validatorName = "Password lenght should be 8 to 20"

         name = validatorName
         console.log(name)
    }

    //Condition based validation'
    static conditional(conditional,validator){
        return function(control){
            revalidateOnChanges(control)
                if(control && control._parent){
                    if(conditional(control._parent)){
                        return validator(control)
                    }
                }
        }
    }

     
     passwordValidator(control) {
        // (?=.*?[A-Z])      - Assert a string has at least one capital letter
        // (?=(.*[a-z])      - Assert a string has at least one small letter
        // (?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s)   - Assert a string has at least one number and speacial character
        if (control.value.match(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,20}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
}
function revalidateOnChanges(control):void {
        if(control && control._parent && !control.revalidateOnChanges){
            control._revalidateOnChanges = true;
            control._parent 
                .valueChanges
                .distinctUntilChanged((a,b)=>{
                    if(a&&!b||!a&&b){
                        return false;
                    }else if(a && b && Object.keys(a).length !== Object.keys(b).length){
                        return false
                    }else if( a && b){
                        for(let i in a){
                            if(a[i] != b[i]){
                                return false;
                            }
                        }
                    }
                    return true
                }).subscribe(()=>{
                    control.updateValueAndValidity();
                })
                control.updateValueAndValidity
        }
        return;
    }
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';

export var options = new ToastOptions({
  animate: 'fade',
  positionClass: 'toast-top-center',
  toastLife:2000,
  maxShown:1
});
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrMessageService } from '../services/err_message/err-message.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService,private errorService: ErrMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
         .pipe(tap(event => {
               this.spinner.show();
                if (event.type === HttpEventType.Response) {
                    this.spinner.hide();
                    const url = event.url;
                    if(url && url.indexOf(environment.addToCartUrl) === -1){
                      // we don't want to handle add product as add product should show erp error
                        this.handleError(event.body);
                    }
                }
            }, (errorEvt) => {
                this.spinner.hide();
                /*
                const url = errorEvt.url;
                if(url && url.indexOf(environment.addToCartUrl) === -1){
                  // we don't want to handle add product as add product should show erp error
                  console.log('throwing error');
                  this.handleError(errorEvt.error);
                }*/
            }));
  }

  private handleError(payload: any){
    if(payload.errors && payload.errors.length > 0){
      // meaning whatever request we have made has thrown an error
      const errorCode = payload.errors[0].code;
      this.errorService.setData(errorCode);
    }
  }
}
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Location} from '@angular/common';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private location: Location) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do(
            event => {
                if (event instanceof HttpResponse) {
                }
            },
            error => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 200:
                            break;
                        case 401:
                            return location.href = '/login';
                        case 403:
                            return this.router.navigateByUrl('/applications');
                        case 500:
                            this.router.navigateByUrl('/500');
                            return error;
                        default:
                            break;
                    }
                }
            }
        );
    }
}

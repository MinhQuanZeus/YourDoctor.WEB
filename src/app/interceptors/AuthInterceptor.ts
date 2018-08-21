import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.cookieService.get( 'ACCESS_TOKEN' ) ? this.cookieService.get('ACCESS_TOKEN') : '';
        const authReq = req.clone({ headers: req.headers.set('Authorization', accessToken)});
        return next.handle(authReq);
    }
}

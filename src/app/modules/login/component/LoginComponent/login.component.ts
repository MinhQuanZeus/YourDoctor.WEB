import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
// import { AuthService } from '../../core/auth.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {User} from '../../../../models/User';
import {AuthServices, CommonServices} from '../../../../services';
import {CookieService} from 'ngx-cookie-service';
import {HttpErrorResponse} from '@angular/common/http';
import {Message} from '../../../../models';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    userForm: FormGroup;
    model = {
        phoneNumber: '',
        password: ''
    };

    constructor(private router: Router,
                private authService: AuthServices,
                private commonServices: CommonServices,
                private cookieService: CookieService,
                private spinner: NgxSpinnerService,
                private fb: FormBuilder) {
        this.cookieService.delete('ACCESS_TOKEN');
        this.cookieService.deleteAll();
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.userForm = this.fb.group({
            'phone': ['', [
                Validators.pattern('(09|01[2|6|8|9])+([0-9]{8})\\b'),
                Validators.required
            ]
            ],
            'password': ['', [
                Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})'),
                Validators.required
            ]
            ],
        });

        this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onValueChanged(data?: any) {

    }

    login() {
        if (this.userForm.valid) {
            this.loginFn();
        }
    }

    async loginFn(): Promise<any> {
        try {
            this.spinner.show();
            const response = await this.authService.login(this.model).toPromise();
            this.spinner.hide();
            const userInfo = response && response.user;
            const token = response && response.token;
            if (userInfo) {
                if (userInfo.role !== 3 && userInfo.role !== 4) {
                    this.commonServices.showFlashMessage(
                        new Message({id: new Date().getTime(), type: 'ERROR', content: 'Vui lòng đăng nhập bằng tài khoản admin'}));
                    return;
                }
                sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
            }
            if (token) {
                this.cookieService.set('ACCESS_TOKEN', token);
            }
            this.router.navigateByUrl('/admin');
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }
}


import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {USER_INFO_SESSION_STORAGE} from '../../../../constants';
import {User} from '../../../../models';
import {Subscription} from 'rxjs';
import {AuthServices, UserServices} from '../../../../services/index';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
    selector: 'cdk-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy {
    isOpen = false;

    Hari;


    @Input() currentUser = null;
    user = null;
    private subscriptions: Subscription[] = [];

    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (!targetElement) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.isOpen = false;
        }
    }


    constructor(private elementRef: ElementRef, userService: UserServices,
                private route: Router,
                private authenService: AuthServices, private cookieService: CookieService) {
        this.user = new User();
        userService.getMessageUpdateUserInfo().subscribe(data => {
            if (data) {
                this.getUserAvatar();
            }
        });
    }

    getUserAvatar() {
        const userInfo = sessionStorage.getItem(USER_INFO_SESSION_STORAGE);
        if (userInfo) {
            this.user = new User(JSON.parse(userInfo));
        }

    }


    ngOnInit() {
        this.getUserAvatar();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(obj => obj.unsubscribe());
    }

    onLogout() {
        this.cookieService.deleteAll();
        this.authenService.logOut();
        this.route.navigateByUrl('/login');
    }

}

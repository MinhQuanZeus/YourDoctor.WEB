import {Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {UserServices} from '../../../../services';
import {USER_INFO_SESSION_STORAGE} from '../../../../constants';
import {User} from '../../../../models';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']

})

export class MainComponent implements OnInit, OnChanges {
    @Input() isVisible = true;
    visibility = 'shown';

    sideNavOpened = true;
    matDrawerOpened = false;
    matDrawerShow = true;
    sideNavMode = 'side';
    user: any;
    sidenav2: any;

    ngOnChanges() {
        this.visibility = this.isVisible ? 'shown' : 'hidden';
    }

    constructor(private media: ObservableMedia, private userServices: UserServices) {
    }

    ngOnInit() {
        this.media.subscribe((mediaChange: MediaChange) => {
            this.toggleView();
        });
        const userInfo = sessionStorage.getItem(USER_INFO_SESSION_STORAGE);
        if (!userInfo) {
            this.getUserInfo();
        }
    }

    getRouteAnimation(outlet) {

        return outlet.activatedRouteData.animation;
    }

    toggleView() {
        if (this.media.isActive('gt-md')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = true;
            this.matDrawerOpened = false;
            this.matDrawerShow = true;
        } else if (this.media.isActive('gt-xs')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = false;
            this.matDrawerOpened = true;
            this.matDrawerShow = true;
        } else if (this.media.isActive('lt-sm')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = false;
            this.matDrawerShow = false;
        }
    }

    async getUserInfo(): Promise<any> {
        try {
            const response = await this.userServices.getUserInfo().toPromise();
            const userInfo = response && response.user;
            if (userInfo) {
                sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
                this.user = new User(userInfo);
                this.userServices.updateUserInfo('change');
            }
        } catch (e) {
            console.log(e);
        }
    }

    getUserAvatar() {
        const userInfo = sessionStorage.getItem(USER_INFO_SESSION_STORAGE);
        if (userInfo) {
            this.user = new User(JSON.parse(userInfo));
        }

    }


}

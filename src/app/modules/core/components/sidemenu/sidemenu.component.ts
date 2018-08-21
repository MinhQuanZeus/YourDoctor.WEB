import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {menus} from './menu-element';
import {USER_INFO_SESSION_STORAGE} from '../../../../constants/index';
import {User} from '../../../../models/index';
import {UserServices} from '../../../../services/index';

@Component({
  selector: 'cdk-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit, OnDestroy {

    @Input() iconOnly = false;
    public menus = menus;
    user: any;
    constructor(userService: UserServices) {
        userService.getMessageUpdateUserInfo().subscribe(data => {
            if (data) {
                this.getUserAvatar();
            }
        });
    }

    ngOnInit() {
        this.getUserAvatar();
    }

    getUserAvatar() {
        const userInfo = sessionStorage.getItem(USER_INFO_SESSION_STORAGE);
        if (userInfo) {
            this.user = new User(JSON.parse(userInfo));
        }

    }

    ngOnDestroy(): void {

    }

}

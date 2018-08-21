import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepicker, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {Message} from '../../../../models';
import {AuthServices, CommonServices} from '../../../../services';

@Component({
    selector: 'app-staff-register',
    templateUrl: 'staff-register.component.html',
    styleUrls: ['staff-register.component.scss']
})

export class StaffRegisterComponent {
    userForm: FormGroup;
    @ViewChild('dp3') datePicker: MatDatepicker<Date>;
    model = {
        phoneNumber: null,
        password: null,
        confirmPassword: null,
        firstName: null,
        middleName: null,
        lastName: null,
        birthday: null,
        role: 3,
        gender: 1,
        address: null,
    };
    avatar: File;
    currentTime = new Date().getTime();
    avatarSrc = '../../../../../assets/images/noavatar.png';

    constructor(private dialogRef: MatDialogRef<StaffRegisterComponent>,
                private authService: AuthServices, private commonService: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.userForm = this.fb.group({
            'phoneNumber': ['', [
                Validators.pattern('(09|01[2|6|8|9])+([0-9]{8})\\b'),
                Validators.required
            ],
            ],
            'firstName': ['', [
                Validators.maxLength(20),
                Validators.required
            ],
            ],
            'middleName': ['', [],
            ],
            'lastName': ['', [
                Validators.maxLength(20),
                Validators.required
            ],
            ],
            'password': ['', [
                Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})'),
                Validators.required
            ]
            ],
            'confirmPassword': ['', (c: FormControl) => {
                if (!c.value) {
                    return { required: { valid: false, value: c.value } };
                }
                const patt = new RegExp('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})');
                if (! patt.test(c.value)) {
                    return { pattern: { valid: false, value: c.value } };
                }
                if (this.model.password !== c.value) {
                    return { invalid_confirm: { valid: false, value: c.value } };
                }
            }
            ],
            'address': ['', []
            ],
            'birthday': ['', [
            ]
            ],
        });
    }

    keytab(event) {
        const element = event.srcElement.nextElementSibling; // get the sibling element
        if (element == null) {  // check if its null
            return;
        } else {
            element.focus();
        }   // focus if not null
    }

    onImageChange(event) {
        this.avatar = event && event.target && event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
        if (this.avatar) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarSrc = (<FileReader>e.target).result;
            };
            reader.readAsDataURL(this.avatar);
        }
    }

    onChangeGender(event) {
        this.model.gender = event;
    }

    openDatepicker() {
        this.datePicker.open();
    }

    public ok() {
        this.dialogRef.close('ok');
    }

    public cancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.userForm.valid) {
            const formData = new FormData();
            if (this.avatar) {
                formData.append('avatar', this.avatar);
            }
            formData.append('user', JSON.stringify(this.model));
            this.postAdmin(formData);
        }
    }

    async postAdmin(formdata): Promise<any> {
        try {
            const response = await this.authService.register(formdata).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonService.showFlashMessage(
                    new Message({ id: new Date().getTime(), type: 'SUCCESS', content: 'Đã thêm thành công ' + this.model.lastName }));
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({ id: new Date().getTime(), type: 'ERROR', content: error }));
            }
        }
    }

}

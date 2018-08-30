import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepicker, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {Message} from '../../../../models';
import {CommonServices, TypeAdvisoryServices} from '../../../../services';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-create-type-advisory',
    templateUrl: 'create-type-advisory.component.html',
    styleUrls: ['create-type-advisory.component.scss']
})

export class CreateTypeAdvisoryComponent {
    userForm: FormGroup;
    @ViewChild('dp3') datePicker: MatDatepicker<Date>;
    model = {
        name: null,
        type: 1,
        price: null,
        limitNumberRecords: null,
        description: null,
    };

    constructor(private dialogRef: MatDialogRef<CreateTypeAdvisoryComponent>,
                private spinner: NgxSpinnerService,
                private typeAdvisoryServices: TypeAdvisoryServices, private commonService: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.userForm = this.fb.group({
            'type': ['', [],
            ],
            'typeName': ['', [
                Validators.maxLength(100),
                Validators.required
            ],
            ],
            'price': ['', [],
            ],
            'limitNumberRecords': ['', [],
            ],
            'description': ['', [
                Validators.maxLength(4000)
            ]
            ]
        });
    }

    public ok() {
        this.dialogRef.close('ok');
    }

    public cancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.model.name = this.model.name ? this.model.name.trim() : '';
        this.model.description = this.model.description ? this.model.description.trim() : '';
        if ((this.userForm.controls['typeName'].valid && this.userForm.controls['price'].valid
            && this.userForm.controls['limitNumberRecords'].valid && this.model.type === 1) ||
            (this.userForm.controls['typeName'].valid && this.userForm.controls['price'].valid && this.model.type === 2)) {
            this.postType(this.model);
        }
    }

    onChangeType(type) {
        this.model.type = type;
    }

    async postType(data): Promise<any> {
        try {
            this.spinner.show();
            const response = await this.typeAdvisoryServices.createNewType(data).toPromise();
            this.spinner.hide();
            if (response) {
                this.dialogRef.close('ok');
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã thêm thành công ' + this.model.name}));
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}

import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepicker, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {Message, TypeAdvisory, User} from '../../../../models';
import {CommonServices, TypeAdvisoryServices} from '../../../../services';

@Component({
    selector: 'app-update-type-advisory',
    templateUrl: 'update-type-advisory.component.html',
    styleUrls: ['update-type-advisory.component.scss']
})

export class UpdateTypeAdvisoryComponent {
    userForm: FormGroup;
    @ViewChild('dp3') datePicker: MatDatepicker<Date>;
    model = {
        id: null,
        name: null,
        type: 1,
        price: null,
        limitNumberRecords: null,
        description: null,
    };

    typeAdvisory: TypeAdvisory;

    constructor(private dialogRef: MatDialogRef<UpdateTypeAdvisoryComponent>,
                private typeAdvisoryServices: TypeAdvisoryServices, private commonService: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.getTypeAdvisory(data.id);
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
            const response = await this.typeAdvisoryServices.editNewType(data).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã sửa thành công ' + this.model.name}));
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getTypeAdvisory(id) {
        try {
            const res = await this.typeAdvisoryServices.getById(id).toPromise();
            const userRes = res && res.objectAdvisory ? res.objectAdvisory : null;
            if (userRes) {
                this.typeAdvisory = new TypeAdvisory(userRes);
                this.model.id = this.typeAdvisory.id;
                this.model.type = this.typeAdvisory.type;
                this.model.name = this.typeAdvisory.name;
                this.model.price = userRes.price;
                this.model.limitNumberRecords = this.typeAdvisory.limitNumberRecords;
                this.model.description = this.typeAdvisory.description;
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}

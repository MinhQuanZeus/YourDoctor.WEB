import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {Message} from '../../../../models';
import {CommonServices, SpecialistServices} from '../../../../services';

@Component({
    selector: 'app-create-type-advisory',
    templateUrl: 'create-specialist.component.html',
    styleUrls: ['create-specialist.component.scss']
})

export class CreateSpecialistComponent {
    userForm: FormGroup;
    model = {
        name: null,
        description: null,
        listQuestion: null,
    };

    avatar: File;
    avatarSrc = '../../../../../assets/images/noavatar.png';

    constructor(private dialogRef: MatDialogRef<CreateSpecialistComponent>,
                private specialistServices: SpecialistServices, private commonService: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.userForm = this.fb.group({
            'specialistName': ['', [
                Validators.maxLength(100),
                Validators.required
            ],
            ],
            'listQuestion': ['', [],
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
        this.model.listQuestion = this.model.listQuestion ? this.model.listQuestion.trim() : '';
        if (this.userForm.valid) {
            const arrayQuestion = [];
            if (this.model.listQuestion) {
                const strArray: string[] = this.model.listQuestion.split('\n');
                if (strArray && strArray.length > 0) {
                    for (let i = 0; i < strArray.length; i++) {
                        const temp = strArray[i] ? strArray[i].trim() : '';
                        if (temp && temp.length > 0) {
                            arrayQuestion.push(temp);
                        }
                    }
                }
            }

            const data = {
                name: this.model.name,
                description: this.model.description,
                listQuestion: arrayQuestion
            };
            const formData = new FormData();
            if (this.avatar) {
                formData.append('image', this.avatar);
            }
            formData.append('specialist', JSON.stringify(data));
            this.postType(formData);
        }
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

    async postType(data): Promise<any> {
        try {
            const response = await this.specialistServices.create(data).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã thêm thành công ' + this.model.name}));
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}

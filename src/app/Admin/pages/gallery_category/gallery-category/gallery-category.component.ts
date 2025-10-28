import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Gallerycategory } from 'src/app/Modal/gallery_category';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-gallery-category',
  templateUrl: './gallery-category.component.html',
  styleUrls: ['./gallery-category.component.css'],
})
export class GalleryCategoryComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Gallerycategory;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  details: any = [];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}
  ngOnInit() {}
  close(): void {
    this.drawerClose();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean): void {
    var isOk = true;
    if (this.data.NAME == undefined || this.data.NAME.trim() == '') {
      this.message.error('Please Enter Name', '');
      isOk = false;
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateGallerycategory(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Gallery Category information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to update Gallery Category information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createGallerycategory(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Gallery Category information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Gallerycategory();
              this.api.getAllGallerycategory(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['count'] == 0) {
                    this.data.SEQUENCE_NO = 1;
                  } else {
                    this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
              // this.logtext = 'Save & New - OrgInfo form - SUCCESS - '+ JSON.stringify(this.data)+" KEYWORD [C - OrgInfo ]";
            }
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to add Gallery Category information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      }
    }
  }
}

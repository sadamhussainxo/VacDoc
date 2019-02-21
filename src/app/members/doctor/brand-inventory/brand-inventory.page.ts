import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BrandService } from 'src/app/services/brand.service';
import { ToastService } from 'src/app/shared/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brand-inventory',
  templateUrl: './brand-inventory.page.html',
  styleUrls: ['./brand-inventory.page.scss'],
})
export class BrandInventoryPage implements OnInit {

  brandInventory:any
  constructor(
    public loadingController: LoadingController,
    private storage: Storage,
    private brandService: BrandService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.storage.get(environment.DOCTOR_ID).then((val) => {
      this.getBrandInventory(val);
    })
  }

  async getBrandInventory(id) {

    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    await this.brandService.getBrandInventory(id).subscribe(
      res => {
        if (res.IsSuccess) {
          this.brandInventory = res.ResponseData;
          // this.fg.controls['Amount'].setValue(this.brandInventory.Amount);
          console.log(this.brandInventory);
          loading.dismiss();
        }
        else {
          loading.dismiss();
          this.toastService.create(res.Message, 'danger');
        }
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, 'danger');
      }
    )
  }
}
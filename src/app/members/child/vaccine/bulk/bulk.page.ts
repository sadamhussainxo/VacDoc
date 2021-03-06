import { Component, OnInit } from "@angular/core";
import { Route, ActivatedRoute, Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { BulkService } from "src/app/services/bulk.service";
import { ToastService } from "src/app/shared/toast.service";
import { FormBuilder, FormGroup , FormControl , Validators} from "@angular/forms";

import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-bulk",
  templateUrl: "./bulk.page.html",
  styleUrls: ["./bulk.page.scss"]
})
export class BulkPage implements OnInit {
  childId: any;
  doctorId: any;
  currentDate: any;
  currentDate1: any;
  bulkData: any;
  fg: FormGroup;
  todaydate: any;
  BrandIds = [] ;
  constructor(
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private bulkService: BulkService,
    private toastService: ToastService,
    private storage: Storage,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.storage.get(environment.DOCTOR_Id).then(val => {
      this.doctorId = val;
    });
    this.childId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.childId);

    this.currentDate = new Date(this.activatedRoute.snapshot.paramMap.get("childId"));
    this.currentDate1 = moment(this.currentDate).format("YYYY-MM-DD");
    this.todaydate = new Date();
    this.todaydate = moment(this.todaydate,'DD-MM-YYYY').format("YYYY-MM-DD");
    
    this.getBulk();
    this.fg = this.formBuilder.group({
      DoctorId: [""],
      Id: [null],
      Weight: [null],
      Height: [null],
      Circle: [null],
      BrandId0: [null],
      BrandId1: [null],
      BrandId2: [null],
      BrandId3: [null],
    //  BrandId: this.BrandId,
      GivenDate: this.currentDate
    });
  }

  async getBulk() {
    let data = { ChildId: this.childId, Date: this.currentDate};
    const loading = await this.loadingController.create({
      message: "Loading"
    });
    await loading.present();
    await this.bulkService.getBulk(data).subscribe(
      res => {
        if (res.IsSuccess) {
          this.bulkData = res.ResponseData;
          console.log(this.bulkData);
          // this.bulkData.forEach(element => {
          //   this.fg.addControl(
          //     element.Id ,
          //     new FormControl(element.Id, Validators.required)
          //   );
          // });
          // console.log(this.fg.value);
         
        } else {
          this.toastService.create(res.Message, "danger");
        }

        loading.dismiss();
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, "danger");
      }
    );
    
  }

  onSubmit() {
    var brands = [] ;
    var i = 0;
    this.bulkData.forEach(element => {
      if(this.BrandIds[i])
      brands.push({ BrandId: this.BrandIds[i], ScheduleId: element.Id });
      i++ ;
    }); 
    console.log(brands);
    let data = {
      Circle: this.fg.value.Circle,
      Date: this.fg.value.Date,
      DoctorId: this.doctorId,
      GivenDate: this.fg.value.GivenDate,
      Height: this.fg.value.Height,
      Weight: this.fg.value.Weight,
      IsDone: true,
      ScheduleBrands: brands,
      // ScheduleBrands: [
      //   { BrandId: "", ScheduleId: "" },
      //   { BrandId: "", ScheduleId: "" },
      //   { BrandId: "", ScheduleId: "" }
      // ],
     // Id: ""
     Id: this.bulkData[0].Id
    };
    // if (this.fg.value.BrandId0) {
    //   data.ScheduleBrands[0].ScheduleId = this.bulkData[0].Id;
    //   data.ScheduleBrands[0].BrandId = this.fg.value.BrandId0;
    //   data.Id = this.bulkData[0].Id;
    // }

    // if (this.fg.value.BrandId1) {
    //   data.ScheduleBrands[1].ScheduleId = this.bulkData[1].Id;
    //   data.ScheduleBrands[1].BrandId = this.fg.value.BrandId1;
    // }
    // if (this.fg.value.BrandId2) {
    //   data.ScheduleBrands[2].ScheduleId = this.bulkData[2].Id;
    //   data.ScheduleBrands[2].BrandId = this.fg.value.BrandId2;
    // }
    console.log(data);
    this.fillVaccine(data);
  }

  async fillVaccine(data) {
    console.log(this.fg.value.GivenDate);
    //this.fg.value
    data.GivenDate = moment(this.fg.value.GivenDate,"YYYY-MM-DD").format("DD-MM-YYYY");
    console.log(this.fg.value);
    const loading = await this.loadingController.create({
      message: "Loading"
    });

    await loading.present();
    await this.bulkService.updateVaccine(data).subscribe(
      res => {
        if (res.IsSuccess) {
          this.toastService.create("Succfully Update");
          this.router.navigate(["/members/child/vaccine/"+this.childId]);
          loading.dismiss();
        } else {
          loading.dismiss();
          this.toastService.create(res.Message, "danger");
        }
      },
      err => {
        loading.dismiss();
        this.toastService.create(err, "danger");
      }
    );
  }
}

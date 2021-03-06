import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InvoicePage } from './invoice.page';
import { Downloader} from '@ionic-native/downloader/ngx';

const routes: Routes = [
  {
    path: '',
    component: InvoicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [InvoicePage],
  providers: [ Downloader ]
})
export class InvoicePageModule {}

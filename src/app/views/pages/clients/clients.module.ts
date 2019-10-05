import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule , DatePipe } from '@angular/common';
// NgBootstrap
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
// import {HttpLoaderFactory} from '../../../app.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import { MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeApiService } from '../../../core/_base/layout';
import { NgxPermissionsModule } from 'ngx-permissions';
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatSlideToggleModule
} from '@angular/material';
import { environment } from '../../../../environments/environment';

import { ClientsComponent } from './clients.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { OverviewComponent } from './addedit/overview/overview.component';
import { CommentsComponent } from './addedit/comments/comments.component';

import { ClientsRoutingModule } from './clients-routing.module';
import { AddeditComponent } from './addedit/addedit.component';
import { ContactPersionComponent } from './addedit/contact-persion/contact-persion.component';
import { OrderComponent } from './addedit/order/order.component';
import { SpecialTourComponent } from './addedit/special-tour/special-tour.component';
import { ApplicationPipesModule } from './../application-pipes.module';

// import { OnlyNumberDirective } from './../../../directives/number.directive';
import { ExistingPersonComponent } from './addedit/contact-persion/existing-person/existing-person.component';
import { DataTablesModule } from 'angular-datatables';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ExistingOrderComponent } from './addedit/order/existing-order/existing-order.component';

import {NgxMaskModule} from 'ngx-mask'

import { NgxCurrencyModule } from "ngx-currency";

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true
};

@NgModule({
  imports: [
      MatDialogModule,
      CommonModule,
      HttpClientModule,
      PartialsModule,
      NgxPermissionsModule.forChild(),
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forChild(),
      MatButtonModule,
      MatMenuModule,
      MatSelectModule,
      MatInputModule,
      MatTableModule,
      MatAutocompleteModule,
      MatRadioModule,
      MatIconModule,
      MatNativeDateModule,
      MatProgressBarModule,
      MatDatepickerModule,
      MatCardModule,
      MatPaginatorModule,
      MatSortModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatTabsModule,
	  MatTooltipModule,
	  MatSlideToggleModule,
      NgbProgressbarModule,
      environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false
      }) : [],
      CommonModule,
      PartialsModule,
      CoreModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}
      }),
      NgbModule,
      ApplicationPipesModule,
    ClientsRoutingModule,
    DataTablesModule,
    Daterangepicker,
    NgxMaskModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
  declarations: [
    ClientsComponent,
    ClientsListComponent,
    OverviewComponent,
    AddeditComponent,
    CommentsComponent,
    ContactPersionComponent,
    OrderComponent,
    SpecialTourComponent,
    ExistingPersonComponent,
    ExistingOrderComponent
    // OnlyNumberDirective
  ]
})
export class ClientsModule { }

import { Component, OnInit , ViewChild } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';

import { CompaniesService } from './../companies.service';

import { OverviewComponent } from './overview/overview.component';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslationService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  @ViewChild(OverviewComponent ) overview: OverviewComponent ;
  @ViewChild(BankingComponent ) bankComp: BankingComponent ;
  @ViewChild(InvoiceComponent ) invoiceComp: InvoiceComponent ;

  companyId : any ;

  basicData : any ;
  bankingData : any ;
  invoiceData :any ;
  isDisabled = true;

  constructor(private companiesService : CompaniesService, private route: ActivatedRoute,
    private translate: TranslateService, private transServ : TranslationService,
    public router: Router,) {

      let current_lng = this.transServ.getSelectedLanguage();
      this.translate.use(current_lng);

    }

  ngOnInit() {
    const allParams = this.route.snapshot.params;
    console.log(allParams);

    if(allParams){
      if(allParams.companyId !==undefined )  this.companyId = allParams.companyId;
    }


    if(this.companyId && this.companyId >0){
      this.clientDetails();
    }

  }

  response : any ;

  clientDetails(){
      this.companiesService.getCompaniesDetails({companyId : this.companyId}).subscribe(result => {
          // this.router.navigate([`clients`]);
          this.response = result.data;
          this.basicData = this.response.basicData;
          this.bankingData = this.response.bankingData;
          this.invoiceData = this.response.invoiceData;
          // console.log(this.bankingData);

      });

  }

  submitFrm(){
    let basicData = this.overview.formData();
    let bankingData = this.bankComp.formData();
    let invoiceData =  this.invoiceComp.formData();
    console.log(basicData);
    console.log(bankingData);
    console.log(invoiceData);
    // console.log(tourData);
    // console.log(specialtourData);

    if(basicData!==false && bankingData!==false && invoiceData!==false){

      let sendData = { 'basicData' : basicData , 'bankingData' : bankingData, 'invoiceData' : invoiceData };

      // console.log(sendData);
      this.companiesService.addeditCompanies(sendData).subscribe(data => {
          this.router.navigate([`companies`]);
      });

    }
  }

  cancel(){
	this.overview.ngOnInit();
	this.bankComp.ngOnInit();
	this.invoiceComp.ngOnInit();
  }

  setDisableStatus(isDisabled: boolean){
	  this.isDisabled = isDisabled;
  }
}

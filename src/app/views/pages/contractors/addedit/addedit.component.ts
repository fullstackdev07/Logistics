import { Component, OnInit , ViewChild } from '@angular/core';

import { ContractorsService } from './../contractors.service';


import { OverviewComponent } from './overview/overview.component';
import { CommentsComponent } from './comments/comments.component';
import { ContactPersonComponent } from './contact-person/contact-person.component';
import {OrderComponent} from './order/order.component';
import { SpecialTourComponent } from './special-tour/special-tour.component';

import { ActivatedRoute, Router } from '@angular/router';


import { TranslationService } from '../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  contractorId : any = 0;

  @ViewChild(OverviewComponent ) overview: OverviewComponent ;
  @ViewChild(ContactPersonComponent ) persionComp: ContactPersonComponent ;
  @ViewChild(CommentsComponent ) commentComp: CommentsComponent ;
  @ViewChild(OrderComponent ) orderComp:OrderComponent;
  @ViewChild(SpecialTourComponent ) specialtourComp: SpecialTourComponent ;

  basicData : any ;
  persionList : any;
  comments : any ;
  tourList :any ;
  specialtourData : any;

  personIdsList : any ;

  isDisabled = true;



  constructor( private route: ActivatedRoute, private contractorsService : ContractorsService,
    public router: Router,
    private translate: TranslateService, private transServ : TranslationService
    ) {

      let current_lng = this.transServ.getSelectedLanguage();
		  this.translate.use(current_lng);

    }

  ngOnInit() {
    const allParams = this.route.snapshot.params;
    // console.log(allParams);

    if(allParams){
      if(allParams.contractorId !==undefined )  this.contractorId = allParams.contractorId;
    }


    if(this.contractorId && this.contractorId >0){
      this.contractorDetails();
    }

  }

  response : any ;

  contractorDetails(){
      this.contractorsService.getContractorDetails({contractorId : this.contractorId}).subscribe(result => {
          // this.router.navigate([`clients`]);
          this.response = result.data;
          this.basicData = this.response.basicData;
          this.comments = this.basicData.comment;
          this.personIdsList = this.response.personIdsList;;
          this.tourList = this.response.tourList;
          this.specialtourData = this.response.specialtourData[0];
      });

  }


  submitFrm(){
    let basicData = this.overview.formData();
    let cotractorPersonData = this.persionComp.getContractorPersonData();

    let persionList = []; let deleteContractorPersons = [];
    if(cotractorPersonData!==undefined){
      persionList = cotractorPersonData.newPersonIds;
      deleteContractorPersons  = cotractorPersonData.deleteContractorPersons;
    }

    let comments =  this.commentComp.getComment();
    let contractorOrderData =  this.orderComp.getContractorOrderData();

    let orderDataList = []; let deleteContractorOrders = [];
    if(contractorOrderData!==undefined){
      orderDataList = contractorOrderData.newOrderIds;
      deleteContractorOrders  = contractorOrderData.deleteContractorOrders;
    }

    let specialorderData =  this.specialtourComp.getSpecialtour();


    // console.log(basicData);
    // console.log(persionList);
    // console.log(comments);
    // console.log(tourData);

    if(basicData!==false ){

      let sendData = { 'basicData' : basicData , 'persionList' : persionList, 'deleteContractorPersons' : deleteContractorPersons, 'comment' : comments.comment, 'orderDataList' : orderDataList, 'deleteContractorOrders' : deleteContractorOrders,   'specialorderData' : specialorderData  };

      this.contractorsService.addeditContractor(sendData).subscribe(data => {
          this.router.navigate([`contractors`]);
      });

    }


  }

  cancel(){
	this.overview.ngOnInit();
	this.commentComp.ngOnInit();
	this.specialtourComp.ngOnInit();
  }

  setDisableStatus(isDisabled: boolean){
	  this.isDisabled = isDisabled;
  }

}

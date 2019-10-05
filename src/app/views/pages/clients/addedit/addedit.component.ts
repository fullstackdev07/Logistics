import { Component, OnInit , ViewChild } from '@angular/core';
import { OverviewComponent } from './overview/overview.component';
import { TranslateService } from '@ngx-translate/core';

import { ClientsService } from './../clients.service';

import { CommentsComponent } from './comments/comments.component';
import { ContactPersionComponent } from './contact-persion/contact-persion.component';
import { OrderComponent } from './order/order.component';
import { SpecialTourComponent } from './special-tour/special-tour.component';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslationService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  @ViewChild(OverviewComponent ) overview: OverviewComponent ;
  @ViewChild(ContactPersionComponent ) persionComp: ContactPersionComponent ;
  @ViewChild(CommentsComponent ) commentComp: CommentsComponent ;
  @ViewChild(OrderComponent ) orderComp: OrderComponent ;
  @ViewChild(SpecialTourComponent ) specialtourComp: SpecialTourComponent ;


  clientId : any ;

  basicData : any ;
  presonIdsList : any;
  comments : any ;
  orderIdsList :any ;
  specialorderData : any;
  isDisabled = true;


  constructor(private clientservice : ClientsService, private route: ActivatedRoute,
    private translate: TranslateService, private transServ : TranslationService,
    public router: Router,) {

      let current_lng = this.transServ.getSelectedLanguage();
      this.translate.use(current_lng);

    }

  ngOnInit() {
    const allParams = this.route.snapshot.params;
    console.log(allParams);
    if(allParams){
      if(allParams.clientId !==undefined )  this.clientId = allParams.clientId;
    }


    if(this.clientId && this.clientId >0){
      this.clientDetails();
	}
  }

  response : any ;

  clientDetails(){
      this.clientservice.getClientDetails({clientId : this.clientId}).subscribe(result => {
          // this.router.navigate([`clients`]);
          this.response = result.data;
          this.basicData = this.response.basicData;
          this.comments = this.basicData.comment;
          this.presonIdsList = this.response.presonIdsList;
          this.orderIdsList = this.response.tourList;
          this.specialorderData = this.response.specialtourData[0];

          // console.log(this.basicData);

      });

  }

  submitFrm(){
    let basicData = this.overview.formData();
    let contractFiles = this.overview.getContractFiles();
    let clientPersonData = this.persionComp.getClientPersonData();
    let persionList :any = []; let deleteClientPersons : any = [];
    if(clientPersonData!==undefined){
      persionList = clientPersonData.newPersonIds;
      deleteClientPersons  = clientPersonData.deleteClientPersons;
    }

    let comments : any =  this.commentComp.getComment();
    let clientOrderData : any =  this.orderComp.getClientOrderData();

    let orderDataList :any  = []; let deleteClientOrders : any = [];
    if(clientOrderData!==undefined){
      orderDataList = clientOrderData.newOrderIds;
      deleteClientOrders  = clientOrderData.deleteClientOrders;
    }

    let specialorderData =  this.specialtourComp.getSpecialtour();

    // console.log(specialtourData);

    let formData = new FormData();

    if(basicData!==false && comments!==false && specialorderData!==false){
      let sendData = { 'basicData' : basicData , 'persionList' : persionList, 'deleteClientPersons' : deleteClientPersons, 'comment' : comments.comment, 'orderDataList' : orderDataList, 'deleteClientOrders' : deleteClientOrders,  'specialorderData' : specialorderData  };

      if(contractFiles){
        const file: File = contractFiles[0];
        formData.append("contractFiles", file, file.name);
      }


      // console.log(sendData);

      formData.append('basicData' , JSON.stringify(basicData));
      formData.append('persionList' , JSON.stringify(persionList));
      formData.append('deleteClientPersons' , JSON.stringify(deleteClientPersons));
      formData.append('comment' , comments.comment);
      formData.append('orderDataList' , JSON.stringify(orderDataList));
      formData.append('deleteClientOrders' , JSON.stringify(deleteClientOrders));
      formData.append('specialorderData' , JSON.stringify(specialorderData));

      this.clientservice.addeditClient(formData).subscribe(data => {



          this.router.navigate([`clients`]);
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

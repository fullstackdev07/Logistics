import { Component, OnInit , ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { OrderService } from './../order.service';

import { CommonService } from './../../../../services/common.service'
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import * as $ from 'jquery';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  public tourFrm: FormGroup;
  ordersId : any;
  
  @ViewChild(DaterangePickerComponent)
	public date_of_expiryPicker: DaterangePickerComponent;	
	public valid_from: DaterangePickerComponent;
  public dayPicker: DaterangePickerComponent;

  public contractor_valid_from: DaterangePickerComponent;
  public contractor_date_of_expiry: DaterangePickerComponent;

  client_price : any = 0;
  orderTypeList : any = [];
  priceBasisList : any = [];

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
    private languageService: LanguageService ,
    private transServ : TranslationService,
    private orderService : OrderService, private commonService : CommonService
    ) {
      
      let current_lng = this.transServ.getSelectedLanguage();	
      this.translate.use(current_lng);

      const allParams = this.route.snapshot.params;
      // console.log(allParams);

      if(allParams){
        if(allParams.ordersId !==undefined )  {
          this.ordersId = allParams.ordersId;
          
          if(this.ordersId && this.ordersId >0){
            this.tourDetails();
          }

        }
        else{
          this.newNumber();
        }
      }
      
      this.translate.get(['priceBasisList' , 'orderTypeList']).subscribe(res=> {
        this.priceBasisList = res['priceBasisList'];
        this.orderTypeList = res['orderTypeList'];
      });
	}

  ngOnInit() {

    this.tourFrm = this.fb.group({
			'ordersId' : [''],
			'order_number': ['' , Validators.required],
			'description': ['' , Validators.required],
			'customer': ['' , Validators.required],
      'client_price' : ['' , Validators.required],
      'price_basis' : ['', Validators.required],
      'day' : ['', Validators.required],
      'valid_from' : ['', Validators.required],
      'date_of_expiry' : ['', Validators.required],
      'order_type' : ['', Validators.required],
      'contractor' : [''],
      'contractor_valid_from' : [''],
      'contractor_date_of_expiry' : [''],
      'contractor_price_week' : [''],
      'contractor_price_weekend' : [''],
      'comment' : ['']

    });

		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
    this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();

    this.contractor_valid_from = this.commonService.dateRancePickerOptions();
    this.contractor_date_of_expiry = this.commonService.dateRancePickerOptions();

    
    
  }


  response : any;
  tourDetails(){
    this.orderService.getOrderDetails({ordersId : this.ordersId}).subscribe(result => {
        this.response = result.data;  
        // console.log(this.response);
          
        if(this.response){


          this.tourFrm.controls[`ordersId`].setValue(this.response.ordersId);
          this.tourFrm.controls[`order_number`].setValue(this.response.order_number);
          // this.tourFrm.controls[`surname`].setValue(this.response.surname);
          this.tourFrm.controls[`description`].setValue(this.response.description);
          this.tourFrm.controls[`customer`].setValue(this.response.customer);
          this.tourFrm.controls[`client_price`].setValue(this.response.client_price);
          this.tourFrm.controls[`price_basis`].setValue(this.response.price_basis);
          this.tourFrm.controls[`day`].setValue(this.response.day);
          this.tourFrm.controls[`valid_from`].setValue(this.response.valid_from);
          this.tourFrm.controls[`date_of_expiry`].setValue(this.response.date_of_expiry);
          this.tourFrm.controls[`order_type`].setValue(this.response.order_type);
          this.tourFrm.controls[`contractor`].setValue(this.response.contractor);
          this.tourFrm.controls[`contractor_valid_from`].setValue(this.response.contractor_valid_from);
          this.tourFrm.controls[`contractor_date_of_expiry`].setValue(this.response.contractor_date_of_expiry);
          this.tourFrm.controls[`contractor_price_week`].setValue(this.response.contractor_price_week);
          this.tourFrm.controls[`contractor_price_weekend`].setValue(this.response.contractor_price_weekend);
          this.tourFrm.controls[`comment`].setValue(this.response.comment);


        }    
    });
  }

  submitFrm(){
    
    $("#toursFrm").addClass("validateFrm");

    if(this.tourFrm.valid){

      let fromData = this.tourFrm.value;

      // console.log(fromData);
      
      this.orderService.addeditOrder(fromData).subscribe(data => {
          this.router.navigate([`orders`]);
      });

    }
  
  }

  newNumber(){
		this.orderService.getNewOrderNo().subscribe(result => {
			this.tourFrm.controls[`order_number`].setValue(result.newordersId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		})
  }
  

  date_of_expiryPickerSelect(value: any, datepicker?: any){

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`date_of_expiry`].setValue(date_of_expiry);

	}

	valid_fromSelect(value: any, datepicker?: any){

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`valid_from`].setValue(valid_from);
		
	}
	dayPickerSelect(value: any, datepicker?: any){
		let start = value.start;
		let day = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`day`].setValue(day);
  }

  contractor_valid_fromPickerSelect(value: any, datepicker?: any){
		let start = value.start;
		let contractor_valid_from = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`contractor_valid_from`].setValue(contractor_valid_from);
  }

  contractor_date_of_expiryPickerSelect(value: any, datepicker?: any){
		let start = value.start;
		let contractor_date_of_expiry = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.tourFrm.controls[`contractor_date_of_expiry`].setValue(contractor_date_of_expiry);
  }
  
}

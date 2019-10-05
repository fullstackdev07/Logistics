import { Component, OnInit, Input, ViewChild, EventEmitter, Output , ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ClientsService } from '../../../clients/clients.service';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../../services/lang.service';

import { TranslationService } from '../../../../../core/_base/layout';
import { DateServicesService } from './../../../../../services/date-services.service'




import { CommonService } from './../../../../../services/common.service';

import * as $ from 'jquery';

import { DaterangePickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'kt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {


	@ViewChild(DaterangePickerComponent)
	public contract_start_date: DaterangePickerComponent;
	public contract_end_date: DaterangePickerComponent;



	public overviewData: FormGroup;

	@Input() basicData;

	@Output() changeFormData = new EventEmitter<boolean>();


	constructor(private route: ActivatedRoute,
				public router: Router, private fb: FormBuilder,
				private translate: TranslateService, private transServ : TranslationService ,
				private languageService: LanguageService , private cd: ChangeDetectorRef,  private clientsServices : ClientsService,
				private dateServicesService : DateServicesService , private commonService : CommonService) {

					let current_lng = this.transServ.getSelectedLanguage();
					this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;
		if(allParams){
			if(allParams.clientId ===undefined || allParams.clientId===null )  this.newNumber();
		}

	}


	newclientId : any = 1;


	currencyList : any = [];
	rechRhythmLust : any = [];
	zahlRhythmList : any = [];
	terminationTimeList : any = [];
	stateList : any = [];


	termination_time_value_show : any =  false;
	ustr_mandatory_disabled = true;


  currentDate : any ;
  ngOnInit() {

	// console.log(this.basicData);

	this.currentDate = new Date();


	this.changeFormData.emit(true);
	this.overviewData = this.fb.group({
		'clientId' : [],
		'clientNumber': [this.newclientId , Validators.required],
		'name1': ['' , Validators.required],
		'name2': ['' , Validators.required],
		'street' : ['' , Validators.required],
		'zipcode': ['' , Validators.required],
		'city': ['' , Validators.required],
		'state': ['' , Validators.required],
		'phone1': ['' , Validators.required],
		'phone2': ['' , Validators.required],
		'mobile': ['' , Validators.required],
		'fax': ['' , Validators.required],
		'email': ['' , Validators.required],
		'rech_rhythm': ['' , Validators.required],
		'zahl_rhythm': ['' , Validators.required],
		'contract_start_date': ['' , Validators.required],
		'contract_end_date': ['' , Validators.required],
		'contractpost': ['' , Validators.required],
		'termination_time': ['' , Validators.required],
		"termination_time_value" :[''],
		'billed': ['' , Validators.required],
		'tax_identification_number': ['' , Validators.required],
		'bank': ['' , Validators.required],
		'iban': ['' , Validators.required],
		'bic': ['' , Validators.required],
		'national_tax_number': ['' , Validators.required],
		'ustr_mandatory': [''],
		"ustr_mandatory_value" : [''],
		'currency': ['' , Validators.required],
		'vendor_number' : ['' ,  Validators.required]
	  });


	this.contract_start_date = this.commonService.dateRancePickerOptions();
	this.contract_end_date = this.commonService.dateRancePickerOptions();

	this.overviewData.valueChanges.subscribe(val => {
		if(val.name1 !== "" ||
			val.name2 !== "" ||
			val.street !== "" ||
			val.zipcode !== "" ||
			val.phone1 !== "" ||
			val.phone2 !== "" ||
			val.mobile !== "" ||
			val.fax !== "" ||
			val.email !== "" ||
			val.rech_rhythm !== "" ||
			val.zahl_rhythm !== "" ||
			val.contract_start_date !== "" ||
			val.contractpost !== "" ||
			val.termination_time !== "" ||
			val.termination_time_value !== "" ||
			val.state !== "" ||
			val.billed !== "" ||
			val.sales_tax_identification_number !== "" ||
			val.bank !== "" ||
			val.iban !== "" ||
			val.str_no !== "" ||
			val.bic !== "" ||
			val.ustr_mandatory !== "" ||
			val.ustr_mandatory_value !== "" ||
			val.currency !== "" ||
			val.vendor_number !== ""){
				this.changeFormData.emit(false);
			}else {
				this.changeFormData.emit(true);
			}
	});

	//   console.log(this.overviewData.value);



	this.currencyList = this.commonService.getCurrency();
	this.rechRhythmLust = this.commonService.getRechRhythm();
	this.zahlRhythmList = this.commonService.getZahlRhythm();
	this.terminationTimeList = this.commonService.terminationTime();
	this.commonService.getStateList().subscribe(result => {
		if(result){
			this.stateList = result.data;
		}
	});
  }

  ngOnChanges() {
	if(this.basicData && this.basicData!==undefined){

		for (var key in this.basicData) {
			if (this.basicData.hasOwnProperty(key) && key !=='status' && key !=='comment' && key !=='created_time' && key !=='updated_time'  && key !=='contract_file' ) {
				// console.log(key);
				let value = (this.basicData[key] && this.basicData[key]!=undefined && this.basicData[key]!==null) ? this.basicData[key] : '';
				if(key === 'ustr_mandatory'){
					if(value==1) this.ustr_mandatory_disabled = false;
					this.overviewData.controls[`${key}`].setValue(value);
				}
				else if(key ==='termination_time'){
					if(value=='Sonstige') this.termination_time_value_show = true;
					this.overviewData.controls[`${key}`].setValue(value);
				}
				else{
					this.overviewData.controls[`${key}`].setValue(value);
				}


				// console.log(key + " -> " + data[key]);
			}
		}

	}

  }

  newNumber(){
	this.clientsServices.getNewClientNo().subscribe(result => {
		this.overviewData.controls[`clientNumber`].setValue(result.newclientId);
		// this.newclientId = result.newclientId;
		this.cd.markForCheck();
	})
  }

  formData(){
	$("#overviewFrm").addClass("validateFrm");

    if(this.overviewData.valid){
		// console.log(this.overviewData.value);

		return this.overviewData.value;

	}else{
		return false;
	}

  }


  changeTerminationTime($event){
	this.termination_time_value_show = false;
	  if($event && $event.target.value!==undefined && $event.target.value!==""){
		  if($event.target.value==="Sonstige"){
			this.termination_time_value_show = true;
		  }else{
			this.overviewData.controls['termination_time_value'].setValue('');
		  }
	  }
	// console.log($event);
  }


  changeuStrMandatory(){
	this.ustr_mandatory_disabled = !this.ustr_mandatory_disabled;
  }


  contract_start_dateSelect(value: any, datepicker?: any){

		let start = value.start;
		let contract_start_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.overviewData.controls[`contract_start_date`].setValue(contract_start_date);

  }

  	contract_end_dateSelect(value: any, datepicker?: any){

		let start = value.start;
		let contract_end_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.overviewData.controls[`contract_end_date`].setValue(contract_end_date);

	}

	uploadedFiles : any;
	fileChange(element) {
		this.uploadedFiles = element.target.files;
	}

	getContractFiles(){
		return this.uploadedFiles;
	}

}

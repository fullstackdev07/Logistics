import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, FormControl,  Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../../services/lang.service';
import { TranslationService } from '../../../../../core/_base/layout';

import { ContractorsService } from './../../contractors.service';
import { CommonService } from './../../../../../services/common.service'

import { DaterangePickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'kt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

	public overviewData: FormGroup;

	@Input() basicData;


	@ViewChild(DaterangePickerComponent)
	public contract_start_date: DaterangePickerComponent;
	public contract_end_date: DaterangePickerComponent;
	public commercial_date : DaterangePickerComponent;

	@Output() changeFormData = new EventEmitter<boolean>();


	constructor(private route: ActivatedRoute,
				public router: Router, private fb: FormBuilder,
				private translate: TranslateService,
				private transServ : TranslationService , private contractorsService : ContractorsService
				, private commonService : CommonService ) {
					let current_lng = this.transServ.getSelectedLanguage();
					this.translate.use(current_lng);
	}


	currencyList : any = [];
	rechRhythmLust : any = [];
	zahlRhythmList : any = [];
	terminationTimeList : any = [];
	stateList : any = [];


	termination_time_value_show : any =  false;
	ustr_mandatory_disabled = true;
	payment_stop_box : any = false;
	paymentstopList : any = [];
    ngOnInit() {

		// console.log(this.basicData);


		// this.paymentstopList = this.commonService.paymentstopList()

		this.changeFormData.emit(true);
		this.overviewData = this.fb.group({
			'contractorId' : [''],
			'contractor_number': ['' , Validators.required],
			'name1': ['' , Validators.required],
			'name2': ['' , Validators.required],
			'street' : ['' , Validators.required],
			'zipcode': ['' , Validators.required],
			'city': ['' , Validators.required],
			'phone1': ['' , Validators.required],
			'phone2': ['' , Validators.required],
			'mobile': ['' , Validators.required],
			'fax': ['' , Validators.required],
			'email': ['' , Validators.required],
			'rech_rhythm': ['' , Validators.required],
			'zahl_rhythm': ['' , Validators.required],
			'contract_start_date': ['' , Validators.required],
			'contract_end_date': ['' , Validators.required],
			'termination_time': ['' , Validators.required],
			"termination_time_value" :[''],
			'state': ['' , Validators.required],
			'billed': ['' , Validators.required],
			'debit_position' : ['' , Validators.required],
			'tax_identification_number': ['' , Validators.required],
			'bank': ['' , Validators.required],
			'iban': ['' , Validators.required],
			'bic': ['' , Validators.required],
			'national_tax_number': ['' , Validators.required],
			'ustr_mandatory': ['' , Validators.required],
			"ustr_mandatory_value" : [''],
			'fuel_surcharge' : ['' , Validators.required],
			'commercial_date' : ['' , Validators.required],
			'currency': ['' , Validators.required],
			'contract_ok' : ['' , Validators.required],
			'payment_block' : [''],
			'payment_stop' : [''],
			'bankaccount_liquidator' :[''],
			'account_holder' :[''],
			'payment_stop_iban' : [''],
			'payment_stop_bic' : [''],
			'payment_stop_bank_name' : ['']
		});

		this.contract_start_date = this.commonService.dateRancePickerOptions();
		this.contract_end_date = this.commonService.dateRancePickerOptions();
		this.commercial_date = this.commonService.dateRancePickerOptions();

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
				val.contractStart !== "" ||
				val.contractpost !== "" ||
				val.termination_time !== "" ||
				val.termination_time_value !== "" ||
				val.state !== "" ||
				val.billed !== "" ||
				val.debit_position !== "" ||
				val.sales_tax_identification_number !== "" ||
				val.bank !== "" ||
				val.iban !== "" ||
				val.str_no !== "" ||
				val.bic !== "" ||
				val.ustr_mandatory !== "" ||
				val.ustr_mandatory_value !== "" ||
				val.commercial_date !== "" ||
				val.fuel_surcharge !== "" ||
				val.currency !== "" ||
				val.contract_ok !== "" ||
				val.payment_block !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});

		this.currencyList = this.commonService.getCurrency();
		this.rechRhythmLust = this.commonService.getRechRhythm();
		this.zahlRhythmList = this.commonService.getZahlRhythm();
		this.terminationTimeList = this.commonService.terminationTime();
		this.commonService.getStateList().subscribe(result => {
			if(result){
				this.stateList = result.data;
			}
		});

		const allParams = this.route.snapshot.params;
		// console.log(allParams);

		if(allParams){
			if(allParams.companyId ===undefined || allParams.companyId===null )  this.newNumber();
		}

    }

	ngOnChanges() {
		// console.log(this.basicData);
		if(this.basicData && this.basicData!==undefined){

			for (var key in this.basicData) {
				if (this.basicData.hasOwnProperty(key) && key !=='status' && key !=='comment' && key !=='created_time' && key !=='updated_time') {
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
					else if(key ==='payment_stop'){
						if(value==2) this.payment_stop_box = true;
						this.overviewData.controls[`${key}`].setValue(value);
					}
					else{
						this.overviewData.controls[`${key}`].setValue(value);
					}

				}
			}

		}

	}

	formData(){
		$("#overviewFrm").addClass("validateFrm");

		if(this.overviewData.valid){

			return this.overviewData.value;

		}else{
			return false;
		}
		// return this.overviewData.value;
	}

	newNumber(){
		this.contractorsService.getNewContractorNo().subscribe(result => {
			this.overviewData.controls[`contractor_number`].setValue(result.newcontractorId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();
		})
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
		// let contract_start_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		// this.overviewData.controls[`contract_start_date`].setValue(contract_start_date);

	}

	contract_end_dateSelect(value: any, datepicker?: any){

		let start = value.start;
		// let contract_end_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		// this.overviewData.controls[`contract_end_date`].setValue(contract_end_date);

	}

	commercial_dateSelect(value: any, datepicker?: any){

		let start = value.start;
		let commercial_date = this.commonService.transformDate(start, 'yyyy-MM-dd');
		this.overviewData.controls[`commercial_date`].setValue(commercial_date);

	}


	payment_stopSelected($event : any){
		// console.log(" $event ", $event.target.value);
		let value=$event.target.value;
		// console.log("value",value);

		if(value && value !==''){
			this.payment_stop_box = false;
			if(value==2){
				this.payment_stop_box = true;
			}
		}


	}

}

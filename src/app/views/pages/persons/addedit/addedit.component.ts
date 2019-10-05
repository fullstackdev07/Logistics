import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { NgForm } from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { PersonsService } from './../persons.service';

import { CommonService } from './../../../../services/common.service';

import * as $ from 'jquery';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  personDetails : any = {};
  
  articleData : any = {};
  public personsFrm: FormGroup;
  personId : any;
  
  salutationList : any = [];
  person_type_list : any = [];
	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
    private languageService: LanguageService ,
    private transServ : TranslationService,
    private personsService : PersonsService,
    private commonservice: CommonService
    ) {
      
      let current_lng = this.transServ.getSelectedLanguage();	
      this.translate.use(current_lng);

      const allParams = this.route.snapshot.params;
      // console.log(allParams);

      if(allParams){
        if(allParams.personId !==undefined )  {
          this.personId = allParams.personId;
          
          if(this.personId && this.personId >0){
            this.articleDetails();
          }

        }else{
          this.newNumber();
        }
      }

      this.translate.get(['person_type_list' , 'salutationList']).subscribe(res=> {
        this.person_type_list = res['person_type_list'];
        this.salutationList = res['salutationList']
      });
      
	}

  ngOnInit() {
    this.personsFrm = this.fb.group({
			'personId' : [''],
			'person_number': ['' , Validators.required],
			'salutation' : [''  , Validators.required ],
			'first_name': ['' , Validators.required],
			'surname': ['' , Validators.required],
      'position' : ['' , Validators.required],
      'department' : ['', Validators.required],
      'phone' : ['', Validators.required],
      'mobile_number' : ['', Validators.required],
      'fax' : ['', Validators.required],
      'email' : ['',[ Validators.required , Validators.email]],
      'type' : ['', Validators.required],
      'comment' : [''],
      'status' : [1]

    });

    // this.salutationList = this.commonservice.salutationList();
    
  }


  response : any;
  articleDetails(){
    this.personsService.getPersonDetails({personId : this.personId}).subscribe(result => {
        this.response = result.data;  
        // console.log(this.response);
          
        if(this.response){


          this.personsFrm.controls[`personId`].setValue(this.response.personId);
          this.personsFrm.controls[`person_number`].setValue(this.response.person_number);
          this.personsFrm.controls[`salutation`].setValue(this.response.salutation);
          this.personsFrm.controls[`first_name`].setValue(this.response.first_name);
          this.personsFrm.controls[`surname`].setValue(this.response.surname);
          this.personsFrm.controls[`position`].setValue(this.response.position);
          this.personsFrm.controls[`department`].setValue(this.response.department);
          this.personsFrm.controls[`phone`].setValue(this.response.phone);
          this.personsFrm.controls[`mobile_number`].setValue(this.response.mobile_number);
          this.personsFrm.controls[`fax`].setValue(this.response.fax);
          this.personsFrm.controls[`email`].setValue(this.response.email);
          this.personsFrm.controls[`type`].setValue(this.response.type);
          this.personsFrm.controls[`comment`].setValue(this.response.comment);


        }    
    });
  }

  submitFrm(){
    
    $("#personsFrm").addClass("validateFrm");

    if(this.personsFrm.valid){

      let fromData = this.personsFrm.value;

      // console.log(fromData);
      
      this.personsService.addeditPerson(fromData).subscribe(data => {
          this.router.navigate([`persons`]);
      });

    }
  
  }


  newNumber(){
		this.personsService.getNewPersonNo().subscribe(result => {
      console.log(" result.newpersonId " , result.newpersonsId);
      
			this.personsFrm.controls[`person_number`].setValue(result.newpersonsId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		})
  }
  

}

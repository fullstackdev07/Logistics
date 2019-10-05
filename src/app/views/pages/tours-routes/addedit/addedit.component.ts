import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { TourService } from './../tour.service';

import * as $ from 'jquery';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  public tourFrm: FormGroup;
  toursId : any;
	
	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
    private languageService: LanguageService ,
    private transServ : TranslationService,
    private tourService : TourService
    ) {
      
      let current_lng = this.transServ.getSelectedLanguage();	
      this.translate.use(current_lng);

      const allParams = this.route.snapshot.params;
      // console.log(allParams);

      if(allParams){
        if(allParams.toursId !==undefined )  {
          this.toursId = allParams.toursId;
          
          if(this.toursId && this.toursId >0){
            this.tourDetails();
          }

        }
        else{
          this.newNumber();
        }
      }
      
	}

  ngOnInit() {

    this.tourFrm = this.fb.group({
			'toursId' : [''],
			'tour_no': ['' , Validators.required],
			'surname' : [''  , Validators.required ],
			'description': ['' , Validators.required],
			'customer': ['' , Validators.required],
      'client_award' : ['' , Validators.required],
      'price_basis' : ['', Validators.required],
      'day' : ['', Validators.required],
      'valid_from' : ['', Validators.required],
      'date_of_expiry' : ['', Validators.required],
      'tour_type' : ['', Validators.required],
      'service_power_partners' : [''],
      'service_valid_from' : [''],
      'service_date_of_expiry' : [''],
      'service_ltp_prize_week' : [''],
      'service_ltp_prize_we' : [''],
      'comment' : ['']

    });
    
  }


  response : any;
  tourDetails(){
    this.tourService.getTourDetails({toursId : this.toursId}).subscribe(result => {
        this.response = result.data;  
        // console.log(this.response);
          
        if(this.response){


          this.tourFrm.controls[`toursId`].setValue(this.response.toursId);
          this.tourFrm.controls[`tour_no`].setValue(this.response.tour_no);
          this.tourFrm.controls[`surname`].setValue(this.response.surname);
          this.tourFrm.controls[`description`].setValue(this.response.description);
          this.tourFrm.controls[`customer`].setValue(this.response.customer);
          this.tourFrm.controls[`client_award`].setValue(this.response.client_award);
          this.tourFrm.controls[`price_basis`].setValue(this.response.price_basis);
          this.tourFrm.controls[`day`].setValue(this.response.day);
          this.tourFrm.controls[`valid_from`].setValue(this.response.valid_from);
          this.tourFrm.controls[`date_of_expiry`].setValue(this.response.date_of_expiry);
          this.tourFrm.controls[`tour_type`].setValue(this.response.tour_type);
          this.tourFrm.controls[`service_power_partners`].setValue(this.response.service_power_partners);
          this.tourFrm.controls[`service_valid_from`].setValue(this.response.service_valid_from);
          this.tourFrm.controls[`service_date_of_expiry`].setValue(this.response.service_date_of_expiry);
          this.tourFrm.controls[`service_ltp_prize_week`].setValue(this.response.service_ltp_prize_week);
          this.tourFrm.controls[`service_ltp_prize_we`].setValue(this.response.service_ltp_prize_we);
          this.tourFrm.controls[`comment`].setValue(this.response.comment);


        }    
    });
  }

  submitFrm(){
    
    $("#toursFrm").addClass("validateFrm");

    if(this.tourFrm.valid){

      let fromData = this.tourFrm.value;

      // console.log(fromData);
      
      this.tourService.addeditTour(fromData).subscribe(data => {
          this.router.navigate([`tours-routes`]);
      });

    }
  
  }

  newNumber(){
		this.tourService.getNewTourNo().subscribe(result => {
			this.tourFrm.controls[`tour_no`].setValue(result.newtoursId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		})
  }
  
}

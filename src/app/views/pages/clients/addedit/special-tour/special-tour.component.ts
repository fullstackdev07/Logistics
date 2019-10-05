import { Component, OnInit , Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'kt-special-tour',
  templateUrl: './special-tour.component.html',
  styleUrls: ['./special-tour.component.scss']
})
export class SpecialTourComponent implements OnInit {

  specialtour : any = {};

  specialtourFrm : FormGroup;

  @Input() specialtourData;
  @Output() changeFormData = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
	this.changeFormData.emit(true);
    this.specialtourFrm = this.fb.group({
      'description': ['' ],
      'days': ['' ],
      'client_price': [''],
      'contractors_price': [''],
      'contractors': ['']
		});

		this.specialtourFrm.valueChanges.subscribe(val => {
			if(val.description !== "" ||
				val.days !== "" ||
				val.client_award !== "" ||
				val.performance_partner_award !== "" ||
				val.power_partners !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});
  }

  ngOnChanges() {
		// console.log(this.basicData);
		if(this.specialtourData && this.specialtourData!==undefined){
      let description = this.specialtourData.description;
      let days = this.specialtourData.days;
      let client_price = this.specialtourData.client_price;
      let contractors_price = this.specialtourData.contractors_price;
      let contractors = this.specialtourData.contractors;

      this.specialtourFrm.controls['description'].setValue(description);
      this.specialtourFrm.controls['days'].setValue(days);
      this.specialtourFrm.controls['client_price'].setValue(client_price);
      this.specialtourFrm.controls['contractors_price'].setValue(contractors_price);
      this.specialtourFrm.controls['contractors'].setValue(contractors);

    }
  }
	getSpecialtour(){
    if(this.specialtourFrm.valid){
      return this.specialtourFrm.value;
    }
    else{
      $("#specialTourFrm").addClass("validateFrm");
      return false;
    }

	}
}

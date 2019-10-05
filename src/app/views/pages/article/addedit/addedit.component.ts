import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { NgForm } from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { ArticleService } from '../article.service';

import * as $ from 'jquery';


@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  articleData : any = {};
  public articleFrm: FormGroup;
  articleId : any;
	
	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
    private languageService: LanguageService ,
    private transServ : TranslationService,
    private articleService : ArticleService
    ) {
      
      let current_lng = this.transServ.getSelectedLanguage();	
      this.translate.use(current_lng);

      const allParams = this.route.snapshot.params;
      // console.log(allParams);

      if(allParams){
        if(allParams.articleId !==undefined )  {
          this.articleId = allParams.articleId;
          
          if(this.articleId && this.articleId >0){
            this.articleDetails();
          }

        }else{
          this.newNumber();
        }
      }


      
      
	}

  ngOnInit() {
    this.articleFrm = this.fb.group({
			'articleId' : [''],
			'article_number': ['' , Validators.required],
			'description': ['' , Validators.required],
			'price_customer': ['' , Validators.required],
			'price_contractor' : ['' , Validators.required]
    });
  }

  submit(form: NgForm) {
	  if (form.value.email === "") {
		  delete form.value.email;
	  }
  }

  response : any;
  articleDetails(){
    this.articleService.getArticleDetails({articleId : this.articleId}).subscribe(result => {
        this.response = result.data;  
        // console.log(this.response);
          
        if(this.response){
          this.articleFrm.controls[`articleId`].setValue(this.response.articleId);
          this.articleFrm.controls[`article_number`].setValue(this.response.article_number);
          this.articleFrm.controls[`description`].setValue(this.response.description);
          this.articleFrm.controls[`price_customer`].setValue(this.response.price_customer);
          this.articleFrm.controls[`price_contractor`].setValue(this.response.price_contractor);
        }    
    });
  }

  submitFrm(){
    
    $("#articleFrm").addClass("validateFrm");

    if(this.articleFrm.valid){

      let fromData = this.articleFrm.value;

      console.log(fromData);
      
      this.articleService.addeditArticle(fromData).subscribe(data => {
          this.router.navigate([`article`]);
      });

    }
  
  }

  newNumber(){
		this.articleService.getNewArticleNo().subscribe(result => {
			this.articleFrm.controls[`article_number`].setValue(result.newarticleId);
			// this.newclientId = result.newclientId;
			// this.cd.markForCheck();	
		})
	}


}

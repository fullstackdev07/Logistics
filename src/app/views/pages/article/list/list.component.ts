import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { ArticleService } from '../article.service';

import { DataTableDirective } from 'angular-datatables';
import { TranslationService } from '../../../../core/_base/layout';

class Tdata {

}

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {


  articleList : any = [];

  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
    public router: Router,private cd: ChangeDetectorRef, 
    private articleService : ArticleService,
    private transServ : TranslationService, private translate: TranslateService
    )  {

      let current_lng = this.transServ.getSelectedLanguage();
      this.translate.use(current_lng);
      
     }

  ngOnInit() {
    // this.articleList = [{'article_no' : 'NEw Article' , 'surname' : 'Sur Name' , 'description' : '' , 'price_customer' : '' , 'value_partners' : '' ,'id':1}];
    this.cd.markForCheck();
    // this.getArticleList();
    this.dataTableCall();
  }

  public getArticleList() {	
		
		this.articleService.getArticleList({}).subscribe((result) => {					
				this.articleList = result.data;
				this.cd.markForCheck();				
			},
			err => {

			});
	}

  addNewArticle() {
		this.router.navigate(['article/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
  }

  editArticle(articleId : any){
    this.router.navigate(['article/addedit/'+articleId]);
  }

  deleteArticle(articleId : any){

    this.articleService.deleteArticle({ articleId : articleId }).subscribe((result) => {					
      
      // this.getArticleList();
      // this.cd.markForCheck();
      
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
      
    },
    err => {

    });

  }
  

  filterVal : any;

  filterData($event){
    this.filterVal = "";
    let value = $event.target.value;
    if(value){
      this.filterVal = value;
    }

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
      // console.log($event);
      
  }

  response : any ;
  public dataTableCall(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      searching: false,
      lengthChange: false,
      serverSide: true,
      processing: true,
      order:[],
      columnDefs: [
          {
            "targets": 'nosort',
            "orderable": false
          }
      ],
      language: this.transServ.dataTableLang(),
      ajax: (dataTablesParameters: any, callback) => {
         
          dataTablesParameters.search.value=this.filterVal;
          // dataTablesParameters.search.closed_files=this.dateRange;
          // dataTablesParameters.search.date_fin=this.dateRange_fin;
          // dataTablesParameters.search.date_cls = this.dateRange_cls;

          this.articleService.getArticleList(dataTablesParameters).subscribe(resp => {
            this.response = resp;
            if(this.response && this.response.data){
              this.articleList = this.response.data;
                //console.log(this.response.data)
                this.cd.markForCheck();	
                callback({
                  recordsTotal: this.response.recordsTotal,
                  recordsFiltered: this.response.recordsFiltered,
                  data: []
                });

                // this.spinner.hide();
            }async: true

          });
      }
    };
  }


}

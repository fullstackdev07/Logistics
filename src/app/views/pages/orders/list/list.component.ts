import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { OrderService } from './../order.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { DataTableDirective } from 'angular-datatables';
import { TranslationService } from '../../../../core/_base/layout';

class Tdata { }

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  tourList = [];

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    public router: Router,private cd: ChangeDetectorRef , 
    private orderService: OrderService,
    private translate: TranslateService , private transServ : TranslationService) 
    { 
      
      let current_lng = this.transServ.getSelectedLanguage();
		  this.translate.use(current_lng);

    }
    
  ngOnInit() {
    // this.tourList = [{'tour_no' : '65155' , 'surname' : 'AAAAAA' , 'customer' : 'Skyler' , 'client_award' : 'King' , 'price_basic' : '1234567890' ,'id':1}];
    this.dataTableCall();
    this.cd.markForCheck();
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

          this.orderService.getOrderList(dataTablesParameters).subscribe(resp => {
            this.response = resp;
            if(this.response && this.response.data){
              this.tourList = this.response.data;
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

  

  addNewTour() {
		this.router.navigate(['orders/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
  }

  editTour(id) {
		this.router.navigate(['orders/addedit/'+id]);
		// this.dialog.open(DialogDataExampleDialog);
  }


  deleteTour(tourId : any){

    this.orderService.deleteOrder({ toursId : tourId }).subscribe((result) => {	
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
      // this.getTourList();
      // this.cd.markForCheck();				
    },
    err => {

    });

  }

}

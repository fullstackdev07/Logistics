import { Injectable } from '@angular/core';


import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(public http: HttpClient) {}

  public addeditTour(data): Observable<any> {    
		return this.http.post(`${environment.apiUrl}addeditTour`, data);
  }
  

  public getTourList(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}tourList`, data);
  }

    
  public getTourDetails(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getTourDetails`, {params:data});
  }
  
  public deleteTour(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}deleteTour`, {params:data});
  }

  public getNewTourNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewTourNo`, {});
  }

}

import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(public http: HttpClient) {}

  public addeditPerson(data): Observable<any> {    
		return this.http.post(`${environment.apiUrl}addeditPerson`, data);
  }
  

  public getPersonList(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}personList`, data);
  }

    
  public getPersonDetails(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getPersonDetails`, {params:data});
  }
  
  public deletePerson(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}deletePerson`, {params:data});
  }

  public getNewPersonNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewPersonNo`, {});
  }

}

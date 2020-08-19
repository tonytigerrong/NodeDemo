import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from './Contact';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ContactService {
  constructor(private http: HttpClient) { }
  getContacts(){
    return this.http.get<Contact[]>('http://localhost:4000/mongoosetest/list')
                   // .map( (res: Response) => res.json())
                    ;
  }
}

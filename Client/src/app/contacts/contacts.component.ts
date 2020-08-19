import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../Contact';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  contacts: Contact[];
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContacts()
                       .subscribe(
                          contacts=>this.contacts = contacts
                        );
    //console.log(this.contacts);
  }

}

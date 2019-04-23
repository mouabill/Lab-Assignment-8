import { Component, OnInit } from '@angular/core';
import { Contact } from './contacts.model';
import { Http } from '@angular/http';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Array<Contact> = [];
  constructor(private http: Http) { }

  async ngOnInit() {

    this.contacts = await this.loadItemsFromFile();

  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data.json();
  }

  addContact() {
    this.contacts.unshift(new Contact({}));
  }

  delete(index: number) {
    this.contacts.splice(index, 1);
  }

  save(contacts: any) {
    contacts.editing = false;

  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
   const savedContacts = localStorage.setItem('contacts', JSON.stringify(Contact));
   return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
   const savedContacts = JSON.parse(localStorage.getItem(key));
   return savedContacts;
  }

}

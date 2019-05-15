import { Component, OnInit } from '@angular/core';
import { Contact } from './contacts.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  localStorageService: LocalStorageService<Contact>;
  currentUser: IUser;
  constructor(private http: Http, private activatedRoute: ActivatedRoute, private router: Router) {
    this.localStorageService = new LocalStorageService('contacts');
  }

  async ngOnInit() {
    const currentUser = this.localStorageService.getItemsFromLocalStorage('user');
    if (currentUser == null) {
      this.router.navigate(['login']);
    }

    this.loadContacts();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login component to this component', data);
      this.currentUser = data;
    });


  }

  async loadContacts() {
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts.length > 0) {
      this.contacts = savedContacts;


    } else {
      this.contacts = await this.loadItemsFromFile();
    }
    this.sortById(this.contacts);
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
    this.saveItemsToLocalStorage(this.contacts);
  }

  save(contacts: any) {
    this.sortById(this.contacts);
    contacts.editing = false;

  }
  saveItemsToLocalStorage(contacts: Array<Contact>) {
    // const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    // contacts = this.sortById(contacts);
    return this.localStorageService.saveItemsToLocalStorage(contacts);
  }

  getItemsFromLocalStorage(key: string) {

    // const savedContacts = JSON.parse(localStorage.getItem(key));
    return this.localStorageService.getItemsFromLocalStorage();

  }

  search(params: string) {

    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortById(contacts: Array<Contact>) {
    contacts.sort((a: Contact, b: Contact) => {

      return a.id > b.id ? 1 : -1;
    });
  }

  logOut() {
    this.localStorageService.clearItemFromLocalStorage('user');
    this.router.navigate(['']);
  }


}

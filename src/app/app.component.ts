import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent
{
  public appPages = [
    { title: 'Menü', url: '/home', icon: 'cafe' },
    { title: 'Sepet', url: '/cart', icon: 'cart' },
  ];

  constructor(private storage: Storage)
  {
    this.storage.create();
  }
}

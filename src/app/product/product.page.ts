import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/service/api.service';
import { NavController } from '@ionic/angular';
import { ItemDetails } from 'src/models/item-details';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {


  productID : number = 0;
  productDetails: ItemDetails = new ItemDetails();
  ready : boolean = false;

  constructor(private api: ApiService, private navCtrl: NavController, private route: ActivatedRoute,  private storage: Storage)
  {

  }

  ngOnInit()
  {

    this.route.queryParams.subscribe(params =>
      {
      this.productID = params['id'];
      console.log('Product Id: ' + this.productID);
    }
  );


    this.retrieveItemDetails();
  }



  retrieveItemDetails() {
    console.log(`Getting Product Details for ID ${this.productID}`);
    this.api.getProductDetails(this.productID.toString()).then(items => { // Burada toString() kullandık
      this.productDetails = items;
      this.ready = true;
    });
  }



  addItemToCart()
  {

    console.log('Adding Item to Cart');

    this.storage.get('cart-items').then(value =>
    {
      let ItemDetails : ItemDetails[] = [];

      if (value)
        ItemDetails = JSON.parse(value);

      ItemDetails.push(this.productDetails);

      this.storage.set('cart-items', JSON.stringify(ItemDetails)).then(() =>
      {
        console.log(`Adding Item ${this.productDetails.name}`);
        this.navCtrl.navigateRoot('home');
      });
    });
  }
}

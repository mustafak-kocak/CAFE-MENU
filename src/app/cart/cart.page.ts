import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @Input() cartItems: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (!this.cartItems) {
      this.loadCart();
    }
  }

  loadCart() {
    try {
      const savedCart = localStorage.getItem('cart');
      this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      this.cartItems = [];
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  increaseQty(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.saveCart();
  }

  decreaseQty(item: any, index?: number) {
    if ((item.quantity || 1) > 1) {
      item.quantity -= 1;
    } else {
      const idx = index !== undefined ? index : this.cartItems.indexOf(item);
      if (idx > -1) {
        this.cartItems.splice(idx, 1);
      }
    }
    this.saveCart();
  }

  removeItem(param: any) {
    if (typeof param === 'number') {
      this.cartItems.splice(param, 1);
    } else {
      const index = this.cartItems.indexOf(param);
      if (index > -1) {
        this.cartItems.splice(index, 1);
      }
    }
    this.saveCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return total + price * qty;
    }, 0);
  }

  async clearCartConfirm() {
    const alert = await this.alertController.create({
      header: 'Sepeti Temizle',
      message: 'Sepetteki tüm ürünleri silmek istediğinizden emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel'
        },
        {
          text: 'Evet, Temizle',
          handler: () => {
            this.cartItems = [];
            this.saveCart();
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    const alert = await this.alertController.create({
      header: 'Sipariş Alındı',
      message: 'Siparişiniz başarıyla oluşturulmuştur. Afiyet olsun!',
      buttons: [
        {
          text: 'Tamam',
          handler: () => {
            this.cartItems = [];
            this.saveCart();
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

  handleImageError(event: any) {
    event.target.src = 'https://www.rapidseal.net/Admin/Sayfalar/bloglar/yeni-urunler-web-sitemize-eklendi.png';
  }
}
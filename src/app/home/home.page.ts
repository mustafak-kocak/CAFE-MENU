import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../service/api.service';
import { ItemDetails } from '../../models/item-details';
import { CartPage } from '../cart/cart.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  menuItems: any[] = [];
  cartItems: ItemDetails[] = [];

  isAddModalOpen = false;
  newProduct = {
    name: '',
    price: null as number | null,
    image: ''
  };

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  ionViewWillEnter() {
    this.refreshMenuItems();
    this.loadCart();
  }

  loadCart() {
    try {
      const savedCart = localStorage.getItem('cart');
      this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Sepet okunurken hata oluştu:', e);
      this.cartItems = [];
    }
    this.cdr.detectChanges();
  }

  async refreshMenuItems() {
    console.log('Refreshing Menu Items...');
    try {
      const items = await this.api.getMenuProducts();
      this.menuItems = items && items.length > 0 ? items : this.getMockProducts();
    } catch (error: any) {
      console.error('Ürünler çekilirken hata oluştu, mock veri yükleniyor:', error);
      this.menuItems = this.getMockProducts();
    }
    this.cdr.detectChanges();
  }

  getMockProducts() {
    return [
      { id: 1, name: 'Espresso', price: 45, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500' },
      { id: 2, name: 'Latte', price: 60, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500' },
      { id: 3, name: 'Americano', price: 50, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500' }
    ];
  }

  openMenuItem(item: any) {
    console.log(`Opening item ${item.name}`);
    this.navCtrl.navigateForward(`product?id=${item.id}`);
  }

  async openCart() {
    console.log('Sepet Modal olarak açılıyor...');
    const modal = await this.modalCtrl.create({
      component: CartPage,
      componentProps: {
        cartItems: this.cartItems
      }
    });

    modal.onDidDismiss().then(() => {
      this.loadCart();
    });

    await modal.present();
  }

  addNewItem() {
    this.newProduct = { name: '', price: null, image: '' };
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  async saveNewProduct() {
    if (!this.newProduct.name || this.newProduct.price === null || this.newProduct.price === undefined) {
      alert('Lütfen ürün adı ve fiyat alanlarını doldurunuz!');
      return;
    }

    const nameVal = String(this.newProduct.name).trim();
    const priceVal = parseFloat(String(this.newProduct.price)) || 0;
    const imageVal = this.newProduct.image ? String(this.newProduct.image).trim() : '';

    const newProductPayload = {
      name: nameVal,
      price: priceVal,
      image: imageVal,
      description: ''
    };

    try {
      await this.api.addProduct(newProductPayload);
      console.log('Yeni ürün başarıyla eklendi!');
      this.closeAddModal();
      this.refreshMenuItems();
    } catch (error: any) {
      console.error('Ürün eklenirken hata oluştu:', error);
      alert('Yazma Hatası: ' + (error.message || error));
    }
  }

  async deleteProduct(productId: any) {
    if (productId == null || productId === undefined) {
      console.error('Geçersiz ürün ID:', productId);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Ürünü Sil',
      message: 'Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      cssClass: 'ion-color-dark-alert',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
        },
        {
          text: 'Evet, Sil',
          role: 'confirm',
          cssClass: 'alert-btn-delete',
          handler: async () => {
            console.log('Silinecek ürün ID:', productId);
            try {
              await this.api.deleteProduct(productId.toString());
              console.log('Ürün başarıyla silindi');
              this.refreshMenuItems();
            } catch (error: any) {
              console.error('Ürün silinirken bir hata oluştu:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  addToCart(item: any) {
    const existingItem = this.cartItems.find((cartItem: any) => cartItem.id === item.id) as any;

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      this.cartItems.push({
        ...item,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cdr.detectChanges();
    console.log('Sepet Güncellendi:', this.cartItems);
  }

  handleImageError(event: any) {
    event.target.src = 'https://www.rapidseal.net/Admin/Sayfalar/bloglar/yeni-urunler-web-sitemize-eklendi.png';
  }
}
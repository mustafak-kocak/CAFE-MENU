import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBw9Mb0yipDWYseCxCYGPx4M66ur6_6LqA",
  authDomain: "muscofe-156cd.firebaseapp.com",
  projectId: "muscofe-156cd",
  storageBucket: "muscofe-156cd.firebasestorage.app",
  messagingSenderId: "824391926501",
  appId: "1:824391926501:web:60626347af18231ab28a0c",
  measurementId: "G-VNKY21YT4J"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
});

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async getMenuProducts(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "urunler"));
      const products = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...docData.data()
      }));
      console.log('Firestore verileri başarıyla çekildi:', products);
      return products;
    } catch (error) {
      console.error('Firestore okuma hatası:', error);
      throw error;
    }
  }

  async getProductDetails(id: string): Promise<any> {
    try {
      const docRef = doc(db, 'urunler', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error("Ürün bulunamadı!");
        return null;
      }
    } catch (error) {
      console.error('Ürün detayı çekilirken hata:', error);
      throw error;
    }
  }

  async addProduct(product: any): Promise<void> {
    try {
      // 7 haneli benzersiz sayısal ID (Örn: 1979047)
      const numericId = Math.floor(1000000 + Math.random() * 9000000);
      const stringId = numericId.toString();

      const payload = {
        name: product.name || '',
        price: Number(product.price) || 0,
        image: product.image || '',
        description: product.description || '',
        id: numericId
      };

      console.log('Firestore yazma başlatılıyor...', stringId, payload);
      const docRef = doc(db, "urunler", stringId);
      await setDoc(docRef, payload);
      console.log('✅ Ürün Firestore\'a eklendi!');
    } catch (error) {
      console.error('❌ Firestore ekleme hatası:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, 'urunler', productId);
      await deleteDoc(productRef);
      console.log('Ürün silindi:', productId);
    } catch (error) {
      console.error('Firestore silme hatası:', error);
      throw error;
    }
  }
}
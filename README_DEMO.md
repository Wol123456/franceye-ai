# Franchise Analyzer PoC Demo

Bu klasör, "Şube Sağlık Skoru" ve veri analizini görselleştiren demo uygulamasını içerir. İki parçadan oluşur: Backend (Python) ve Frontend (Next.js).

## 1. Backend Kurulumu (API)

Bu servis, verileri çeker (veya simüle eder) ve 'Sağlık Skoru'nu hesaplar.

1. **Terminali açın** ve `poc/backend` klasörüne gidin:
   ```bash
   cd backend
   ```
2. **Gerekli kütüphaneleri yükleyin:**
   ```bash
   pip install fastapi uvicorn
   ```
   *(Not: `pip` çalışmazsa `python -m pip` deneyin. Python kurulu olmalıdır.)*

3. **Backend'i başlatın:**
   ```bash
   python main.py
   ```
   Terminalde `Uvicorn running on http://0.0.0.0:8000` yazısını görmelisiniz. Bu pencereyi açık bırakın.

---

## 2. Frontend Kurulumu (UI)

Bu servis, tarayıcıda arayüzü gösterir.

Not: Bilgisayarınızda `Node.js` yüklü olmalıdır.

1. **Yeni bir terminal açın** (Backend'i kapatmayın).
2. `poc` klasörüne gidin ve bir Next.js projesi oluşturun (Otomatik kurulum):
   ```bash
   cd .. # Eğer backend klasöründeyseniz bir üst klasöre çıkın (poc klasörüne)
   npx create-next-app@latest frontend --typescript --tailwind --eslint --no-src-dir --import-alias "@/*" --app --use-npm
   ```
   *(Size bazı sorular sorarsa hepsine 'Yes' veya 'Enter' diyebilirsiniz).*

3. **Hazırladığım Demo Sayfasını Yükleyin:**
   Benim hazırladığım `page.tsx` dosyasını, oluşturulan projenin içine taşıyın:
   * **Windows Explorer ile:** `poc/frontend/app/page.tsx` dosyasını benim oluşturduğum kodla değiştirin. (Zaten dosyayı oraya yazmıştım, `create-next-app` üzerine yazmış olabilir, kontrol edin veya benim verdiğim kodu tekrar yapıştırın).

4. **Grafik Kütüphanesini Ekleyin:**
   ```bash
   cd frontend
   npm install recharts
   ```

5. **Frontend'i Başlatın:**
   ```bash
   npm run dev
   ```

6. **Tarayıcıda Açın:**
   `http://localhost:3000` adresine gidin.

## 3. Demo Nasıl Kullanılır?

1. Ekrana "Acıbadem Kahve Dünyası" veya istediğiniz bir isim yazın.
2. "Analizi Başlat" butonuna basın.
3. Arka planda (Backend terminalinde) "Scraping..." loglarını göreceksiniz.
4. Ekrana Skor, İtibar Puanları ve "Popular Times" Bar Grafiği gelecektir.

## 4. Veri Kaynakları Hakkında (Önemli)

Bu Proof of Concept (PoC) çalışmasında veriler hibrit bir yöntemle sunulmaktadır:

1.  **Gerçek Veriler:** Şube İsimleri, Adresleri, Google Puanları (Örn: 4.2) ve Toplam Yorum Sayıları, anlık olarak **Google Places API** üzerinden çekilmektedir.
2.  **Simüle Edilen Veriler:** "Popüler Saatler" grafiği ve "Geçmiş Tarihli Analizler", Google API'nin bu verileri anlık sağlamaması (veya premium paket gerektirmesi) nedeniyle **Backend tarafında simüle edilmektedir**.
    *   Bu simülasyon, "Hafta İçi İş/Okul" ve "Hafta Sonu Sosyal" olmak üzere gerçekçi sektör standartlarına dayalı matematiksel modeller kullanır.
    *   Grafikteki kişiler mağaza içindeki tahmini yoğunluğu temsil eder, yoldan geçenleri değil.
3.  **Amaç:** Final üründe bu alanlar, Google My Business entegrasyonu veya Wifi/Kamera sensör verileriyle entegre edilerek %100 gerçek zamanlı hale getirilebilir.

# 💩 Poop Count - Sevgililer Takibi

Sevgilinizle eğlenceli bir şekilde günlük tuvalet alışkanlıklarınızı takip edin! Pixel tarzı tatlı tasarımla geliştirilmiş PWA uygulaması.

## 🎮 Özellikler

- **Multi-User Sistemi**: Kullanıcı kayıt sistemi ile kişisel odalar
- **Oda Sistemi**: Benzersiz oda ID'leri ile özel odalar oluşturun
- **Karakter Sistemi**: Kişiselleştirilmiş karakterler ve temalar
- **Günlük Sayım**: Her poop için +1 butonu ile anlık kayıt
- **Gerçek Zamanlı İstatistikler**: Günlük, haftalık, aylık ve toplam sayılar
- **Kazanan Belirleme**: Her dönem için en aktif kullanıcı
- **PWA Desteği**: Mobil cihazlara yüklenebilir
- **Pixel Tasarım**: Retro oyun tarzı tatlı arayüz
- **Firebase Entegrasyonu**: Gerçek zamanlı veri senkronizasyonu
- **Responsive Tasarım**: Mobil-first yaklaşım ile tüm cihazlarda uyumlu

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

3. **Tarayıcıda açın:**
```
http://localhost:5173
```

## 📱 PWA Kurulumu

1. Tarayıcınızda uygulamayı açın
2. Adres çubuğundaki "Yükle" butonuna tıklayın
3. Uygulama ana ekranınıza eklenecek!

## 🛠️ Teknolojiler

- **React 18** - Modern UI kütüphanesi
- **Vite** - Hızlı geliştirme ortamı
- **Firebase Firestore** - Gerçek zamanlı veritabanı
- **Firebase Auth** - Kullanıcı kimlik doğrulama
- **Zustand** - State management
- **React Router** - Sayfa yönlendirme
- **PWA** - Mobil uygulama deneyimi
- **Pixel CSS** - Retro tasarım
- **Responsive Design** - Mobil-first yaklaşım

## 🎨 Tasarım Özellikleri

- Pixel tarzı butonlar ve kartlar
- Pastel renkli kullanıcı bölümleri
- Bounce ve shake animasyonları
- Responsive tasarım
- Sevgili temalı renk paleti

## 📊 Kullanım

1. **Kayıt Ol/Giriş Yap**: Firebase Auth ile güvenli giriş
2. **Oda Oluştur**: Benzersiz oda ID'si ile özel oda oluşturun
3. **Odaya Katıl**: Room ID ile arkadaşlarınızı davet edin
4. **Karakter Seç**: Kişiselleştirilmiş karakter oluşturun
5. **Poop Ekle**: Her poop için +1 butonuna basın
6. **İstatistikler**: Günlük, haftalık, aylık ve toplam sayıları görün
7. **Kazanan**: Her dönem için en aktif kullanıcıyı öğrenin!

## 🔥 Firebase Konfigürasyonu

Firebase projeniz hazır! Veriler şu koleksiyonlarda saklanıyor:

### 📊 Veri Yapısı:
- **`users`**: Kullanıcı profilleri ve karakter bilgileri
- **`rooms`**: Oda bilgileri ve kullanıcı listesi
- **`poops`**: Poop kayıtları (userId, roomId, timestamp, date)
- **`characters`**: Karakter tanımları ve temalar

### 🔐 Güvenlik:
- Firebase Auth ile kullanıcı kimlik doğrulama
- Firestore Security Rules ile veri koruması
- Kullanıcı bazlı veri erişim kontrolü

## 💕 Sevgili Notu

Bu uygulama sevgililer arası eğlenceli rekabet için tasarlandı. Her poop anı değerlidir! 🎉

---
*Sevgilerle, Poop Count ekibi* 💖

## 🚀 Deploy

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Firebase Deploy:
```bash
npm run deploy
```

### Preview Deploy:
```bash
npm run deploy:preview
```

## 📱 PWA Özellikleri

- **Offline Support**: İnternet bağlantısı olmadan çalışır
- **Install Prompt**: Mobil cihazlara yüklenebilir
- **Service Worker**: Arka plan senkronizasyonu
- **Responsive**: Tüm cihaz boyutlarında uyumlu

## 🎯 Son Güncellemeler

- ✅ İstatistik sistemi tamamen düzeltildi
- ✅ Performance optimizasyonları yapıldı
- ✅ Desktop responsive tasarım eklendi
- ✅ Error handling geliştirildi
- ✅ State management temizlendi
- ✅ Poop senkronizasyonu düzeltildi

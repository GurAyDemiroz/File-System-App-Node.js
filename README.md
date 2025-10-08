# Node.js Dosya Komut Uygulaması

Bu proje, Node.js'in `fs/promises` API'si kullanılarak oluşturulmuş basit bir dosya yönetim sistemi örneğidir.  
`command.txt` dosyasına yazılan komutları izler ve içeriğe göre dosya işlemlerini (oluşturma, silme, yeniden adlandırma, içerik ekleme) otomatik olarak gerçekleştirir.

Udemy üzerinden **Understanding Node.js: Core Concepts** kursuna çalışırken yapıldı.

---

## Özellikler

- Yeni dosya oluşturma  
- Dosya silme  
- Dosya adını değiştirme  
- Dosyaya içerik ekleme  
- `command.txt` dosyasını sürekli izleyerek komut değişikliklerine tepki verme  

---

## Kurulum ve Başlatma 

1.  **Node.js Yüklemesi:**
    Eğer sisteminizde Node.js kurulu değilse, resmi web sitesinden LTS sürümünü indirip kurun:
    👉 [Node.js İndir](https://nodejs.org/)

2.  **Projeyi Klonlama:**
    Projeyi bilgisayarınıza klonlayın ve proje dizinine geçiş yapın:
    ```bash
    git clone [https://github.com/GurAyDemiroz/File-System-App-Node.js.git]
    cd PROJE_DİZİNİ
    ```

3.  **Uygulamayı Başlatma:**
    Uygulamayı başlatmak için terminalde aşağıdaki komutu çalıştırın:
    ```bash
    node app.js
    ```


## Nasıl Kullanılır?

Uygulama çalışırken, proje ana dizininde bulunan `command.txt` dosyasını bir metin düzenleyici ile açın ve aşağıdaki komut formatlarından birini yazıp dosyayı kaydedin. Uygulama, dosyadaki değişikliği algılayıp komutu anında işleyecektir.

### Desteklenen Komutlar

1. **Yeni dosya oluşturma**
    ```bash
    create a file example.txt
    ```

2. **Dosya silme**
    ```bash
    delete the file example.txt
    ```
    

3. **Dosya adını değiştirme**
    ```bash
    rename the file example.txt to renamed.txt
    ```

4. **Dosyaya içerik ekleme**
    ```bash
    add to the file example.txt this content: Merhaba Dünya!
    ```



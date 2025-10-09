import * as fs from "node:fs/promises";
import { Buffer } from "node:buffer";

// open (32) file description
// read or write

const CREATE_FILE_COMMAND = "create a file";
const DELETE_FILE_COMMAND = "delete the file";
const RENAME_FILE_COMMAND = "rename the file";
const ADD_TO_FILE_COMMAND = "add to the file";


(async () => {

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r");
      await existingFileHandle.close();
      return console.log(`${path} adlı dosya zaten var!`);
    } catch (error) {
      const newFileHandle = await fs.open(path, "w");
      console.log("Yeni Dosya Başarıyla Oluşturuldu");
      await newFileHandle.close();
    }

  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log("Dosya başarıyla silindi.");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`${path} dosyası bulunamadı (zaten silinmiş olabilir).`);
      } else {
        console.log("Bir hatayla karşılaşıldı", error.message);
      }
    }
  };

  async function renameFile(oldPath, newPath){
    try{
      await fs.rename(oldPath, newPath);
      console.log("Dosya adı başarıyla değiştirildi");
    } catch (error) {
      if(error.code === "ENOENT"){
        console.log(`${oldPath} dosyası bulunamadı (silinmiş olabilir).`);
      } else {
        console.log("bir hatayla karşılaşıldı", error.message);
      }
    }
  }

  let addedContent; 

  async function addToFile(path, content) {
    let fileHandle; 

    if (addedContent === content) return;

    try {
      fileHandle = await fs.open(path, "a");
      await fileHandle.write(content);
      addedContent = content;
      console.log("içerik başarıyla eklendi");
    } catch (error) {
      console.log("bir hatayla karşılaşıldı", error.message);
    } finally {
      if (fileHandle) {
        await fileHandle.close();
      }
    }
}
  // kolay ama döngü içerisinde yazma yapılacaksa performans verimsiz
  // async function addToFile(path, content) {
  //   try {
  //     await fs.appendFile(path, content, { encoding:"utf8" }); // defaultu utf-8
  //     console.log("Dosyaya yeni veriler eklendi");
  //   } catch (error) {
  //     console.log("bir hatayla karşılaşıldı", error.message);
  //   }
  // }

  
  const commandFileHandler = await fs.open("./command.txt", "r");
  // flags parametresinin default değeri r

  commandFileHandler.on("change", async () => {
      // dosyayı okumak istiyoruz

      // dosyanın boyutunu alalım
      // console.log(await commandFileHandler.stat());
      const size = (await commandFileHandler.stat()).size;

      // dosyanın boyutuna göre Buffer ayırıyoruz
      const buffer = Buffer.alloc(size);
      // Buffer'ı doldurmaya başlamak istediğimiz konum.
      const offset = 0;
      // Okunacak bayt sayısı.
      const length = buffer.byteLength - offset;
      // Dosyayı okumak istediğimiz konum.
      const position = 0;

      // Baştan sona kadar bütün içeriği okumak istiyorum.
      await commandFileHandler.read({
        buffer: buffer, 
        offset: offset, 
        length: length,
        position: position}
      );
      // console.log(buffer.toString("utf-8")); // toString default olarak utf-8 decode eder

      const command = buffer.toString("utf-8");

      // dosya oluştur
      // create a file <path>
      if(command.includes(CREATE_FILE_COMMAND)){
        const filePath = command.substring(CREATE_FILE_COMMAND.length + 1);
        await createFile(filePath);
      }

      // dosyayı sil
      // delete the file <path>
      else if (command.includes(DELETE_FILE_COMMAND)) {
        const filePath = command.substring(DELETE_FILE_COMMAND.length + 1);
        await deleteFile(filePath);
      }

      // dosyanın adını değiştir
      // rename the file <path> to <new-path>
      else if (command.includes(RENAME_FILE_COMMAND)) {
        const _index = command.indexOf(" to ");
        const newPath = command.substring(_index + 4);

        const oldPath = command.substring(RENAME_FILE_COMMAND.length + 1, _index);

        await renameFile(oldPath, newPath);
      }

      // dosyaya ekle
      // add to the file <path> this content: <content>
      else if (command.includes(ADD_TO_FILE_COMMAND)) {
        const _index = command.indexOf(" this content: ");

        const filePath = command.substring(ADD_TO_FILE_COMMAND.length + 1, _index);
        const content = command.substring(_index + " this content: ".length - 1);

        await addToFile(filePath, content);
      }

      else {
        console.log(
          "Geçersiz Komut, lütfen bunlardan birini deneyin:\n\n" +
          "yeni dosya oluşturmak için: create a file <path>\n" +
          "dosya silmek için: delete the file <path>\n" +
          "dosya adını değiştirmek için: rename the file <path> to <new-path>\n" +
          "dosyaya yeni içerik eklemek için: add to the file <path> this content: <content>\n"
        );
      }

  });


  const watcher = fs.watch("./command.txt", { encoding: "utf-8" });
  // encoding paramateresi default'u utf-8

  for await (const event of watcher) {
    if (event.eventType === "change" && event.filename === "command.txt") {

      commandFileHandler.emit(event.eventType); // "change" eventini tetikliyoruz.

      // // console.log("Dosya değişikliğe uğradı.");
      // // dosyayı okumak istiyoruz

      // // dosyanın boyutunu alalım
      // // console.log(await commandFileHandler.stat());
      // const size = (await commandFileHandler.stat()).size;

      // // dosyanın boyutuna göre Buffer ayırıyoruz
      // const buffer = Buffer.alloc(size);
      // // Buffer'ı doldurmaya başlamak istediğimiz konum.
      // const offset = 0;
      // // Okunacak bayt sayısı.
      // const length = buffer.byteLength - offset;
      // // Dosyayı okumak istediğimiz konum.
      // const position = 0;

      // // Baştan sona kadar bütün içeriği okumak istiyorum.
      // const content = await commandFileHandler.read({
      //   buffer: buffer, 
      //   offset: offset, 
      //   length: length,
      //   position: position}
      // );
      // console.log(content.buffer.toString());
    }
  }
})();




// Tüm <FileHandle> nesneleri <EventEmitter> nesneleridir.

// flag'lar resmi dokümantasyonda File System'in en altında 

// chokidar kütüphanesine bak https://www.npmjs.com/package/chokidar github.com/paulmillr/chokidar
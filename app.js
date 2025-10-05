import * as fs from "node:fs/promises";
import { Buffer } from "node:buffer";

// open (32) file description
// read or write


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

  const CREATE_COMMAND = "create a file";
  
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
      if(command.includes(CREATE_COMMAND)){
        const filePath = command.substring(CREATE_COMMAND.length + 1);
        await createFile(filePath);
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

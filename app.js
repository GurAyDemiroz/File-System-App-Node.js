import * as fs from "node:fs/promises";
import { Buffer } from "node:buffer";

// open (32) file description
// read or write

(async () => {

  const commandFileHandler = await fs.open("./command.txt", "r");
  // flags parametresinin default değeri r

  const watcher = fs.watch("./command.txt", { encoding: "utf-8" });
  // encoding paramateresi default'u utf-8

  for await (const event of watcher) {
    if (event.eventType === "change" && event.filename === "command.txt") {
      console.log("Dosya değişikliğe uğradı.");
      // dosyayı okumak istiyoruz

      // dosyanın boyutunu alalım
      // console.log(await commandFileHandler.stat());
      const fileSize = (await commandFileHandler.stat()).size;
      
      const content = await commandFileHandler.read(Buffer.alloc(fileSize));
      console.log(content.buffer.toString());
    }
  }
})();

import * as fs from 'node:fs/promises';


(async () => {
   const watcher = fs.watch("./command.txt", { encoding: "utf-8" });
  // encoding paramateresi default'u utf-8

  for await (const event of watcher){
    if(event.eventType === "change" && event.filename === "command.txt"){
        console.log("Dosya değişikliğe uğradı.");
    }
  }
})();
















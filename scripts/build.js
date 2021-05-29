const fs = require("fs");
const path = require("path");

fs.mkdirSync("./out", { recursive: true });
fs.writeFileSync(
  "./out/plugins.json",
  JSON.stringify(
    fs.readdirSync("./plugins").map((filepath) => {
      const loc = path.resolve(process.cwd(), "plugins", filepath);
      const file = fs.readFileSync(loc, "utf-8");
      const lines = file.split("\n");
      let meta = {};
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("/*meta")) {
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j] === "*/") {
              if (
                meta.name &&
                meta.version &&
                meta.author &&
                meta.description
              ) {
                fs.copyFileSync(loc, "./out/" + filepath);
                meta.api = {
                  location: filepath,
                };
                return meta;
              } else {
                throw new Error(`PLUGIN ${filepath} HAS INVALID META`);
              }
            }
            let line = lines[j];
            const key = line.substr(0, line.indexOf("=")).trim();
            const value = line.substr(line.indexOf("=") + 1).trim();
            meta[key] = value;
          }
        }
      }
      throw new Error(`NO META IN PLUGIN ${filepath}`);
    })
  )
);

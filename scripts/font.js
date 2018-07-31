var glob = require("glob");
var fs = require("fs");

var font = {
  generator: "./node_modules/.bin/bmpfont-generator",
  ttf: "./font.ttf",
  output: "./image/font.png",
  glyph: "./text/glyph.json",
  color: '"#000000"'
};

function findStrings() {
  var files = glob.sync("./scenario/*.ks");
  files.push("./text/servants.json");
  var strings = files
    .map(name => fs.readFileSync(name, "utf-8"))
    .reduce((a, b) => a.concat(b))
    .split("")
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .reduce((a, b) => a + b)
    .replace(/\r?\n/g, "")
    + "召喚"; // ガチャUI用
  fs.writeFileSync("./strings.txt", strings);
}

var generate =
  font.generator +
  " " +
  font.ttf +
  " " +
  font.output +
  " -h 32 --lf strings.txt -m ? -j " +
  font.glyph +
  " -c " +
  font.color;

findStrings();

var exec = require("child_process").exec;
exec(generate, function(err, stdout, stderr) {
 if (err) {
   console.log(err);
 }
});
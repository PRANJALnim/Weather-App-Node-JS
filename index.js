const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "UTF-8");

const replaceVal = (tempVal,orgVal)=>{
  let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toPrecision(3));
  temperature = temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  temperature = temperature.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toPrecision(3));
  temperature = temperature.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toPrecision(3));
  temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  console.log(orgVal.weather[0].main);
  return temperature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Indore&appid=7a7a0062e3a5c7423c7a43922e13635f")

      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        // console.log(arrdata[0].main.temp-273.15);
        const realTimeData = arrdata.map((val)=>{
          return replaceVal(homeFile, val);
        }).join(""); 
        // console.log(realTimeData);
        res.write(realTimeData);
      })

      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(4000);




// https://www.youtube.com/watch?v=Fx9ciSsjDsc&list=PLwGdqUZWnOp00IbeN0OtL9dmnasipZ9x8&index=24
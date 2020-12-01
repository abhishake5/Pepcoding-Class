// npm install request
//npm install cheerio
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");

request("https://www.espncricinfo.com/series/8048/scorecard/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league-2020-21", requestkAns);

function requestkAns(err, response, html) {
    console.log(err);
    // console.log(html);
    // console.log(reponse);
    // fs.writeFileSync("index.html", html);
    console.log("received file");
    //single data
    //let output = STool("div.summary");
    //gives html of matching element
    //console.log(output.html());
    //gives value
    //console.log(output.text());
    //innings isolate
    //let inningsArr = STool("div.card.content-block.match-scorecard-table");
    //let fullHtml = "<table>"
    //for (let i = 0; i < 2; i++) {
    //let tableBatsMan = STool(inningsArr[i]).find("table.table.batsman");

    //extract batsman from table
    //fullHtml += STool(tableBatsMan).html();
    //fullHtml += "<table>";
    //}
    //batsman names
    let sTool = cheerio.load(html);
    let tableElem = sTool("div.card.content-block.match-scorecard-table .Collapsible");
    console.log(tableElem.length);
    //let Inninghtml="<table>";
    let count = 0;
    for (let i = 0; i < tableElem.length; i++) {
        let teamName = sTool(tableElem[i]).find("h5.header-title.label").text();
        let rowsOfATeam = sTool(tableElem[i]).find(".table.batsman").find("tbody tr");
        for (let j = 0; j < rowsOfATeam.length; j++) {
            let rCols = sTool(rowsOfATeam[j]).find("td");
            let isBatsManRow = STool(rCols[0]).hasClass("batsman-cell");
            if (isBatsManRow == true) {
                count++;
                let pName = stool(rCol[0]).text();
                console.log(pName);
            }
        }
        console.log("Number of batsman in a team", count);
        console.log(teamName);
        count = 0;
        console.log("'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''");
    }
    // fs.writeFileSync("batsman.html", InningHtml);

}
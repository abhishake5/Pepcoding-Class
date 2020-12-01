// npm install request=>. npm playstore => local machine 
// console.log("hello");
// use => require
// include import require 
// /logic => implementation => libraray => function 
let request = require("request");
// npm install cheerio 
let cheerio = require("cheerio");
// preinstalled
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");
//  input => url , fn
//all match url
request("https://www.espncricinfo.com/scores/series/8048/season/2020/indian-premier-league?view=results", getAMURL);

function getAMURL(err, resp, html) {
    // console.log(html);
    let sTool = cheerio.load(html);
    let allmatchURLElem = sTool("a[data-hover='Scorecard']");
    for (let i = 0; i < allmatchURLElem.length; i++) {
        let href = sTool(allmatchURLElem[i]).attr("href");
        let fURL = "https://www.espncricinfo.com" + href;
        findDataofAMatch(fURL);
    }
}

function findDataofAMatch(url) {
    request(url, whenDataArrives);

    function whenDataArrives(err, resp, html) {
        // create file => content 
        console.log("recieved html");
        // function => speceific paramater => data
        // browser=> parse => ui show 
        // nodejs => parse => extract 

        // single entry
        //   let resultElem=sTool("div.desc.text-truncate");

        //   console.log(resultElem.text());
        // /html => element
        // css syntax 
        let sTool = cheerio.load(html);
        let tableElem = sTool("div.card.content-block.match-scorecard-table .Collapsible");
        console.log(tableElem.length);
        // let Inninghtml="<table>";
        let count = 0;
        for (let i = 0; i < tableElem.length; i++) {
            // text ,cheerio=> wrap
            // html => element html
            let teamName = sTool(tableElem[i]).find("h5.header-title.label").text();
            let rowsOfATeam = sTool(tableElem[i]).find(".table.batsman").find("tbody tr");
            //splits team name from a breakdown string
            let teamStrArr = teamName.split("Innings");
            teamName = teamStrArr[0].trim();
            console.log(teamName);
            for (let j = 0; j < rowsOfATeam.length; j++) {
                let rCols = sTool(rowsOfATeam[j]).find("td");
                let isBatsManRow = sTool(rCols[0]).hasClass("batsman-cell");
                if (isBatsManRow == true) {
                    count++;
                    let pName = sTool(rCols[0]).text().trim();
                    let runs = sTool(rCols[2]).text().trim();
                    let balls = sTool(rCols[3]).text().trim();
                    let fours = sTool(rCols[5]).text().trim();
                    let sixes = sTool(rCols[6]).text().trim();
                    let sr = sTool(rCols[7]).text().trim();
                    console.log(`Name:${pName} Runs=${runs} Balls=${balls} Fours=${fours} Sixes=${sixes} Strike Rate=${sr}`);
                    processPlayer(teamName, pName, runs, balls, fours, sixes, sr);
                }
            }
            //console.log("No of batsman of in a team", count);
            count = 0;
            //   console.log(cInning.html());
            //   Inninghtml+=psOfATeam;
            console.log("******************************************************************************************************");
        }
    }
}

function processPlayer(team, name, runs, balls, fours, sixes, sr) {
    //team name => does this entry belongs to an existing team
    let dirPath = team;
    let pMatchStats = {
        Team: team,
        Name: name,
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
        StrikeRate: sr
    }
    if (fs.existsSync(dirPath)) {
        //check if file exists
        console.log("folder exists")
    } else {
        //create folder, file, add data
        fs.mkdirSync(dirPath);

    }
    let playerFilePath = path.join(dirPath, name + ".xlsx");
    let pData = [];
    if (fs.existsSync(playerFilePath)) {
        pData = excelReader(playerFilePath, name);
        pData.push(pMatchStats);

    } else {
        //create file

        console.log("File of Player", playerFilePath, "created");
        pData = [pMatchStats];

    }
    excelWriter(playerFilePath, pData, name);

    //check if player's excel file exists or not

}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return null;
    } else {
        let wt = xlsx.readFile(filePath);
        let excelData = wt.Sheets[name];
        let ans = xlsx.utils.sheet_to_json(excelData);
        return ans;
    }
}

function excelWriter(filePath, json, name) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, name);
    xlsx.writeFile(newWB, filePath);
}
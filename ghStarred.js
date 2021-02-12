const { request } = require("@octokit/request");
const csvPasrer = require("csv-parser");
const converter = require("json-2-csv");
const fs = require("fs");

// load config
require("dotenv").config();

function createHeader(key, value) {
  let ghToken = process.env.GH_ACCESS_TOKEN;
  let authHeader = {
    headers: {
      authorization: `token ${ghToken}`,
    },
  };
  if (key) {
    authHeader[key] = value;
  }
  return authHeader;
}

let hasHeader = true;
let defaultEol = "\n";

let csvOutputFileName = "starred.csv";
let data = [];
var ids = new Map();

if (fs.existsSync(csvOutputFileName)) {
  hasHeader = false;
  fs.createReadStream(csvOutputFileName)
    .pipe(csvPasrer())
    .on("data", (row) => {
      ids.set(parseInt(row.id), row.name);
    })
    .on("end", () => {
      console.log(`File ${csvOutputFileName} contains ${ids.size} entries`);
      loadData();
    });
} else {
  hasHeader = true;
  loadData();
}

function loadData() {
  request("GET /user/following", createHeader()).then((resp) => {
    let following = resp.data.map((x) => x.login);

    const promises = [];

    for (let i = 0; i < following.length; i++) {
      let user = following[i];
      promises.push(
        request(
          "GET /users/{username}/starred?sort=created",
          createHeader("username", user)
        ).then((resp) => {
          for (let i = 0; i < resp.data.length; i++) {
            let id = resp.data[i].id;
            let name = resp.data[i].name;

            // skip header
            if (id == "id") continue;

            //console.log(ids.has(id))
            if (!ids.has(id)) {
              item = {
                id: id,
                name: name,
                full_name: resp.data[i].full_name,
                url: resp.data[i].html_url,
                homepage: resp.data[i].homepage,
                description: resp.data[i].description,
                language: resp.data[i].language,
                stargazers_count: resp.data[i].stargazers_count,
                size: resp.data[i].size,
                open_issues: resp.data[i].open_issues,
                fork: resp.data[i].fork,
                forks: resp.data[i].forks,
                archived: resp.data[i].archived,
                disabled: resp.data[i].disabled,
              };
              data.push(item);
              ids.set(id, name);
            }
          }
        })
      );
    }

    Promise.all(promises).then(() => {
      options = {
        delimiter: {
          wrap: '"',
          field: ",",
          eol: defaultEol,
        },
        emptyFieldValue: "null",
        prependHeader: hasHeader,
      };

      converter.json2csv(
        data,
        (err, csv) => {
          if (err) {
            console.log(err);
          } else {
            // append to file
            fs.appendFile(csvOutputFileName, csv, function (err) {
              if (err) throw err;

              // add eol when there was some data
              if (data.length > 0) {
                fs.appendFileSync(csvOutputFileName, defaultEol);
              }
              console.log(
                `Append ${data.length} new entries to the file ${csvOutputFileName}`
              );
            });
          }
        },
        options
      );
    });
  });
}

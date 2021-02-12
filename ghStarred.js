const { request } = require("@octokit/request");
let converter = require("json-2-csv");
let fs = require("fs");

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

data = [];

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
          item = {
            id: resp.data[i].id,
            name: resp.data[i].name,
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
        }
      })
    );
  }

  Promise.all(promises).then(() => {
    options = {
      delimiter: {
        wrap: '"',
        field: ";",
        emptyFieldValue: "none",
      },
    };

    converter.json2csv(
      data,
      (err, csv) => {
        if (err) {
          console.log(err);
        } else {
          fs.writeFile("starred.csv", csv, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
        }
      },
      options
    );
  });
});

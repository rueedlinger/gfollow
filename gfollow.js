const { request } = require("@octokit/request");
require("dotenv").config();

function createHeader(key, value) {
  let ghToken = process.env.GH_ACCESS_TOKEM;
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

// get all folowers
request("GET /user/followers", createHeader())
  .then((resp) => {
    let followers = resp.data.map((x) => x.login);
    console.log(`\nTry to follow back all my ${followers.length} followers`);

    for (let i = 0; i < followers.length; i++) {
      let userFollowBack = followers[i];
      request(
        "PUT /user/following/{username}",
        createHeader("username", userFollowBack)
      ).then((resp) => {
        console.log(`${userFollowBack} => ${resp.status}`);
      });
    }
    return new Set(followers);
  })
  .then((followers) => {
    request("GET /user/following", createHeader()).then((resp) => {
      let following = new Set(resp.data.map((x) => x.login));

      let notFollowingBack = new Set(
        [...following].filter((x) => !followers.has(x))
      );
      let missedToFollow = new Set(
        [...followers].filter((x) => !following.has(x))
      );
      console.log("\nNot following back :-(");
      console.log(notFollowingBack);

      console.log("\nOpps missed to follow back....");
      console.log(missedToFollow);
    });
  });

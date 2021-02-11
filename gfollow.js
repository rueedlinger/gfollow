const { request } = require("@octokit/request");
require("dotenv").config();

let ghToken = process.env.GH_ACCESS_TOKEM;

// get all folowers
request("GET /user/followers", {
  headers: {
    authorization: `token ${ghToken}`,
  },
})
  .then((resp) => {
    let followers = resp.data.map((x) => x.login);
    console.log(`\nTry to follow back all my ${followers.length} followers`);
    resp.data.forEach((x, i) => {
      let userFollowBack = x.login;
      // follow user back
      request("PUT /user/following/{username}", {
        headers: {
          authorization: `token ${ghToken}`,
        },
        username: userFollowBack,
      }).then((resp) => {
        console.log(`${userFollowBack} => ${resp.status}`);
      });
    });
    return new Set(followers);
  })
  .then((followers) => {
    // check who is not following back
    // console.log(followers);
    request("GET /user/following", {
      headers: {
        authorization: `token ${ghToken}`,
      },
    }).then((resp) => {
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

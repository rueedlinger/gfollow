const { request } = require("@octokit/request");
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

// get all following users
request("GET /user/following", createHeader())
  .then((resp) => {
    return new Set(resp.data.map((x) => x.login));
  })
  .then((following) => {
    return Promise.all([
      following,
      // get all followers
      request("GET /user/followers", createHeader()).then((resp) => {
        return new Set(resp.data.map((x) => x.login));
      }),
    ]);
  })
  .then(([following, followers]) => {
    console.log(`following: ${following.size}`);
    console.log(`followers: ${followers.size}`);

    let notFollowingBack = new Set(
      [...following].filter((x) => !followers.has(x))
    );
    let missedToFollow = new Set(
      [...followers].filter((x) => !following.has(x))
    );

    console.log(
      `\nThere are ${notFollowingBack.size} people who do not follow you back! :-(`
    );
    console.log(notFollowingBack);

    console.log(`\nYou forgot to follow ${missedToFollow.size} people back!`);
    console.log(missedToFollow);

    const promises = [];

    missedToFollow.forEach((followBackUsername) => {
      promises.push(
        // Follow a user back
        request(
          "PUT /user/following/{username}",
          createHeader("username", followBackUsername)
        ).then((resp) => {
          console.log(`follow back => ${followBackUsername}`);
        })
      );
    });

    Promise.all(promises).then(() => {
      console.log("Done!")
    });
  });

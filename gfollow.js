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
request("GET /user/followers", createHeader()).then((resp) => {
  let followers = resp.data.map((x) => x.login);
  console.log(`\nTry to follow back all my ${followers.length} followers`);

  const promises = [];

  for (let i = 0; i < followers.length; i++) {
    let userFollowBack = followers[i];
    promises.push(
      request(
        "PUT /user/following/{username}",
        createHeader("username", userFollowBack)
      ).then((resp) => {
        console.log(`${userFollowBack} => ${resp.status}`);
      })
    );
  }

  Promise.all(promises).then(() => {
    
    request("GET /user/following", createHeader()).then((resp) => {
      let followingSet = new Set(resp.data.map((x) => x.login));
      let followerSet = new Set(followers)
        
      let notFollowingBack = new Set(
        [...followingSet].filter((x) => !followerSet.has(x))
      );
      let missedToFollow = new Set(
        [...followerSet].filter((x) => !followingSet.has(x))
      );
      console.log("\nNot following back :-(");
      console.log(notFollowingBack);

      console.log("\nOpps missed to follow back....");
      console.log(missedToFollow);
    });
  });
});

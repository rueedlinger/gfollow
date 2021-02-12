# ghFollow - Get Some Insights form Your GitHub Followers

*I started following people back on GitHub. First I thought this feature is useless. But since then I found a lot of interesting projects which I definitely would not have found. So I started this repository with some scripts to play around with the social features from GitHub.*

## First Steps

1. Clone the repo

```bash
git clone https://github.com/rueedlinger/ghfollow.git
```

2. Create a personal access token at https://github.com/settings/tokens/new?scopes=repo with only the access rights `user:follow`


3. Create a `.env` env file. Just rename [example.env](example.env) and replace the `GH_ACCESS_TOKEN` with your personal access token. 

```bash
ACCESS_TOKEM=***** SECRET TOKEN *****
```

4. Install all required packages.

```bash
npm install
```


## ghFollowBack.js

This script is for those which want to follow people back with just one click. Run the script to follow people back on GitHub. 


```bash
node ghFollowBack.js
```

## ghStarred.js

This scripts save the latest starred repositories from people you follow in the CSV file `starred.csv`.

```bash
node ghStarred.js
```


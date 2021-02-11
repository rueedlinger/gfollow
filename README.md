# ghFollow.js - Follow People Back on GitHub

> *I started following people back on GitHub. First I thought this feature is useless. But since then I found a lot of interesting projects which I definitely would not have found. This script is for those which want to follow people back with just one click.*

## How to Run the Script

1. Create a personal access token at https://github.com/settings/tokens/new?scopes=repo with only the access rights `user:follow`

2. Clone the repo

```bash
git clone https://github.com/rueedlinger/ghfollow.git
```

3. Create a `.env` env file. Just rename [example.env](example.env) and replace the `GH_ACCESS_TOKEN` with your personal access token. 

```bash
ACCESS_TOKEM=***** SECRET TOKEN *****
```

4. Install all required packages.

```bash
npm install
```

5. Run the script.

```bash
node ghFollow.js
```





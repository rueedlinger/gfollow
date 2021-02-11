# gfollow

> I started following back on GitHub. First I thought this feature is useless. But since then I found a lot of interesting projects which I definitely would not have found. This script is for those which want to do the same.

## How to run


1. Create a personal access token at https://github.com/settings/tokens/new?scopes=repo with only the access rights `user:follow`

2. Create a `.env` env file. Just rename [example.env](example.env) and replace the `ACCESS_TOKEM` with your personal access token. 

```bash
ACCESS_TOKEM=***** SECRET TOKEN *****
```

3. Install all required package.

```bash
npm install
```

4. Run the script

```bash
node gfollow.js
```





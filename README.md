# ghFollow - Node Scripts to Get Some Insights From People You Follow on GitHub

I started following people back on GitHub. First I thought this feature is useless. But since then I found a lot of interesting projects which I definitely would not have found. So I started this repository with some scripts to play around with the social features from GitHub.

- **ghFollowBack.js** a Node script to follow people back.
- **ghStarred.js** a Node script to save the starred projects from the people you follow in a CSV file.
- **starred.ipynb** a Jupyter notebook to analyze the CSV data from the ghStarred.js script.


## First Steps

1. Clone the repo

```bash
git clone https://github.com/rueedlinger/ghfollow.git
```

2. Create a personal access token at https://github.com/settings/tokens/new?scopes=user:follow with only the access rights `user:follow`


3. Create a `.env` env file. Just rename [example.env](example.env) and replace the `GH_ACCESS_TOKEN` with your personal access token. Or save your access token as environment variable `GH_FOLLOW_BACK_TOKEN`.

```bash
GH_ACCESS_TOKEN=***** SECRET TOKEN *****
```

4. Install all required packages.

```bash
npm install
```


## ghFollowBack.js

This Node script is for those who want to follow people back with just one click. Just run the script to follow people back on GitHub. 
If `GH_UNFOLLOW=true` set to true the script will also unfollow people which do not follow back. 

```bash
node ghFollowBack.js
```

## ghStarred.js

This scripts saves the latest starred repositories from people you follow in the CSV file `starred.csv`. If the file already exists new entries are append if they do not exist yet. To check if a entry already exist the GitHub project id is used.

```bash
node ghStarred.js
```

## Jupyter Notebook - Analyze the CSV Data From ghStarred.js
To get some insights from people you follow on GitHub
jun can run the Jupyter notebook [notebook/starred.ipynb](notebook/starred.ipynb). This notebook loads the data from `starred.csv` file and plots the following charts.

### What are the most starred programming languages?

![mMst starred programming languages](docs/languages.png "Most starred programming languages")

### What is the Relationship between forks, stars and open issues?

![Relationship forks, stars and open issues](docs/fork_vs_stars.png "Relationship forks, stars and open issues")

### The project descriptions as world cloud

![World cloud project description](docs/world_cloud.png "World cloud project description")

## Run ghFollowBack.js as Daily Job With GitHub Actions 

![FollowBack](https://github.com/rueedlinger/ghfollow/workflows/FollowBack/badge.svg)

Store your personal access token as secret with the name `GH_FOLLOW_BACK_TOKEN` and create a GitHub Action which 
runs the ghFollowBack.js as a daily job
(See [`.github/workflows/followback.yml`](.github/workflows/followback.yml)).



```yaml
name: FollowBack

on:
 # Runs at 12:00 UTC every day. 
 # Note there might be some delays (minutes) when the job is triggerd. 
 schedule:
 - cron: "0 12 * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: checkout 
      uses: actions/checkout@v2
    - name: setup node
      uses: actions/setup-node@v1
      with:
        node-version: 12
    - name: install modules
      run: npm install
    - name: run ghFollowBack.js
      env: 
        # set the token as secret
        GH_ACCESS_TOKEN: ${{ secrets.GH_FOLLOW_BACK_TOKEN }}
      run: node ghFollowBack.js

```

## Git LFS
Some of the files (`*.png, *.ipynb`) are stored in [Git LFS](https://git-lfs.github.com). When you want to work with them locally you need to install *git-lfs* and check them out.

```bash
git lfs checkout
```


## Reference
- `@octokit/request`: https://github.com/octokit/request.js/
- API Starring: https://docs.github.com/en/rest/reference/activity#starring
- API Followers: https://docs.github.com/en/rest/reference/users#followers
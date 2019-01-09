# electron-mango

## Project setup
```
yarn install
```

### Start & Develop
```bash
yarn run serve # start vue dev server
yarn run electron # start electron
```

## Known Issue
Under 3.6, Mongodb don't allow to list databases if user don't have privileges to acess admin. I know there is a solution, but I haven't find it yet. So for the mongodb enabled auth which the version is under 3.6, this softward would only show the database with auth.

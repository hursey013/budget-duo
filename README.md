# budget-duo

Calculate how much you and your partner should contribute towards shared expenses.

To run locally, clone the repository and run:

```
npm install
```

Once all of the dependencies are installed, you can start the development server with:

```
npm start
```

To run any included tests, use:

```
npm test
```

This project uses Google Firebase's [Realtime Database](https://firebase.google.com/products/realtime-database/) and [Authentication](https://firebase.google.com/products/auth/) so you'll need to provide a `.env` file with the following variables:

```
REACT_APP_API_KEY=XXXXxxxx
REACT_APP_AUTH_DOMAIN=xxxxXXXX.firebaseapp.com
REACT_APP_DATABASE_URL=https://xxxXXXX.firebaseio.com
REACT_APP_PROJECT_ID=xxxxXXXX
REACT_APP_STORAGE_BUCKET=xxxxXXXX.appspot.com
REACT_APP_MESSAGING_SENDER_ID=xxxxXXXX
```

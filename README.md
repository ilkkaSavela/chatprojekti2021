# API
Projektissa on toteutettu REST-rajapinta, jonka kautta voi hakea ja lähettää viestejä.

## Viestit


### Viestien haku
GET /api/messages/

Voit hakea viestit get metodilla.

Api vaatii parametrina kirjautuneen käyttäjän autentikaatio tokenin, mistä palvelin tulkitsee käytttäjän id:n.

Api palauttaa kaikki viestit joissa sisäänkirjautunut käyttäjä on joko lähettäjä tai vastaanottaja.

### Uusi viesti

POST /api/messages/

Uusi viesti lähetetään POST-metodilla JSON muotoisena.

JSONinssa täytyy olla seuraavat avaimet:

**"token"** Selaimen paikalliseen musitiin tallennettu, palvelimelta saatu käyttäjän autentikaatio token, Luodaan kirjautumisen yhteydessä.

**"receiver"** viestin vastaanottajan id ***HUOM. Täytyy olla olemassa olevan käyttäjän id!***

**"message"** lähetettävä viesti

esim. ```{"token": myToken ,"receiver": 3, "message": "uusi viesti"
}```

Viestin lähettäjän id määräytyy autentikaatio tokenin mukaan.

## Käyttäjät

### Kirjautuminen ja rekisteröinti

POST /api/login

Tarkastaa JSON-objektin tiedoilla onko käyttäjä olemassa, mikäli ei luo uuden.

Onnistuneessa kirjautumisessa palauttaa Autentikaatio token:in, joka on voimassa 1 tunnin ajan.

JSONinssa täytyy olla seuraavat avaimet:

**"email"** Käyttäjätilin sähköpostiosoite

**"password"** Käyttäjätilin salasana

esim. ```{"email": "Mikko.Mallikas@chat.fi", "password": "Salasana"}```



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

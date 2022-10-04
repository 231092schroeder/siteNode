//Importation du module express
var express = require('express');
const session = require('express-session')

const cookieParser = require("cookie-parser");
//Importation du fichier de routage
const Routeur = require('./routes/Route')


//Déclaration, paramètrage et utilisation de l'app
let app = express()

app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use(express.static('public'))
app.use('/', Routeur)



const FourHours = 1000 * 60 * 60 * 4; //session de 48h avant destruction
//session middleware
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: FourHours },
  resave: false
}));

app.use(cookieParser());


/* Lancement du serveur au port défini */
const port = 3000
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur à l'adresse suivante : http://localhost:${port}`)
})


module.exports = app
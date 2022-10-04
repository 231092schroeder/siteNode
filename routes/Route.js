//Importation 
const express = require('express');

//Importation du fichier controller
const Controller = require('../controllers/Controller');
//création du routeur Express pour ce module
const routeur = express.Router();
routeur.use(express.urlencoded());

//Définition des routes et des fonctions controller associées
// ---------- ENREGISTREMENT---------- 
routeur.get('/register', Controller.Register);
routeur.post('/registerUser', Controller.RegisterUser);

// ---------- CONNEXION/DECONNEXION ---------- 
routeur.get('/', Controller.Login);
routeur.get('/Logout', Controller.Logout);
routeur.get('/PasswordRecovery', Controller.PasswordRecovery);
routeur.post('/RecoveryConfig', Controller.RecoveryConfig);
routeur.post('/LoginUser', Controller.LoginUser);

// ---------- GENERAL ---------- 
routeur.get('/acceuil', Controller.Acceuil);

// ---------- ROLE ---------- 
routeur.get('/role', Controller.Role);
routeur.get('/roleDel/:id', Controller.RoleDel);
routeur.get('/roleEdit/:id', Controller.RoleEdit);
routeur.post('/configEditRole/:id', Controller.ConfigEditRole);
routeur.post('/roleAdd', Controller.RoleAdd);

// ---------- SOCIETE ---------- 
routeur.get('/societe', Controller.Societe);

// ---------- UTILISATEUR ---------- 
routeur.get('/utilisateur', Controller.Utilisateur);
routeur.get('/usersEdit/:id', Controller.UtilisateurEdit);
routeur.post('/configEditUser/:id', Controller.ConfigEditUser);
routeur.get('/usersDel/:id', Controller.UtilisateurDel);

// ---------- PRODUIT ---------- 
routeur.get('/Produit', Controller.Product);
routeur.get('/ProductDetails/:date/:id', Controller.ProductDetails);
routeur.get('/ProductDetailsNC8/:date/:id', Controller.ProductDetailsNC8);
//Exportation du module routeur
module.exports = routeur 

const bodyParser = require('body-parser');
const iniparser = require('iniparser');
var nodemailer = require('nodemailer');
//Importation du middleware pour les sessions avec Node
const session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
//Importation de la connexion à la bdd
const client = require('../database');

//Importation du fichier models
var Model = require('../models/Model');
const cookieParser = require('cookie-parser');



//Exportation des fonctions du controller
module.exports = {
        // ---------- GENERAL ---------- 
        Acceuil: (req, res) => {
                if (session.user_email) {
                        res.render("./sideIndex.ejs", {
                                sess_email: session.user_email,
                                sess_name: session.user_name,
                                sess_surname: session.user_surname,
                                sess_company: session.user_company,
                                sess_contact_no: session.user_contact_no,
                                sess_type: session.user_type,
                                sess_subscription: session.user_subscription,
                                sess_PermsProd: session.user_PermsProd,
                                sess_PermsUser: session.user_PermsUser,
                                sess_PermsRole: session.user_PermsRole,
                        });
                } else {
                        res.redirect('/')
                }
        },
        // ---------- ROLE ---------- 
        Role: (req, res) => {
                if (session.user_PermsRole == "True") {

                        async function getRole() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('role')             //Séléction de la collection
                                        cursor = await coll.find({})  //Recherche dans la base
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        };
                        (async function () {
                                let docsList = await getRole()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                                res.render("./sideRole.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docList: docsList
                                });

                        })();


                } else {
                        res.redirect('/')
                }

        },
        RoleAdd: (req, res) => {
                if (session.user_PermsRole == "True") {
                var nameRole = req.body.nameRole
                const Role = {
                        Name: nameRole,
                        Author: session.user_name + ' ' + session.user_surname,
                        Usable: "True",
                        PermsProd: "False",
                        PermsUser: "False",
                        PermsRole: "False"

                }
                const database = client.db("auth_demo_app");
                const collectionInDB = database.collection("role");

                const result = collectionInDB.insertOne(Role);

                console.log("Les information suivante on été insérée :")
                console.log(Role)
                res.redirect('/role')
        }
        },
        RoleDel: (req, res) => {
                if (session.user_PermsRole == "True") {
                (async function () {
                        const database = client.db("auth_demo_app");
                        const collectionInDB = database.collection("role");
                        const result = collectionInDB.deleteOne({ _id: ObjectId(req.params.id) });
                        res.redirect('/role')
                })();
        }

        },
        RoleEdit: (req, res) => {
                if (session.user_PermsRole == "True") {
                async function getRole() {
                        try {
                                coll = await client.db('auth_demo_app').collection('role')             //Séléction de la collection
                                cursor = await coll.find({ _id: ObjectId(req.params.id) })                                            //Recherche dans la base
                                return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                        } catch (e) {
                                console.error('Error:', e)
                        }
                }
              
                (async function () {
                        let docsListRole = await getRole()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                        res.render("./sideEditRole.ejs", {
                                sess_email: session.user_email,
                                sess_name: session.user_name,
                                sess_surname: session.user_surname,
                                sess_company: session.user_company,
                                sess_contact_no: session.user_contact_no,
                                sess_type: session.user_type,
                                sess_subscription: session.user_subscription,
                                sess_PermsProd: session.user_PermsProd,
                                sess_PermsUser: session.user_PermsUser,
                                sess_PermsRole: session.user_PermsRole,
                                sess_docListRole: docsListRole
                        });
                        console.log(docsListRole)
                })();

          
        };
        },
        ConfigEditRole: (req, res) => {
             
                var PermProd = req.body.PermsProd
                if(PermProd == "on"){
                        PermProd = "True"
                }else{
                        PermProd = "False"
                }
                var PermUser = req.body.PermsUser
                if(PermUser == "on"){
                        PermUser = "True"
                }else{
                        PermUser = "False"
                }
                var PermRole = req.body.PermsRole
                if(PermRole == "on"){
                        PermRole = "True"
                }else{
                        PermRole = "False"
                }
                const database = client.db("auth_demo_app");
                const collectionInDB = database.collection("role");
                console.log(req.params.id)
                const result = collectionInDB.updateOne({ _id: ObjectId(req.params.id) }, {
                        $set: {
                                PermsProd: PermProd,
                                PermsUser:PermUser,
                                PermsRole:PermRole
                        }
                });
                console.log(result)
                res.redirect('/role')
        

        },
       
        // ---------- CONNEXION/DECONNEXION ---------- 
        Login: (req, res) => {
                res.render("./login");
        },
        LoginUser: (req, res) => {
                //Récupération des variable du formulaire :
                var EmailUser = req.body.email
                var PasswordUser = req.body.password

                //Fonction asynchrone pour récupération des data de MongoDB
                async function getUsers() {
                        try {
                                coll = await client.db('auth_demo_app').collection('users')             //Séléction de la collection
                                cursor = await coll.find({ Email: EmailUser, Password: PasswordUser })  //Recherche dans la base
                                return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                        } catch (e) {
                                console.error('Error:', e)
                        }
                };
                async function getRole() {
                        try {
                                coll = await client.db('auth_demo_app').collection('role')             //Séléction de la collection
                                cursor = await coll.find({ Name: session.user_type })  //Recherche dans la base
                                return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                        } catch (e) {
                                console.error('Error:', e)
                        }
                };

                (async function () {
                        let docsList = await getUsers()                //Attend l'execution de la fonction getUsers pour récupérer l'array

                        if (docsList.length >= 1) {                    //Si il trouve un ou plusieur utilisateur ayant ce mot de passe et adresse email
                                session.user_email = EmailUser;
                                session.user_name = docsList[0]["Name"];
                                session.user_surname = docsList[0]["Surname"];
                                session.user_company = docsList[0]["Company"];
                                session.user_contact_no = docsList[0]["Contact_no"];
                                session.user_type = docsList[0]["Type"];
                                session.user_subscription = docsList[0]["Forfait"];
                                
                                let docsRole = await getRole();
                                console.log('Fetched documents:', docsRole)    //Affichage des data sur l'utilisateur
                                session.user_PermsProd = docsRole[0]["PermsProd"];
                                session.user_PermsUser = docsRole[0]["PermsUser"];
                                session.user_PermsRole = docsRole[0]["PermsRole"];
                                
                                res.redirect('./acceuil')              //redirection vers la page d'acceuil 
                        } else {
                                res.redirect('/')                      //Sinon vers formulaire login
                        }
                })();



        },
        Logout: (req, res) => {
                session.user_email = ""
                session.user_name = ""
                session.user_surname = ""
                session.user_company = ""
                session.user_contact_no = ""
                session.user_type = ""
                session.user_subscription = ""
                session.user_PermsProd = ""
                session.user_PermsUser = ""
                session.user_PermsRole = ""

                res.redirect('/');
        },
        
        PasswordRecovery: (req, res) => {
                res.render("./PasswordRecovery.ejs");

        },
        
        RecoveryConfig: (req, res) => {
                //Récupération des variable du formulaire :
                var EmailRecovery = req.body.email
                var Contact_noRecovery = req.body.contact_no
                const transporter = nodemailer.createTransport({
                        port: 587,               // true for 465, false for other ports
                        host: "smtp.office365.com",
                        auth: {
                                user: 'noreply-secure@aproma-conseils.fr',
                                pass: "CRIT'Air1-69570@!",
                        },
                        secureConnection: false,
                        tls: { ciphers: 'SSLv3' }
                });
                //Fonction asynchrone pour récupération des data de MongoDB
                async function getUsersRecovery() {
                        try {
                                coll = await client.db('auth_demo_app').collection('users')             //Séléction de la collection
                                cursor = await coll.find({ Email: EmailRecovery, Contact_no: Contact_noRecovery })  //Recherche dans la base
                                return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                        } catch (e) {
                                console.error('Error:', e)
                        }
                };
                (async function () {
                        let docsList = await getUsersRecovery()
                        console.log('Fetched documents:', docsList)
                        // create reusable transporter object using the default SMTP transportconst transporter 

                        if (docsList.length === 1) {
                                const mailData = {
                                        from: 'noreply-secure@aproma-conseils.fr',  // sender address
                                        to: EmailRecovery,                          // list of receivers
                                        subject: 'DOMAP Sécurité de vos mot de passe',
                                        text: 'That was easy!',
                                        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>', //AJOUTER LE MESSAGE + PASSWORD
                                };
                                transporter.sendMail(mailData, function (err, info) {
                                        if (err)
                                                console.log(err)
                                        else
                                                console.log(info);

                                });
                        } else {
                                res.redirect('/')
                        }
                })();


        },
        
        // ---------- SOCIETE ---------- 
        Societe: (req, res) => {
                if (session.user_type == "superadmin" || session.user_type == "admin_users") {

                        async function getRole() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('societe')             //Séléction de la collection
                                        cursor = await coll.find({})  //Recherche dans la base
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        };
                        (async function () {
                                let docsList = await getRole()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                                res.render("./sideSociete.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docList: docsList
                                });

                        })();


                } else {
                        res.redirect('/')
                }


        },

        // ---------- UTILISATEUR ---------- 
        Utilisateur: (req, res) => {
                if (session.user_PermsUser == "True") {

                        async function getUtilisateur() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('users')             //Séléction de la collection
                                        cursor = await coll.find({})               //Recherche dans la base
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        };
                        (async function () {
                                let docsList = await getUtilisateur()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                                res.render("./sideUsers.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docList: docsList
                                });
                                console.log(docsList)
                        })();


                } else {
                        res.redirect('/')
                }

        },
        UtilisateurEdit: (req, res) => {
                if (session.user_PermsUser == "True") {
                        let idUsers = req.params.id;
                        async function getUtilisateur() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('users')             //Séléction de la collection
                                        cursor = await coll.find({ _id: ObjectId(req.params.id) })               //Recherche dans la base
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        };
                        async function getRole() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('role')             //Séléction de la collection
                                        cursor = await coll.find({})                                            //Recherche dans la base
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        };
                        (async function () {
                                let docsList = await getUtilisateur()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                                let docsListRole = await getRole()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                                res.render("./sideEditUsers.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docList: docsList,
                                        sess_docListRole: docsListRole
                                });
                                console.log(docsList)
                                console.log(docsListRole)
                        })();
                    
                        
                } else {
                        res.redirect('/')
                }


        },
        ConfigEditUser: (req, res) => {
                if (session.user_PermsUser == "True") {
                var name = req.body.nom
                var surname = req.body.prenom
                var societe = req.body.societe
                var email = req.body.email
                var contact_no = req.body.tel
                var type = req.body.type
                var subscribtion = req.body.forfait



                        const database = client.db("auth_demo_app");
                        const collectionInDB = database.collection("users");

                        const result = collectionInDB.updateOne({ _id: ObjectId(req.params.id) }, {
                                $set: {
                                        Name: name,
                                        Surname: surname,
                                        Company: societe,
                                        Email: email,
                                        Company: societe,
                                        Contact_no: contact_no,
                                        Type: type,
                                        Forfait: subscribtion
                                }
                        });
                }
                res.redirect('/utilisateur')
        },
        UtilisateurDel: (req, res) => {
                if (session.user_PermsUser == "True") {
                (async function () {
                        const database = client.db("auth_demo_app");
                        const collectionInDB = database.collection("users");
                        const result = collectionInDB.deleteOne({ _id: ObjectId(req.params.id) });
                        res.redirect('/utilisateur')
                })();
        }
        },
        // ---------- ENREGISTREMENT----------
        Register: (req, res) => {
                res.render("./register.ejs");

        },
        RegisterUser: (req, res) => {
                var name = req.body.nom
                var surname = req.body.prenom
                var societe = req.body.societe
                var password = req.body.password
                var confirm_pwd = req.body.confirm_password
                var email = req.body.email
                var contact_no = req.body.tel


                async function getEmail() {
                        try {
                                coll = await client.db('auth_demo_app').collection('users')
                                cursor = await coll.find({ 'Email': email })

                                return cursor.toArray()
                        } catch (e) {
                                console.error('Error:', e)
                        }
                };
                
                (async function () {
                        let docsList = await getEmail()

                        if (docsList.length == 0) {
                                if (password == confirm_pwd) {
                                        const user = {
                                                Name: name,
                                                Surname: surname,
                                                Company: societe,
                                                Password: password,
                                                Email: email,
                                                Contact_no: contact_no,
                                                Type: "users",
                                                Forfait: "Free"
                                        }
                                        const database = client.db("auth_demo_app");
                                        const collectionInDB = database.collection("users");

                                        const result = collectionInDB.insertOne(user);

                                        console.log("Les information suivante on été insérée :")
                                        console.log(user)

                                        res.redirect('/')
                                } else {
                                        console.log("Les mots de passe ne sont pas identique")
                                        res.redirect('/register')
                                }
                        } else {
                                console.log("Deux email identique dans la DB")
                                res.redirect('/register')
                        }
                })();


        },

        // ---------- PRODUIT ----------
        Product: (req, res) => {
                if (session.user_email) {
                        res.render("./sideProduct.ejs", {
                                sess_email: session.user_email,
                                sess_name: session.user_name,
                                sess_surname: session.user_surname,
                                sess_company: session.user_company,
                                sess_contact_no: session.user_contact_no,
                                sess_type: session.user_type,
                                sess_subscription: session.user_subscription,
                                sess_PermsProd: session.user_PermsProd,
                                sess_PermsUser: session.user_PermsUser,
                                sess_PermsRole: session.user_PermsRole,
                        });
                } else {
                        res.redirect('/')
                }

        },
        ProductDetails: (req, res) => {
                if (session.user_PermsProd == "True") {
                        var date = req.params.date // date 2021

             
                        var productNC2 = req.params.id // 01
                        productNC2Regex = new RegExp("^"+productNC2); 
                        async function getProduct() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('Produit')   
                                                  //Séléction de la collection
                                        cursor = await coll.find({PERIOD: {$regex: date},PRODUCT_NC:{$regex : productNC2Regex}});  
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        }
                      
                        (async function () {
                                let docsListProduct = await getProduct()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                              
                                res.render("./sideProductQuery.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docListProduct: docsListProduct
                                });
                                
                        })();
        
                  
                };

        },
        ProductDetailsNC8: (req, res) => {
                if (session.user_PermsProd == "True") {
                        var date = req.params.date // date 2021
                        var productNC2 = req.params.id // 01

                        productNC2Regex = new RegExp("^"+productNC2); 
                        async function getProduct() {
                                try {
                                        coll = await client.db('auth_demo_app').collection('Produit')             //Séléction de la collection
                                        cursor = await coll.find({PERIOD: {$regex: date},PRODUCT_NC:{$regex : productNC2Regex}});  
                                        return cursor.toArray()                                                 //retourne un array contenant toute les information sur l'utilisateur ou un array vide
                                } catch (e) {
                                        console.error('Error:', e)
                                }
                        }
                      
                        (async function () {
                                let docsListProduct = await getProduct()                //Attend l'execution de la fonction getUsers pour récupérer l'array
                              console.log(docsListProduct)
                                res.render("./sideProductDetails.ejs", {
                                        sess_email: session.user_email,
                                        sess_name: session.user_name,
                                        sess_surname: session.user_surname,
                                        sess_company: session.user_company,
                                        sess_contact_no: session.user_contact_no,
                                        sess_type: session.user_type,
                                        sess_subscription: session.user_subscription,
                                        sess_PermsProd: session.user_PermsProd,
                                        sess_PermsUser: session.user_PermsUser,
                                        sess_PermsRole: session.user_PermsRole,
                                        sess_docListProduct: docsListProduct
                                });
                                
                        })();
        
                  
                };

        },
}
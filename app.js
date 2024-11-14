const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const mongoUrl = "mongodb+srv://khalilouedraogo:admin@cluster0.ikpeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log(e);
});

require('./UserDetails');
require('./Classe');
require('./Absences');
require('./Devoirs');
require('./Eleves');
require('./Matieres');
require('./Notes');
require('./Parents');
require('./Professeur');
require('./Surveillants');
require('./Utilisateur');
require('./Admin');

const User = mongoose.model("UserInfo");
const User_Professeur = mongoose.model("Professeur");
const User_Parent = mongoose.model("Parent");
const User_Eleve = mongoose.model("Eleves");
const User_Surveillant = mongoose.model("Surveillants");
const User_Admin = mongoose.model("Admin");
const Classe = mongoose.model("Classe");  

app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { identifiant, nom, prenom, telephone, password, userType, matiere, classe, DateNaissance,NiveauClasse } = req.body;
  console.log(req.body);

  // Vérifie si les champs requis sont fournis
  if (!identifiant || !password || !userType) {
      return res.status(400).send({ status: "error", data: "Identifiant, password and userType are required." });
  }

  // Vérifie si l'utilisateur existe dans n'importe quel modèle
  const userExists = await User.findOne({ identifiant: identifiant }) ||
                     await User_Professeur.findOne({ identifiant: identifiant }) ||
                     await User_Parent.findOne({ identifiant: identifiant }) ||
                     await User_Eleve.findOne({ identifiant: identifiant }) ||
                     await User_Surveillant.findOne({ identifiant: identifiant }) ||
                     await User_Admin.findOne({ identifiant: identifiant });

  if (userExists) {
      // Envoie un message d'erreur si l'utilisateur existe déjà dans n'importe quel modèle
      return res.status(409).send({ status: "error", data: "Cet utilisateur existe déjà !!" });
  }

  try {
      // Logique de création d'un utilisateur en fonction du userType
      if (userType === "Admin") {
          await User_Admin.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Admin Created" });
      } else if (userType === "Professeur") {
          await User_Professeur.create({ identifiant, nom, prenom, telephone, password, matiere, userType });
          return res.send({ status: "ok", data: "Professeur Created" });
      } else if (userType === "Eleve") {
          await User_Eleve.create({ identifiant, nom, prenom, telephone, password, classe, DateNaissance, userType,NiveauClasse });
          return res.send({ status: "ok", data: "Eleve Created" });
      } else if (userType === "Parent") {
          await User_Parent.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Parent Created" });
      } else if (userType === "Surveillant") {
          await User_Surveillant.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Surveillant Created" });
      } else {
          return res.status(400).send({ status: "error", data: "Invalid userType" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send({ status: "error", data: "Internal server error" });
  }
});

app.post("/registerClasse", async (req, res) => {
    const { nomClasse, niveau, capacite } = req.body;
    console.log(req.body);
  
    // Vérifie si tous les champs sont remplis
    if (!nomClasse || !niveau || !capacite) {
      return res.status(400).send({ status: "error", data: "Tous les champs sont requis." });
    }
  
    // Vérifie si la classe existe déjà
    const classExists = await Classe.findOne({ nomClasse, niveau });
    if (classExists) {
      return res.status(409).send({ status: "error", data: "Cette classe existe déjà." });
    }
  
    try {
      // Crée la classe
      await Classe.create({ nomClasse, niveau, capacite });
      return res.send({ status: "ok", data: "Classe créée avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: "error", data: "Erreur interne du serveur" });
    }
  });
  


app.post("/login-user", async (req, res) => {
  const { identifiant, password } = req.body;
  console.log(req.body);

  let oldUser;

  try {
    // Vérification dans toutes les collections possibles
    oldUser = await User.findOne({ identifiant }) ||
               await User_Professeur.findOne({ identifiant }) ||
               await User_Parent.findOne({ identifiant }) ||
               await User_Eleve.findOne({ identifiant }) ||
               await User_Surveillant.findOne({ identifiant }) ||
               await User_Admin.findOne({ identifiant });

    // Vérification si l'utilisateur existe
    if (!oldUser) {
      return res.send({ data: "User doesn't exist!" });
    }

    // Comparer les mots de passe
    const isPasswordValid = oldUser.password === password; // Enlever bcrypt
    if (!isPasswordValid) {
      return res.send({ status: "error", data: "Invalid password" });
    }

    // Génération d'un token JWT
    const token = jwt.sign({ identifiant: oldUser.identifiant, userType: oldUser.userType }, JWT_SECRET);
    console.log("Token generated:", token);

    return res.status(201).send({
      status: "ok",
      data: token,
      userType: oldUser.userType,
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.send({ status: "error", data: "Something went wrong!" });
  }
});


app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
      const user = jwt.verify(token, JWT_SECRET);
      const useridentifiant = user.identifiant;
      const userType = user.userType; // Obtenez le userType du token

      let userData;

      // Recherche de l'utilisateur dans la collection correspondante selon le userType
      if (userType === "Admin") {
          userData = await User_Admin.findOne({ identifiant: useridentifiant });
      } else if (userType === "Professeur") {
          userData = await User_Professeur.findOne({ identifiant: useridentifiant });
      } else if (userType === "Eleve") {
          userData = await User_Eleve.findOne({ identifiant: useridentifiant });
      } else if (userType === "Parent") {
          userData = await User_Parent.findOne({ identifiant: useridentifiant });
      } else if (userType === "Surveillant") {
          userData = await User_Surveillant.findOne({ identifiant: useridentifiant });
      }

      // Si aucune donnée utilisateur trouvée
      if (!userData) {
          return res.status(404).send({ status: "error", data: "User not found." });
      }

      return res.send({ status: "Ok", data: userData });
  } catch (error) {
      return res.status(401).send({ status: "error", data: "Invalid token." });
  }
});


app.put("/update-user", async (req, res) => {
    const { identifiant, nom, prenom, telephone, password, userType } = req.body;
 

    try {
        
      let user;
      switch (userType) {
        case 'professeur':
          user = await User_Professeur.findOne({ identifiant });
          break;
          case 'Parent':
          user = await User_Parent.findOne({ identifiant });
          break;
        case 'Admin':
          user = await User_Admin.findOne({ identifiant });
          break;
        case 'Eleve':
          user = await User_Eleve.findOne({ identifiant });
          break;
        default:
          return res.status(400).json({ status: 'error', message: 'Type d\'utilisateur non valide' });
      }
  
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Utilisateur non trouvé' });
      }
  
      // Mise à jour des données de l'utilisateur
      user.nom = nom;
      user.prenom = prenom;
      user.telephone = telephone;
      user.password = password;
      
      await user.save();
  
      res.status(200).json({ status: 'Ok', message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la mise à jour' });
    }
  });
  

app.get("/get-all-user", async (req, res) => {
    try {
        // Récupérer les données de chaque modèle utilisateur
        const admins = await User_Admin.find({});
        const professeurs = await User_Professeur.find({});
        const eleves = await User_Eleve.find({});
        const parents = await User_Parent.find({});
        const surveillants = await User_Surveillant.find({});

        // Fusionner toutes les données des utilisateurs
        const allUsers = [
            ...admins.map(user => ({ ...user.toObject(), userType: "Admin" })),
            ...professeurs.map(user => ({ ...user.toObject(), userType: "Professeur" })),
            ...eleves.map(user => ({ ...user.toObject(), userType: "Eleve" })),
            ...parents.map(user => ({ ...user.toObject(), userType: "Parent" })),
            ...surveillants.map(user => ({ ...user.toObject(), userType: "Surveillant" }))
        ];

        res.send({ status: "Ok", data: allUsers });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", data: "Internal server error." });
    }
});
// Route pour obtenir toutes les classes
app.get('/get-all-classes', async (req, res) => {
    try {
        // Récupérer le niveau depuis les paramètres de la requête
        const { niveau } = req.query;

        // Filtrer les classes selon le niveau sélectionné
        const classes = await Classe.find({ niveau }).select('nomClasse niveau');

        res.json({ status: 'ok', classes });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error', message: 'Erreur lors de la récupération des classes' });
    }
});

// Pour obtenir tous les élèves sans tableau
app.get('/get-eleves-by-niveau', async (req, res) => {
    const { niveau } = req.query; // On récupère le niveau depuis les paramètres de requête
    
    try {
        const eleves = await User_Eleve.find({ NiveauClasse: niveau }).select('identifiant nom prenom'); // Filtrage par niveau
        
        if (eleves.length === 0) {
            return res.json({ status: 'ok', message: 'Aucun élève trouvé pour ce niveau' });
        }
        
        res.json({ status: 'ok', eleves: eleves }); // Retourne un objet avec la clé 'eleves'
    } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
        res.json({ status: 'error', message: 'Erreur lors de la récupération des élèves' });
    }
});






// Route pour obtenir tous les professeurs
app.get('/get-all-professeurs', async (req, res) => {
    try {
        // Utilise mongoose pour obtenir tous les professeurs depuis la collection Professeur
        const professeurs = await User_Professeur.find({}).select('identifiant nom prenom');
        
        // Crée une structure de réponse avec le label combiné de nom et prénom
        const professeursAvecLabel = professeurs.map(prof => ({
            identifiant: prof.identifiant,
            label: `${prof.nom} ${prof.prenom}` // Combine nom et prénom
        }));
        
        res.json({ status: 'ok', professeurs: professeursAvecLabel });
    } catch (error) {
        console.error('Erreur lors de la récupération des professeurs:', error);
        res.json({ status: 'error', message: 'Erreur lors de la récupération des professeurs' });
    }
});

// Route pour obtenir toutes les classes
app.get('/get-all-classes', async (req, res) => {
    try {
        // Récupérer toutes les classes depuis la collection Classe
        const classes = await Classe.find({}).select('nomClasse');
        res.json({ status: 'ok', classes });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error', message: 'Erreur lors de la récupération des classes' });
    }
});


// Route pour assigner une classe à un professeur
app.post('/assign-class-to-professeur', async (req, res) => {
    const { professeurIdentifiant, nomClasse } = req.body; // Modification des noms des champs reçus

    try {
        // Trouver la classe par son nom
        const classe = await Classe.findOne({ nomClasse });
        if (!classe) {
            return res.status(404).send({ status: "error", data: "Classe introuvable" });
        }

        // Mettre à jour la classe avec l'identifiant du professeur
        const updatedClasse = await Classe.updateOne(
            { nomClasse },
            { $set: { professeur_identifiant: professeurIdentifiant } }  // Enregistrer avec identifiant
        );

        if (updatedClasse.nModified === 0) {
            return res.status(404).send({ status: "error", data: "Impossible d'attribuer la classe" });
        }

        res.json({ status: 'ok', message: 'Classe attribuée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'attribution de la classe:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'attribution de la classe' });
    }
});
// Route pour assigner une classe aux élèves d'un niveau sélectionné
app.post('/assign-class-to-eleves', async (req, res) => {
    const { niveau, nomClasse } = req.body; // Récupérer le niveau et le nom de la classe

    try {
        // Trouver la classe par son nom
        const classe = await Classe.findOne({ nomClasse });
        if (!classe) {
            return res.status(404).send({ status: "error", message: "Classe introuvable" });
        }

        // Mettre à jour les élèves du niveau sélectionné avec la classe
        const updatedEleves = await Eleve.updateMany(
            { niveau },
            { $set: { classe: nomClasse } }  // Attribuer la classe aux élèves du niveau sélectionné
        );

        if (updatedEleves.nModified === 0) {
            return res.status(404).send({ status: "error", message: "Aucun élève mis à jour pour ce niveau" });
        }

        res.json({ status: 'ok', message: 'Classe attribuée aux élèves avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'attribution de la classe aux élèves:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'attribution de la classe aux élèves' });
    }
});





  

app.post("/delete-user", async (req, res) => {
    const { identifiant, userType } = req.body;

    try {
        let deletedUser;

        // Suppression en fonction du type d'utilisateur
        switch (userType) {
            case 'Professeur':
                deletedUser = await User_Professeur.deleteOne({ identifiant });
                break;
            case 'Admin':
                deletedUser = await User_Admin.deleteOne({ identifiant });
                break;
            case 'Eleve':
                deletedUser = await User_Eleve.deleteOne({ identifiant });
                break;
            case 'Parent':
                deletedUser = await User_Parent.deleteOne({ identifiant });
                break;
            default:
                return res.status(400).send({ status: "error", data: "Type d'utilisateur non valide." });
        }

        if (deletedUser.deletedCount === 0) {
            return res.status(404).send({ status: "error", data: "Utilisateur non trouvé." });
        }

        res.send({ status: "Ok", data: "Utilisateur supprimé avec succès." });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", data: "Erreur interne du serveur." });
    }
});


app.listen(5000, () => {
    console.log("Node js server started.");
   
});
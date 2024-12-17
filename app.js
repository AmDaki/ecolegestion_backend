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
require ('./EmploiTemps');


const User = mongoose.model("UserInfo");
const User_Professeur = mongoose.model("Professeur");
const User_Parent = mongoose.model("Parent");
const User_Eleve = mongoose.model("Eleves");
const User_Surveillant = mongoose.model("Surveillants");
const User_Admin = mongoose.model("Admin");
const Classe = mongoose.model("Classe");  
const EmploiTemps=mongoose.model("EmploiTemps");
const Eleves=mongoose.model("Eleves")
const Professeur = mongoose.model("Professeur");
const Absence = mongoose.model("Absence");


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
  
  app.post('/save-emploitemps', async (req, res) => {
    const { classe, emploiDuTemps } = req.body;
  
    if (!classe || !emploiDuTemps) {
      return res.status(400).json({ status: 'error', message: 'Données manquantes.' });
    }
  
    try {
      // Vérifie si un emploi du temps existe déjà pour cette classe
      let existingSchedule = await EmploiTemps.findOne({ classe });
  
      if (existingSchedule) {
        // Met à jour l'emploi du temps existant
        existingSchedule.emploiDuTemps = emploiDuTemps;
        await existingSchedule.save();
      } else {
        // Crée un nouvel emploi du temps
        const newSchedule = new EmploiTemps({ classe, emploiDuTemps });
        await newSchedule.save();
      }
  
      res.json({ status: 'ok', message: 'Emploi du temps enregistré avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      res.status(500).json({ status: 'error', message: 'Erreur interne du serveur.' });
    }
  });
  
  app.post('/auth-professeur', async (req, res) => {
    const { identifiant } = req.body;
  
    try {
      const professeur = await Professeur.findOne({ identifiant });
      if (!professeur) {
        return res.status(404).json({ message: 'Professeur introuvable' });
      }
  
      res.status(200).json({
        success: true,
        professeur, // Retourne les informations du professeur, y compris ses classes
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l’identifiant:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // app.get('/professeur-classes/:identifiant', async (req, res) => {
  //   const { identifiant } = req.params;
  
  //   try {
  //     const professeur = await Professeur.findOne({ identifiant }).populate('classes');
  //     if (!professeur) {
  //       return res.status(404).json({ success: false, message: 'Professeur introuvable' });
  //     }
  
  //     res.status(200).json({ success: true, classes: professeur.classes });
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des classes :', error);
  //     res.status(500).json({ success: false, message: 'Erreur serveur' });
  //   }
  // });


  app.post('/auth/login', async (req, res) => {
    const { identifiant, password } = req.body;
  
    try {
      const professeur = await Professeur.findOne({ identifiant });
  
      if (!professeur) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
  
      if (professeur.password !== password) {
        return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
      }
  
      // Réponse avec l'identifiant et autres données nécessaires
      res.status(200).json({
        success: true,
        identifiant: professeur.identifiant,
        nom: professeur.nom,
        prenom: professeur.prenom,
        classes: professeur.classes,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  });

  
  app.get("/professeur-classes/:professeurIdentifiant", async (req, res) => {
    const { professeurIdentifiant } = req.params;
  
    try {
      // Chercher le professeur par identifiant
      const professeur = await Professeur.findOne({ identifiant: professeurIdentifiant });
  
      if (!professeur) {
        return res.status(404).json({ message: "Professeur introuvable." });
      }
  
      // Retourner les classes assignées
      res.json({ classes: professeur.classes });
    } catch (error) {
      console.error("Erreur lors de la récupération des classes :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
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
  
      // Renvoi des informations à la réponse, y compris l'identifiant de l'utilisateur
      return res.status(201).send({
        status: "ok",
        data: token,
        userType: oldUser.userType,
        identifiant: oldUser.identifiant,  // Ajout de l'identifiant ici
      });
  
    } catch (error) {
      console.error("Error during login:", error);
      return res.send({ status: "error", data: "Something went wrong!" });
    }
  });
  
  app.get("/classes/:id/eleves", async (req, res) => {
    const { id } = req.params;
  
    try {
      const classe = await Classe.findById(id).populate("eleves"); // Récupérer les élèves liés à la classe
      if (!classe) {
        return res.status(404).send({ status: "error", data: "Classe not found" });
      }
  
      return res.status(200).send({
        status: "ok",
        eleves: classe.eleves, // Liste des élèves dans cette classe
      });
  
    } catch (error) {
      console.error("Error fetching class data:", error);
      return res.status(500).send({ status: "error", data: "Internal server error" });
    }
  });

  app.post("/save-absences", async (req, res) => {
    const { classeId, absents } = req.body;
  
    try {
      const classe = await Classe.findById(classeId);
      if (!classe) {
        return res.status(404).send({ status: "error", data: "Classe not found" });
      }
  
      // Enregistrez les absences (à adapter selon votre modèle)
      for (const eleveId of absents) {
        await Absence.create({ eleve: eleveId, classe: classeId, date: new Date() });
      }
  
      return res.status(200).send({ status: "ok", data: "Absences enregistrées" });
    } catch (error) {
      console.error("Error saving absences:", error);
      return res.status(500).send({ status: "error", data: "Internal server error" });
    }
  });
  

app.put('/enregistrer-absence', async (req, res) => {
  const { identifiantProfesseur, classe, absences } = req.body;

  try {
    const professeur = await Professeur.findOne({ identifiant: identifiantProfesseur });
    
    if (!professeur || !professeur.classes.includes(classe)) {
      return res.status(400).json({ error: "Le professeur n'est pas assigné à cette classe" });
    }

    for (let absence of absences) {
      const eleve = await Eleve.findOne({ identifiant: absence.eleveIdentifiant });

      if (eleve && eleve.classes.includes(classe)) {
        eleve.absences.push({ date: new Date(), estAbsent: absence.estAbsent });
        await eleve.save();
      }
    }

    res.status(200).json({ status: "Absences enregistrées avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get('/professeur-classes/:identifiant', async (req, res) => {
  const { identifiant } = req.params;

  try {
    const professeur = await User_Professeur.findOne({ identifiant: identifiant });

    if (!professeur) {
      return res.status(404).json({ error: "Professeur non trouvé" });
    }

    // Retourner les classes assignées au professeur
    res.status(200).json({
      status: "ok",
      classes: professeur.classes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
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
        const classes = await Classe.find({}).select('nomClasse niveau');
        if (!classes.length) {
            return res.status(404).json({ status: 'error', message: 'Aucune classe trouvée.' });
        }
        res.json({ status: 'ok', classes });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ status: 'error', message: 'Erreur serveur.' });
    }
});


app.get('/get-eleves-by-niveau', async (req, res) => {
    const { niveau } = req.query; // On récupère le niveau depuis les paramètres de requête
    
    try {
        const eleves = await User_Eleve.find({ NiveauClasse: niveau }).select('identifiant nom prenom'); // Filtrage par niveau
        
        if (eleves.length === 0) {
            return res.json({ status: 'ok', message: 'Aucun élève trouvé pour ce niveau' });
        }
        
        // Retourne un objet avec la clé 'eleves' contenant les données
        res.json({ status: 'ok', eleves });
    } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
        res.json({ status: 'error', message: 'Erreur lors de la récupération des élèves' });
    }
});

app.get('/get-classes-by-niveau', async (req, res) => {
  const { niveau } = req.query; // Récupère le niveau depuis les paramètres de requête

  if (!niveau) {
      return res.json({ status: 'error', message: 'Le niveau est requis' });
  }

  try {
      // Rechercher les classes par niveau
      const classes = await Classe.find({ niveau: niveau }).select('nomClasse niveau');

      if (classes.length === 0) {
          return res.json({ status: 'ok', message: 'Aucune classe trouvée pour ce niveau' });
      }

      // Retourner les classes trouvées
      res.json({ status: 'ok', classes });
  } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      res.json({ status: 'error', message: 'Erreur lors de la récupération des classes' });
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

// Exemple d'endpoint pour récupérer les classes
app.get('/listClasses', async (req, res) => {
    try {
      const classes = await Classe.find().populate('professeur').populate('eleves'); // Exemple de structure
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des classes.' });
    }
  });

// Route pour assigner une classe à un professeur
// app.post('/assign-class-to-professeur', async (req, res) => {
//     const { professeurIdentifiant, nomClasse } = req.body; // Modification des noms des champs reçus

//     try {
//         // Trouver la classe par son nom
//         const classe = await Classe.findOne({ nomClasse });
//         if (!classe) {
//             return res.status(404).send({ status: "error", data: "Classe introuvable" });
//         }

//         // Mettre à jour la classe avec l'identifiant du professeur
//         const updatedClasse = await Classe.updateOne(
//             { nomClasse },
//             { $set: { professeur_identifiant: professeurIdentifiant } }  // Enregistrer avec identifiant
//         );

//         if (updatedClasse.nModified === 0) {
//             return res.status(404).send({ status: "error", data: "Impossible d'attribuer la classe" });
//         }

//         res.json({ status: 'ok', message: 'Classe attribuée avec succès' });
//     } catch (error) {
//         console.error('Erreur lors de l\'attribution de la classe:', error);
//         res.status(500).json({ status: 'error', message: 'Erreur lors de l\'attribution de la classe' });
//     }
// });

// Route pour assigner une classe aux élèves d'un niveau sélectionné
app.post('/assign-class-to-eleves', async (req, res) => {
  const { niveau, classeNom } = req.body;

  try {
      const classe = await Classe.findOne({ nomClasse: classeNom });
      if (!classe) {
          return res.status(404).send({ status: "error", message: "Classe introuvable" });
      }

      const updatedEleves = await Eleves.updateMany(
          { niveau },
          { $set: { classe: classeNom } }
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

app.put('/assign-classe', async (req, res) => {
  const { classeNom, identifiants } = req.body;

  // Vérification si les données nécessaires sont présentes
  if (!identifiants || !classeNom || identifiants.length === 0) {
    return res.status(400).json({ error: "Identifiants des élèves et classeNom sont requis" });
  }

  try {
    // Mettre à jour la classe pour chaque élève
    const updatedEleves = await Eleves.updateMany(
      { identifiant: { $in: identifiants } }, // Filtre sur les identifiants fournis
      { $set: { classe: classeNom } }, // Mise à jour de la classe
      { new: true } // Retourner les objets mis à jour
    );

    if (updatedEleves.nModified === 0) {
      return res.status(404).json({ error: "Aucun élève trouvé avec les identifiants fournis" });
    }

    res.status(200).json({
      message: "Classes attribuées avec succès",
      data: updatedEleves
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'attribution des classes" });
  }
});


app.put('/assign-classe', async (req, res) => {
  const { classeNom, identifiants } = req.body;

  // Vérification si les données nécessaires sont présentes
  if (!identifiants || !classeNom || identifiants.length === 0) {
    return res.status(400).json({ error: "Identifiants des élèves et classeNom sont requis" });
  }

  try {
    // Mettre à jour la classe pour chaque élève
    const updatedEleves = await Eleves.updateMany(
      { identifiant: { $in: identifiants } }, // Filtre sur les identifiants fournis
      { $set: { classe: classeNom } }, // Mise à jour de la classe
      { new: true } // Retourner les objets mis à jour
    );

    if (updatedEleves.nModified === 0) {
      return res.status(404).json({ error: "Aucun élève trouvé avec les identifiants fournis" });
    }

    res.status(200).json({
      message: "Classes attribuées avec succès",
      data: updatedEleves
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'attribution des classes" });
  }
});

app.put('/assign-classe-professeur', async (req, res) => {
  const { identifiant, classeNom } = req.body;

  if (!identifiant || !classeNom) {
      return res.status(400).json({ error: "Identifiant et classeNom sont requis" });
  }

  try {
      // Rechercher le professeur par son identifiant et mettre à jour la classe
      const updatedProfesseur = await Professeur.findOneAndUpdate(
          { identifiant },           // Filtre : identifiant unique
          { $push: { classes: classeNom } },  // Ajouter la classe à la liste des classes
          { new: true }              // Retourner l'objet mis à jour
      );

      if (!updatedProfesseur) {
          return res.status(404).json({ error: "Professeur non trouvé avec cet identifiant" });
      }

      res.status(200).json({
          message: "Classe attribuée au professeur avec succès",
          data: updatedProfesseur
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur lors de l'attribution de la classe au professeur" });
  }
});

app.put('/assign-class-to-professeur', async (req, res) => {
  const { professeurIdentifiant, nomClasses } = req.body;  // nomClasses doit être un tableau

  if (!professeurIdentifiant || !nomClasses || nomClasses.length === 0) {
    return res.status(400).json({ error: "Identifiant du professeur et nom de la classe sont requis" });
  }

  try {
    const professeur = await Professeur.findOne({ identifiant: professeurIdentifiant });

    if (!professeur) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }

    // Vérification des classes déjà attribuées
    const duplicateClasses = nomClasses.filter(nomClasse => professeur.classes.includes(nomClasse));
    if (duplicateClasses.length > 0) {
      return res.status(400).json({ error: 'DuplicateAssignment' });
    }

    // Ajout des nouvelles classes
    professeur.classes.push(...nomClasses);  // Ajouter plusieurs classes
    await professeur.save();

    res.status(200).json({
      status: 'ok',
      data: professeur
    });
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    res.status(500).json({ error: "Erreur serveur lors de l'attribution de la classe" });
  }
});



app.post('/save-emploitempss', async (req, res) => {
  const { token } = req.body;

  try {
    // Vérifier si l'élève est authentifié et récupérer sa classe
    const eleve = await Eleves.findOne({ token: token });

    if (!eleve) {
      return res.status(404).json({ error: "Élève non trouvé" });
    }

    const classe = eleve.classe;  // Correction ici

    // Récupérer l'emploi du temps de l'élève en fonction de sa classe
    const emploisTemps = await EmploiTemps.find({ classe: classe });

    if (!emploisTemps || emploisTemps.length === 0) {
      return res.status(404).json({ error: "Emploi du temps non trouvé pour cette classe" });
    }

    res.status(200).json({ emploiDuTemps: emploisTemps });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps :', error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'emploi du temps" });
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
app.put('/update-classe', (req, res) => {
  const { classe, eleveId } = req.body;

  Classe.findOneAndUpdate(
    { nomClasse: classe },
    { $push: { eleves: eleveId } },
    { new: true }
  )
    .then((updatedClasse) => {
      res.json({ status: 'ok', classe: updatedClasse });
    })
    .catch((error) => {
      res.status(500).json({ status: 'error', message: error.message });
    });
});

app.put('/update-eleve', (req, res) => {
  const { eleveId, classe } = req.body;

  Eleve.findByIdAndUpdate(eleveId, { classe }, { new: true })
    .then((updatedEleve) => {
      res.json({ status: 'ok', eleve: updatedEleve });
    })
    .catch((error) => {
      res.status(500).json({ status: 'error', message: error.message });
    });
});



app.get('/classes/:classeId/eleves', async (req, res) => {
  const { classeId } = req.params;
  try {
      const eleves = await Eleves.find({ classeId });
      res.status(200).json(eleves);
  } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des élèves.' });
  }
});


app.get('/professeur/:identifiant', async (req, res) => {
  const { identifiant } = req.params;

  try {
    // Rechercher le professeur et peupler les classes associées
    const professeur = await User_Professeur.findOne({ identifiant }).populate('classes');

    if (!professeur) {
      return res.status(404).json({ message: "Professeur non trouvé." });
    }

    res.json(professeur.classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des classes." });
  }
});


app.get('/professeur-classes/:identifiant', async (req, res) => {
  const professeur = await User_Professeur.findOne({ identifiant: req.params.identifiant });
  if (!professeur) {
    return res.status(404).json({ success: false, message: 'Professeur non trouvé' });
  }
  // Ajoutez l'identifiant dans la réponse
  res.json({
    success: true,
    data: {
      identifiant: professeur.identifiant,
      classes: professeur.classes,
    },
  });
});

// Route pour récupérer les élèves d'une classe
app.get('/classe/:classe', async (req, res) => {
  const { classe } = req.params; // Extraire la classe depuis les paramètres

  try {
    // Trouver les élèves ayant la classe spécifiée
    const eleves = await Eleves.find({ classe });

    // Si aucun élève trouvé, retourner un message d'erreur
    if (eleves.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun élève trouvé pour cette classe.',
      });
    }

    // Retourner les élèves trouvés
    return res.status(200).json({
      success: true,
      eleves,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves :', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
});

app.post('/api/absences', async (req, res) => {
  const { professeurId, classe, absents } = req.body;

  if (!professeurId || !classe || !absents || !Array.isArray(absents)) {
    return res.status(400).json({
      success: false,
      message: 'Données manquantes ou invalides. Veuillez vérifier les informations envoyées.',
    });
  }

  try {
    // Enregistrer les absences dans la base de données
    const result = await Absence.create({
      professeurId,
      classe,
      absents,
      date: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: 'Absences enregistrées avec succès.',
      result,
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des absences :', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
});

app.get('/professeur-classess/:professeurIdentifiant', async (req, res) => {
  try {
    const { professeurIdentifiant } = req.params;

    // Trouver le professeur avec l'identifiant
    const professeur = await Professeur.findOne({ identifiant: professeurIdentifiant });

    if (!professeur) {
      return res.status(404).json({ success: false, message: 'Professeur non trouvé' });
    }

    // Renvoyer les classes
    res.status(200).json({ success: true, classes: professeur.classes });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});


const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');


// Middleware pour parser les JSON


// Endpoint pour recevoir les fichiers


    // Sauvegarder les notes dans la base de données (MongoDB ou autre)
    // Exemple avec Mongoose
    /*
    const Note = mongoose.model('Note', new mongoose.Schema({
      nom: String,
      prenom: String,
      classe: String,
      matiere: String,
      note: Number,
      commentaire: String,
    }));

    await Note.insertMany(notes);
    */

    // Supprimer le fichier temporaire


// Modèle MongoDB
const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  content: String, // Base64
});
const File = mongoose.model('File', fileSchema);

// Route : Sauvegarder un fichier
app.post('/upload-file', async (req, res) => {
  const { name, type, content } = req.body;
  const file = new File({ name, type, content });
  await file.save();
  res.json({ success: true });
});

// Route : Récupérer les fichiers
app.get('/get-files', async (req, res) => {
  const files = await File.find({}, { content: 0 }); // Ne pas renvoyer le contenu
  res.json({ success: true, files });
});

// Route : Télécharger un fichier
app.get('/download-file/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (file) {
    res.json({ success: true, content: file.content });
  } else {
    res.json({ success: false });
  }
});



app.get('/mes-notes/:nomClasse', async (req, res) => {
  const { nomClasse } = req.params;

  try {
    const classe = await Classe.findOne({ nomClasse }).populate('eleves');
    if (!classe) {
      return res.status(404).json({ success: false, message: 'Classe non trouvée.' });
    }

    // Récupérer les fichiers associés à la classe
    res.status(200).json({ success: true, files: classe.files || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des notes.' });
  }
});

app.get('/professeur-classes/:profId', async (req, res) => {
  const { profId } = req.params;
  try {
    const professeur = await Professeur.findOne({ identifiant: profId });

    if (!professeur) {
      return res.status(404).json({ success: false, message: 'Professeur non trouvé.' });
    }

    // Renvoyer les classes du professeur
    res.json({ success: true, classes: professeur.classes || [] });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});


// Configuration de Multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);  // Crée le dossier si il n'existe pas
    }
    cb(null, uploadDir);  // Spécifie où le fichier sera enregistré
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nom du fichier avec timestamp
  }
});

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // Crée le dossier si il n'existe pas
}


const upload = multer({ storage: storage });

// Route pour uploader les notes
const Fichier = require('./Fichier'); // Assurez-vous du chemin correct

app.post('/upload-notes', upload.single('file'), async (req, res) => {
  console.log('Requête reçue :');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Fichier:', req.file);


  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier téléchargé.' });
  }

  const { nomClasse } = req.body;

  try {
    // Créer un nouvel enregistrement pour le fichier
    const fichier = new Fichier({
      nomFichier: req.file.originalname,
      chemin: req.file.path,
      classe: nomClasse,
    });

    await fichier.save();

    // Mettre à jour les élèves de la classe concernée avec le fichier
    await Eleves.updateMany(
      { classe: nomClasse },
      { $push: { fichiers: fichier } } // Ajout de l'ID du fichier ou des détails selon votre structure
    );

    res.json({ success: true, message: 'Fichier téléchargé et associé à la classe.', fichier });
  } catch (error) {
    console.error('Erreur lors du téléchargement :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du téléchargement.' });
  }
});

// Route pour récupérer les fichiers d'une classe
// Route GET pour récupérer les fichiers des élèves d'une classe
app.get('/mes-notes/:nomClasse', async (req, res) => {
  const { nomClasse } = req.params;

  if (!nomClasse) {
    return res.status(400).json({ success: false, message: 'nomClasse est requis' });
  }

  try {
    const eleves = await Eleves.find({ classe: nomClasse });

    console.log('Élèves trouvés :', eleves); // Log complet des élèves

    if (!eleves.length) {
      console.log('Aucun élève trouvé pour la classe:', nomClasse);
      return res.status(404).json({ success: false, message: 'Aucun élève trouvé pour cette classe.' });
    }

    // Extraire les fichiers avec une vérification supplémentaire
    const fichiers = eleves.flatMap((eleve) => {
      console.log(`Fichiers pour ${eleve.nom} ${eleve.prenom}:`, eleve.fichiers);
      return eleve.fichiers || [];
    });

    console.log('Fichiers finaux récupérés :', fichiers);

    if (fichiers.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun fichier trouvé pour cette classe.' });
    }

    res.json({ success: true, files: fichiers });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});


app.post('/fetch-files', async (req, res) => {
  const { userToken } = req.body;  // Assurez-vous que le champ est bien 'userToken'
  
  if (!userToken) {
    return res.status(400).json({ message: 'Token manquant' });
  }

  try {
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const classe = user.classe;  // Récupérer la classe
    const files = await File.find({ classe });
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Aucun fichier trouvé' });
    }

    res.json({ files });
  } catch (error) {
    console.error('Erreur côté serveur:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

app.listen(5000, () => {
    console.log("Node js server started.");
   
});
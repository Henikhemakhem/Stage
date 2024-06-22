const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const cloudinary = require(path.resolve(__dirname, './config/cloudinary')); // Utilisation de path.resolve
const Formation = require('./Models/Formation');

mongoose.connect("mongodb://127.0.0.1:27017/stage", {
  // Remove deprecated options useNewUrlParser and useUnifiedTopology
  // They are no longer necessary in the latest MongoDB driver
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());

// Vérification de la configuration Cloudinary
console.log('Cloudinary Config:', JSON.stringify(cloudinary.config(), null, 2));

// Configuration de multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'formations', // Le dossier où les images seront stockées sur Cloudinary
    format: async (req, file) => 'jpg', // Format des images
    public_id: (req, file) => file.originalname, // Nom public sur Cloudinary
  },
});

const upload = multer({ storage: storage });

// Route pour créer une nouvelle formation avec upload d'image
app.post("/createformation", upload.single('image'), (req, res) => {
    const { title, description, category, duration, level } = req.body;
  
    // Check if required fields are missing
    if (!title || !description || !category || !duration || !level || !req.file) {
      return res.status(400).json({ message: "Missing required fields or image file" });
    }
  
    // Create a new Formation instance
    const newFormation = new Formation({
      title,
      description,
      category,
      duration,
      level,
      image: req.file.path, // Assuming req.file.path is correct
    });
  
    // Save the new Formation instance
    newFormation.save()
      .then(formation => res.json(formation))
      .catch(err => {
        console.error('Error saving formation:', err);
        res.status(500).json({ message: "Error saving formation", error: err });
      });
  });
  

// Autres routes
app.get("/formations", (req, res) => {
  Formation.find({})
    .then(formations => res.json(formations))
    .catch(err => res.status(400).json({ message: "Error fetching formations", error: err }));
});

app.get("/formation/:id", (req, res) => {
  const id = req.params.id;
  Formation.findById(id)
    .then(formation => {
      if (!formation) {
        return res.status(404).json({ message: "Formation not found" });
      }
      res.json(formation);
    })
    .catch(err => res.status(400).json({ message: "Error fetching formation", error: err }));
});
app.put("/updateformation/:id", (req, res) => {
    const id = req.params.id;
    Formation.findByIdAndUpdate(id, req.body, { new: true })
        .then(formation => {
            if (!formation) {
                return res.status(404).json({ message: "Formation not found" });
            }
            res.json(formation);
        })
        .catch(err => res.status(400).json({ message: "Error updating formation", error: err }));
});

app.delete("/deleteformation/:id", (req, res) => {
  const id = req.params.id;
  Formation.findByIdAndDelete(id)
    .then(formation => {
      if (!formation) {
        return res.status(404).json({ message: "Formation not found" });
      }
      res.json({ message: "Formation deleted successfully" });
    })
    .catch(err => res.status(400).json({ message: "Error deleting formation", error: err }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // files go inside 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage: storage });

// Serve static files (so uploaded files can be downloaded)
app.use('/uploads', express.static('uploads'));

// Home route → upload form
app.get('/', (req, res) => {
  res.send(`
    <h2>Upload Single File</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="myfile" />
      <button type="submit">Upload</button>
    </form>

    <h2>Upload Multiple Files</h2>
    <form action="/upload-multiple" method="POST" enctype="multipart/form-data">
      <input type="file" name="myfiles" multiple />
      <button type="submit">Upload</button>
    </form>
  `);
});


// Upload route
app.post('/upload', upload.single('myfile'), (req, res) => {
  res.send(`✅ File uploaded successfully! <br>
            <a href="/uploads/${req.file.filename}">Download ${req.file.originalname}</a>`);
});
// Upload route for multiple files
app.post('/upload-multiple', upload.array('myfiles', 5), (req, res) => {
  let fileLinks = req.files.map(file => 
    `<li><a href="/uploads/${file.filename}">${file.originalname}</a></li>`
  ).join('');

  res.send(`
    <h2>✅ Files uploaded successfully!</h2>
    <ul>${fileLinks}</ul>
  `);
});


// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

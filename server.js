const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد multer لتخزين الملفات المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('uploads'));

// معالجة رفع الملفات
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ filePath: `/${req.file.filename}` });
});

// عرض الملفات المرفوعة
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }
        res.send(files.map(file => `/${file}`));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

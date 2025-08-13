const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint to get images from a directory
app.get('/api/images', async (req, res) => {
  try {
    const imagesPath = process.env.REACT_APP_IMAGES_PATH || req.query.path;

    if (!imagesPath) {
      return res.status(400).json({
        error: 'Images path not provided',
        message: 'Please set REACT_APP_IMAGES_PATH environment variable or provide path query parameter'
      });
    }

    console.log('🔍 Looking for images in:', imagesPath);

    if (!fs.existsSync(imagesPath)) {
      return res.status(404).json({
        error: 'Images directory not found',
        path: imagesPath,
        message: 'Please check if the directory exists and you have read permissions'
      });
    }

    const files = await fs.readdir(imagesPath);
    console.log('📁 Found files:', files);

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      console.log(`🔍 Checking file: ${file}, extension: ${ext}`);
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      return res.status(404).json({
        error: 'No image files found',
        path: imagesPath,
        supportedFormats: imageExtensions,
        message: 'No supported image files found in the specified directory'
      });
    }

    const imagePaths = imageFiles.map(file => path.join(imagesPath, file));
    res.json(imagePaths);
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({
      error: 'Failed to read images directory',
      message: error.message
    });
  }
});

// API endpoint to save metadata
app.post('/api/metadata', async (req, res) => {
  try {
    const { filename, metadata } = req.body;

    if (!filename || !metadata) {
      return res.status(400).json({ error: 'Filename and metadata are required' });
    }

    const metadataDir = path.join(process.cwd(), 'metadata');
    await fs.ensureDir(metadataDir);

    const metadataFile = path.join(metadataDir, `${filename}_metadata.jsonl`);
    const metadataLine = JSON.stringify(metadata) + '\n';

    await fs.writeFile(metadataFile, metadataLine);

    res.json({ success: true, message: 'Metadata saved successfully' });
  } catch (error) {
    console.error('Error saving metadata:', error);
    res.status(500).json({ error: 'Failed to save metadata' });
  }
});

// API endpoint to get metadata for a specific image
app.get('/api/metadata/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const metadataDir = path.join(process.cwd(), 'metadata');
    const metadataFile = path.join(metadataDir, `${filename}_metadata.jsonl`);

    if (!fs.existsSync(metadataFile)) {
      return res.json({});
    }

    const content = await fs.readFile(metadataFile, 'utf8');
    const metadata = JSON.parse(content);

    res.json(metadata);
  } catch (error) {
    console.error('Error reading metadata:', error);
    res.status(500).json({ error: 'Failed to read metadata' });
  }
});

// API endpoint to export all metadata
app.post('/api/export', async (req, res) => {
  try {
    const metadataDir = path.join(process.cwd(), 'metadata');

    if (!fs.existsSync(metadataDir)) {
      return res.status(404).json({ error: 'No metadata directory found' });
    }

    const files = await fs.readdir(metadataDir);
    const jsonlFiles = files.filter(file => file.endsWith('_metadata.jsonl'));

    if (jsonlFiles.length === 0) {
      return res.status(404).json({ error: 'No metadata files found' });
    }

    let allMetadata = '';

    for (const file of jsonlFiles) {
      const filePath = path.join(metadataDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      allMetadata += content;
    }

    res.setHeader('Content-Type', 'application/jsonl');
    res.setHeader('Content-Disposition', 'attachment; filename=metadata.jsonl');
    res.send(allMetadata);
  } catch (error) {
    console.error('Error exporting metadata:', error);
    res.status(500).json({ error: 'Failed to export metadata' });
  }
});

// Serve images from the images directory
app.get('/api/image/:filename', (req, res) => {
  try {
    const imagesPath = process.env.REACT_APP_IMAGES_PATH;
    if (!imagesPath) {
      return res.status(400).json({ error: 'Images path not configured' });
    }

    const imagePath = path.join(imagesPath, req.params.filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Images path: ${process.env.REACT_APP_IMAGES_PATH || 'Not set'}`);
  if (!process.env.REACT_APP_IMAGES_PATH) {
    console.log('⚠️  Please set REACT_APP_IMAGES_PATH environment variable to point to your images directory');
  }
}); 
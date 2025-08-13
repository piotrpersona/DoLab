import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { ImageMetadata, GroundTruth } from './types';
import ImagePane from './components/ImagePane';
import JsonEditor from './components/JsonEditor';
import NavigationControls from './components/NavigationControls';
import AlertBanner from './components/AlertBanner';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [currentJson, setCurrentJson] = useState('{\n  \n}');
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ message: string; variant: 'error' | 'success' | 'info' | 'warning' | '' }>({
    message: '',
    variant: ''
  });

  const loadMetadataForCurrentImage = useCallback(async () => {
    if (images.length === 0 || currentImageIndex >= images.length) return;

    const currentImage = images[currentImageIndex];
    const imageName = currentImage.split('/').pop()?.split('.')[0];

    if (!imageName) return;

    try {
      const response = await fetch(`/api/metadata/${imageName}`);
      if (response.ok) {
        const existingMetadata = await response.json();
        if (existingMetadata.ground_truth) {
          try {
            const parsed = JSON.parse(existingMetadata.ground_truth);
            if (parsed.gt_parse) {
              setCurrentJson(JSON.stringify(parsed.gt_parse, null, 2));
            }
          } catch (e) {
            console.error('Failed to parse existing metadata:', e);
          }
        } else {
          setCurrentJson('{\n  \n}');
        }
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  }, [images, currentImageIndex]);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      loadMetadataForCurrentImage();
    }
  }, [currentImageIndex, images, loadMetadataForCurrentImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if CMD (or CTRL on Windows) is pressed
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            if (currentImageIndex > 0) {
              setCurrentImageIndex(currentImageIndex - 1);
            }
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (currentImageIndex < images.length - 1) {
              setCurrentImageIndex(currentImageIndex + 1);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, images.length]);

  const loadImages = async () => {
    try {
      const response = await fetch(`/api/images`);
      if (response.ok) {
        const imageList = await response.json();
        setImages(imageList);
      } else {
        console.error('Failed to load images');
        setImages([]);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (images.length === 0 || currentImageIndex >= images.length) return;

    try {
      // Validate JSON
      const parsedJson = JSON.parse(currentJson);
      const groundTruth: GroundTruth = {
        gt_parse: parsedJson
      };

      const metadataRecord: ImageMetadata = {
        file_name: images[currentImageIndex],
        ground_truth: JSON.stringify(groundTruth)
      };

      const imageName = images[currentImageIndex].split('/').pop()?.split('.')[0];
      if (!imageName) return;

      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: imageName,
          metadata: metadataRecord
        }),
      });

      if (!response.ok) {
        setBanner({ message: 'Failed to save metadata.', variant: 'error' });
      } else {
        setBanner({ message: 'Saved!', variant: 'success' });
      }
    } catch (error) {
      setBanner({ message: `Invalid JSON. Please fix it and try again. ${error}`, variant: 'error' });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metadata.jsonl';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export metadata');
      }
    } catch (error) {
      alert('Error exporting metadata');
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (images.length === 0) {
    return <div className="App">No images found in the specified directory.</div>;
  }

  const handleJsonChange = (json: string) => {
    setCurrentJson(json);
    setTimeout(() => {
      handleSave();
    }, 1000);
  };

  const currentImage = images[currentImageIndex];
  const imageName = currentImage.split('/').pop() || '';

  return (
    <div className="App">
      {banner.variant && (
        <AlertBanner
          message={banner.message}
          variant={banner.variant}
          onClose={() => setBanner({ message: '', variant: '' })}
        />
      )}
      <div className="app-container">
        <ImagePane
          imagePath={currentImage}
          imageName={imageName}
        />
        <div className="json-pane">
          <JsonEditor
            value={currentJson}
            onChange={handleJsonChange}
          />
          <div className="controls">
            <button onClick={handleExport} className="export-button">
              Export
            </button>
          </div>
        </div>
      </div>
      <NavigationControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentIndex={currentImageIndex}
        totalImages={images.length}
      />
    </div>
  );
}

export default App;

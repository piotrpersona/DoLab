import React from 'react';
import './ImagePane.css';

interface ImagePaneProps {
    imagePath: string;
    imageName: string;
}

const ImagePane: React.FC<ImagePaneProps> = ({ imagePath, imageName }) => {
    // Extract the filename from the full path
    const filename = imagePath.split('/').pop() || imageName;

    // Use the API endpoint to serve the image
    const imageUrl = `/api/image/${encodeURIComponent(filename)}`;

    return (
        <div className="image-pane">
            <div className="image-header">
                <h3>{imageName}</h3>
            </div>
            <div className="image-container">
                <img
                    src={imageUrl}
                    alt={imageName}
                    className="display-image"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error';
                        errorDiv.textContent = `Failed to load image: ${imageName}`;
                        target.parentNode?.appendChild(errorDiv);
                    }}
                />
            </div>
        </div>
    );
};

export default ImagePane; 
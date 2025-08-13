# Image Labeler

A React TypeScript application for labeling images with JSON objects. This application allows you to navigate through a directory of images and annotate each one with structured JSON data.

## Features

- **Dual-pane interface**: 70% image display, 30% JSON editor
- **JSON validation**: Real-time validation of JSON input
- **JSON prettification**: Format JSON with a single click
- **Navigation controls**: Previous/Next buttons to navigate through images
- **Metadata display**: Shows the current JSON record in the required format
- **Save functionality**: Saves metadata to individual files
- **Export functionality**: Merges all metadata into a single JSONL file for download

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Set the environment variable for the images directory path:

```bash
export REACT_APP_IMAGES_PATH="/path/to/your/images/directory"
```

Replace `/path/to/your/images/directory` with the absolute path to your images directory.

## Usage

### Development Mode

To run both the React frontend and Express backend simultaneously:

```bash
npm run dev
```

This will start:
- React development server on `http://localhost:3000`
- Express backend server on `http://localhost:3001`

### Production Mode

1. Build the React application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run server
   ```

The application will be available at `http://localhost:3001`

## Application Structure

### Frontend Components

- **App.tsx**: Main application component
- **ImagePane.tsx**: Displays the current image and filename
- **JsonEditor.tsx**: JSON editor with validation and prettification
- **MetadataDisplay.tsx**: Shows the current metadata record
- **NavigationControls.tsx**: Previous/Next navigation buttons

### Backend API Endpoints

- `GET /api/images`: Get list of images from the configured directory
- `POST /api/metadata`: Save metadata for an image
- `GET /api/metadata/:filename`: Get metadata for a specific image
- `POST /api/export`: Export all metadata as a JSONL file
- `GET /api/image/:filename`: Serve an image file

### File Structure

```
image-labeler/
├── src/
│   ├── components/
│   │   ├── ImagePane.tsx
│   │   ├── JsonEditor.tsx
│   │   ├── MetadataDisplay.tsx
│   │   └── NavigationControls.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── server.js
├── package.json
└── README.md
```

## Metadata Format

The application saves metadata in the following format:

```json
{
  "file_name": "path/to/image.jpg",
  "ground_truth": "{\"gt_parse\": {\"key\": \"value\"}}"
}
```

### Example Metadata Record

```json
{
  "file_name": "images/123.jpg",
  "ground_truth": "{\"gt_parse\": {\"amount\": 1234.32}}"
}
```

## File Storage

- Individual metadata files are saved in the `metadata/` directory
- Files are named as `{image_filename}_metadata.jsonl`
- Export creates a single `metadata.jsonl` file containing all records

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)

## Troubleshooting

### Common Issues

1. **Images not loading**: Ensure the `REACT_APP_IMAGES_PATH` environment variable is set correctly
2. **Permission errors**: Make sure the application has read access to the images directory
3. **Port conflicts**: If port 3001 is in use, change the PORT environment variable

### Environment Variables

- `REACT_APP_IMAGES_PATH`: Absolute path to the images directory
- `PORT`: Server port (default: 3001)

## Development

### Adding New Features

1. Create new components in the `src/components/` directory
2. Add corresponding CSS files for styling
3. Update the main App.tsx to include new components
4. Add any necessary API endpoints in `server.js`

### Testing

Run the test suite:

```bash
npm test
```

## License

This project is open source and available under the MIT License.

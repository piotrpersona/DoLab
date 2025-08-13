import React from 'react';
import Editor from '@monaco-editor/react';
import './MetadataDisplay.css';

interface MetadataDisplayProps {
    file_name: string;
    ground_truth: string;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ file_name, ground_truth }) => {
    const metadataRecord = {
        file_name,
        ground_truth
    };

    return (
        <div className="metadata-display">
            <h3>Metadata Record</h3>
            <div className="metadata-editor">
                <Editor
                    value={JSON.stringify(metadataRecord, null, 2)}
                    height="220px"
                    defaultLanguage="json"
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        wordWrap: 'on',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'none',
                    }}
                    onChange={() => { }}
                />
            </div>
        </div>
    );
};

export default MetadataDisplay; 
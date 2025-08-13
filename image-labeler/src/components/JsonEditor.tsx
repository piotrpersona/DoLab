import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './JsonEditor.css';

interface JsonEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange }) => {
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const validateJson = (jsonString: string): boolean => {
        try {
            JSON.parse(jsonString);
            setIsValid(true);
            setErrorMessage('');
            return true;
        } catch (error) {
            setIsValid(false);
            setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON');
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        validateJson(newValue);
    };

    const prettifyJson = () => {
        if (validateJson(value)) {
            try {
                const parsed = JSON.parse(value);
                const prettified = JSON.stringify(parsed, null, 2);
                onChange(prettified);
            } catch (error) {
                // Should not happen since we validated above
                // Keep silent to avoid noisy UI
            }
        }
    };

    return (
        <div className="json-editor">
            <div className="json-editor-header">
                <h3>JSON Editor</h3>
                <button onClick={prettifyJson} className="prettify-btn" disabled={!isValid}>
                    Prettify
                </button>
            </div>
            <div className="json-editor-content">
                <Editor
                    value={value}
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    options={{
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                    }}
                    onChange={(v) => onChange(v || '')}
                />
            </div>
            {!isValid && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default JsonEditor;
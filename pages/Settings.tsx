
import React, { useRef, useState } from 'react';
import { useLearningStore } from '../store/useLearningStore';
import { useProjectsStore } from '../store/useProjectsStore';
import { useProblemsStore } from '../store/useProblemsStore';
import { useNotesStore } from '../store/useNotesStore';

const Settings: React.FC = () => {
    const { learningItems, importData: importLearningData } = useLearningStore.getState();
    const { projects, importData: importProjectsData } = useProjectsStore.getState();
    const { problems, importData: importProblemsData } = useProblemsStore.getState();
    const { notes, importData: importNotesData } = useNotesStore.getState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

    const handleExport = () => {
        const allData = {
            learningItems,
            projects,
            problems,
            notes,
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allData, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `dev-mastery-os-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        setFeedbackMessage({type: 'success', text: 'Data exported successfully!'});
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error('File content is not readable');
                }
                const data = JSON.parse(text);
                
                if (window.confirm('This will overwrite all current data. Are you sure you want to proceed?')) {
                    if (data.learningItems) importLearningData(data.learningItems);
                    if (data.projects) importProjectsData(data.projects);
                    if (data.problems) importProblemsData(data.problems);
                    if (data.notes) importNotesData(data.notes);
                    setFeedbackMessage({type: 'success', text: 'Data imported successfully!'});
                }
            } catch (error) {
                console.error("Failed to parse JSON file", error);
                setFeedbackMessage({type: 'error', text: 'Failed to import data. Please check file format.'});
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setTimeout(() => setFeedbackMessage(null), 3000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <p className="text-text-secondary mb-6">Export all your data into a single JSON file for backup, or import a previously saved file to restore your dashboard.</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button onClick={handleExport} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Export Data
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Import Data
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        className="hidden"
                        accept=".json"
                    />
                </div>
                {feedbackMessage && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${feedbackMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {feedbackMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;

import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any;
  filename: string;
  format: 'json' | 'txt' | 'md';
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, format }) => {
  const handleExport = () => {
    if (!data) return;

    let content = '';
    let mimeType = '';
    const fileExtension = `.${format}`;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
    } else {
      content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data}
      className="inline-flex items-center gap-2 text-xs text-content/70 hover:text-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Export as ${format.toUpperCase()}`}
    >
      <Download size={14} />
      Export as {format.toUpperCase()}
    </button>
  );
};

export default ExportButton;

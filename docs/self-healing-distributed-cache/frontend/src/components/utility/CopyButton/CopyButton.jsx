import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../../common/Button';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds per spec
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={`!p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] ${className}`}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-[var(--color-success)]" /> : <Copy size={16} />}
    </Button>
  );
};

export default CopyButton;

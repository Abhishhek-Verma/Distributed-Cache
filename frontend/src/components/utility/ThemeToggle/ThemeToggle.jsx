import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import Button from '../../common/Button';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={`!p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};

export default ThemeToggle;

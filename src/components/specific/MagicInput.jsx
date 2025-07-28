// src/components/specific/MagicInput.jsx

import React, { useState } from 'react';
import { parseTaskText } from '../../services/apiService';
import './MagicInput.css'; // We will create this CSS file next

const MagicInput = ({ onParse }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await parseTaskText(text);
      // Pass the parsed data up to the parent component
      onParse(response.data.data);
      setText(''); // Clear the input on success
    } catch (err) {
      setError('Could not understand the input. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents form submission if it's in a form
      handleParse();
    }
  };

  return (
    <div className="magic-input-container">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Try "Review Q3 report by Friday at 5pm"'
        className="magic-input"
        disabled={loading}
      />
      <button onClick={handleParse} className="magic-button" disabled={loading}>
        {loading ? 'Parsing...' : 'Magic Add'}
      </button>
      {error && <p className="magic-error">{error}</p>}
    </div>
  );
};

export default MagicInput;

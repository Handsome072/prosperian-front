import React, { useState, useEffect } from 'react';

interface NafModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: string[], exclude: boolean) => void;
}

export const NafModal: React.FC<NafModalProps> = ({ open, onClose, onConfirm }) => {
  const [search, setSearch] = useState('');
  const [selectedNaf, setSelectedNaf] = useState<string[]>([]);
  const [exclude, setExclude] = useState(false);
  const [codesNaf, setCodesNaf] = useState<{ code: string; label: string }[]>([]);

  useEffect(() => {
    import('./codesNaf.json').then((mod) => {
      setCodesNaf(mod.default || mod);
    });
  }, []);

  if (!open) return null;

  const filteredCodes = codesNaf.filter(
    (c) => c.code.includes(search) || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleNaf = (code: string) => {
    setSelectedNaf(selectedNaf.includes(code)
      ? selectedNaf.filter(c => c !== code)
      : [...selectedNaf, code]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-lg font-bold mb-4">Filtrer par codes NAF</h2>
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm mb-3"
        />
        <div className="max-h-64 overflow-y-auto border rounded p-2 mb-3">
          {filteredCodes.map((code) => (
            <label key={code.code} className="flex items-center space-x-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedNaf.includes(code.code)}
                onChange={() => toggleNaf(code.code)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span><b>{code.code}</b> - {code.label}</span>
            </label>
          ))}
        </div>
        <label className="flex items-center space-x-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={exclude}
            onChange={e => setExclude(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span>Exclure les éléments sélectionnés</span>
        </label>
        <button
          className="w-full px-4 py-2 bg-orange-600 text-white rounded"
          onClick={() => onConfirm(selectedNaf, exclude)}
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}; 
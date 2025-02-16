import React, { useState } from 'react';

interface FilterRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const App: React.FC = () => {
  const [rules, setRules] = useState<FilterRule[]>([]);

  return (
    <div className="app">
      <h1>Loot Filter UI</h1>
      <p>A Path of Exile Loot Filter Editor</p>
      <div className="rules-container">
        {rules.length === 0 ? (
          <p>No rules created yet</p>
        ) : (
          rules.map(rule => (
            <div key={rule.id} className="rule-item">
              {rule.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 
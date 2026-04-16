import React from "react";
import { getPasswordStrength } from "../../utils/password";

interface Props {
  password: string;
}

export const PasswordStrengthBar: React.FC<Props> = ({ password }) => {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              level <= strength.score ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {strength.label && (
        <p className="text-xs text-text-secondary">{strength.label}</p>
      )}
    </div>
  );
};

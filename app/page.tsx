"use client";
import React, { useState, useEffect } from "react";

const CornLabyrinthPuzzle = () => {
  const [puzzleInputs, setPuzzleInputs] = useState<string[]>(
    Array(15)
      .fill("")
      .map((_, index) => {
        if (index === 1) return "I";
        if (index === 8) return "E";
        if (index === 14) return "E";
        return "";
      })
  );
  const [outputWord, setOutputWord] = useState("");

  useEffect(() => {
    setOutputWord(puzzleInputs.join(""));
  }, [puzzleInputs]);

  const handleInputChange = (index: number, value: string) => {
    if (index === 1 || index === 8 || index === 14) return; // Prevent changing pre-filled values
    const newInputs = [...puzzleInputs];
    newInputs[index] = value.toUpperCase();
    setPuzzleInputs(newInputs);
  };

  const getStationNumber = (index: number) => {
    if (index === 1 || index === 8 || index === 14) return "\u00A0"; // Non-breaking space
    let stationNumber = index + 1;
    if (index > 1) stationNumber--;
    if (index > 8) stationNumber--;
    if (index > 13) stationNumber--;
    return stationNumber;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-green-100 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <img
          src="./ErdbeerhofLogo.png"
          alt="Erdbeerhof Logo"
          className="mx-auto mb-4"
        />

        <h2 className="text-xl font-bold text-center mb-4">
          Maislabyrinth-Rätsel
        </h2>

        <p className="text-sm text-center mb-4">
          Jede Station hat eine Nummer. Trage den Lösungsbuchstaben in das
          jeweilige Feld ein.
        </p>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {puzzleInputs.map((input, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-sm font-bold mb-1 h-5">
                {getStationNumber(index)}
              </span>
              <input
                type="text"
                maxLength={1}
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={`w-8 h-8 text-center border border-gray-300 rounded ${
                  index === 1 || index === 8 || index === 14
                    ? "bg-gray-100"
                    : ""
                }`}
                readOnly={index === 1 || index === 8 || index === 14}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-green-50 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2">Lösungswort:</p>
          <div className="bg-white p-2 rounded border border-green-200 text-center text-lg font-bold">
            {outputWord}
          </div>
        </div>

        <p className="text-sm text-center mt-4">
          Viel Spaß beim Rätseln und Verirren!
        </p>
      </div>
    </div>
  );
};

export default CornLabyrinthPuzzle;

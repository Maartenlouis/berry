"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SuccessAnimation from "../components/SuccessAnimation";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CornLabyrinthPuzzle = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Station inputs (15 stations)
  const [stationInputs, setStationInputs] = useState<string[]>(Array(15).fill(""));
  
  // Current station index
  const [currentStation, setCurrentStation] = useState(0);
  
  // Initialize from URL params after mount
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      const urlInputs = searchParams.get('stations');
      if (urlInputs) {
        const decoded = decodeURIComponent(urlInputs).split(',');
        setStationInputs(decoded.map(input => input || '').slice(0, 15));
      }
      
      const urlStation = searchParams.get('station');
      if (urlStation) {
        const stationIndex = parseInt(urlStation);
        if (stationIndex >= 0 && stationIndex < 15) {
          setCurrentStation(stationIndex);
        }
      }
      
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized]);
  
  // Show swipe hint for first-time users
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Refs for input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Swiper instance ref
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Solution array (21 positions for LANDWIRTSCHAFT ERLEBEN)
  const [solution, setSolution] = useState<string[]>(
    Array(21).fill("").map((_, index) => {
      // Pre-filled letters at specific positions (0-indexed)
      if (index === 3) return "D";  // Position 4
      if (index === 6) return "R";  // Position 7
      if (index === 9) return "C";  // Position 10
      if (index === 11) return "A"; // Position 12
      if (index === 17) return "E"; // Position 18
      if (index === 19) return "E"; // Position 20
      return "";
    })
  );
  
  const [outputWord, setOutputWord] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  // Update URL when station inputs or current station changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Store station inputs as comma-separated values
    const encodedInputs = stationInputs.join(',');
    if (encodedInputs !== Array(15).fill('').join(',')) {
      params.set('stations', encodedInputs);
    }
    
    // Store current station
    if (currentStation > 0) {
      params.set('station', currentStation.toString());
    }
    
    // Update URL without triggering navigation
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [stationInputs, currentStation]);

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-focus input field when station changes
  useEffect(() => {
    // Small delay to ensure swiper animation completes
    const timer = setTimeout(() => {
      const input = inputRefs.current[currentStation];
      if (input && !getPrefilledLetter(currentStation)) {
        input.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStation]);

  // Mapping of which stations provide letters for which solution positions
  const stationToSolutionMap: { [key: number]: number } = {
    0: 0,   // Station 1 -> Position 1
    1: 1,   // Station 2 -> Position 2
    2: 2,   // Station 3 -> Position 3
    3: 4,   // Station 4 -> Position 5
    4: 5,   // Station 5 -> Position 6
    5: 7,   // Station 6 -> Position 8
    6: 8,   // Station 7 -> Position 9
    7: 10,  // Station 8 -> Position 11
    8: 12,  // Station 9 -> Position 13
    9: 13,  // Station 10 -> Position 14
    10: 14, // Station 11 -> Position 15
    11: 15, // Station 12 -> Position 16
    12: 16, // Station 13 -> Position 17
    13: 18, // Station 14 -> Position 19
    14: 20, // Station 15 -> Position 21
  };

  // Pre-filled stations based on solution mapping
  const getPrefilledLetter = (stationIndex: number): string => {
    const solutionIndex = stationToSolutionMap[stationIndex];
    const prefilledPositions: { [key: number]: string } = {
      3: "D", 6: "R", 9: "C", 11: "A", 17: "E", 19: "E"
    };
    return prefilledPositions[solutionIndex] || "";
  };

  useEffect(() => {
    // Update solution based on station inputs
    const newSolution = Array(21).fill("").map((_, index) => {
      // Keep pre-filled letters
      if (index === 3) return "D";
      if (index === 6) return "R";
      if (index === 9) return "C";
      if (index === 11) return "A";
      if (index === 17) return "E";
      if (index === 19) return "E";
      
      // Find which station maps to this solution position
      const stationIndex = Object.entries(stationToSolutionMap).find(
        ([_, solutionIdx]) => solutionIdx === index
      )?.[0];
      
      if (stationIndex !== undefined) {
        return stationInputs[parseInt(stationIndex)] || "";
      }
      
      return "";
    });
    
    setSolution(newSolution);
    
    // Format output with space after LANDWIRTSCHAFT
    const fullWord = newSolution.join("");
    const formattedWord = fullWord.slice(0, 14) + " " + fullWord.slice(14);
    setOutputWord(formattedWord);
    
    // Check if the solution is correct
    if (fullWord === "LANDWIRTSCHAFTERLEBEN" && !hasShownSuccess) {
      setShowSuccess(true);
      setHasShownSuccess(true);
    }
  }, [stationInputs]);

  const handleStationInputChange = (value: string) => {
    const newInputs = [...stationInputs];
    newInputs[currentStation] = value.toUpperCase();
    setStationInputs(newInputs);
    
    // Auto-advance to next station if not the last one
    if (value && currentStation < 14 && swiperRef.current) {
      setTimeout(() => {
        swiperRef.current?.slideNext();
      }, 300);
    }
  };

  // Handle click on solution field to navigate to corresponding station
  const handleSolutionFieldClick = (solutionIndex: number) => {
    // Find which station provides the letter for this solution position
    const stationEntry = Object.entries(stationToSolutionMap).find(
      ([_, solutionIdx]) => solutionIdx === solutionIndex
    );
    
    if (stationEntry) {
      const stationIndex = parseInt(stationEntry[0]);
      // Navigate to the station
      if (swiperRef.current) {
        swiperRef.current.slideTo(stationIndex);
      }
    }
  };

  // Show loading state during initialization to prevent hydration errors
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center p-2 sm:p-4 bg-green-100 min-h-screen">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
          <img
            src="./ErdbeerhofLogo.png"
            alt="Erdbeerhof Logo"
            className="mx-auto mb-4 w-32 sm:w-auto"
          />
          <p className="text-lg">Lade...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {showSuccess && (
        <SuccessAnimation onComplete={() => setShowSuccess(false)} />
      )}
      <div className="flex flex-col items-center p-2 sm:p-4 bg-green-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-8">
        <img
          src="./ErdbeerhofLogo.png"
          alt="Erdbeerhof Logo"
          className="mx-auto mb-4 w-32 sm:w-auto"
        />

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Maislabyrinth-Rätsel
        </h2>

        <p className="text-base sm:text-lg text-center mb-6 sm:mb-8 px-2">
          Wische durch die Stationen und trage die Lösungsbuchstaben ein.
        </p>

        {/* Station Carousel */}
        <div className="mb-8 relative">
          {/* Swipe Hint */}
          {showSwipeHint && currentStation === 0 && (
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
              <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-full flex items-center gap-3 animate-swipe">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-lg font-medium">Wische um zu navigieren</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          )}
          
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              // Sync swiper to current station after initialization
              if (isInitialized && currentStation > 0) {
                swiper.slideTo(currentStation, 0);
              }
            }}
            onSlideChange={(swiper) => {
              setCurrentStation(swiper.activeIndex);
              setShowSwipeHint(false);
            }}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="station-swiper"
            threshold={20}
            touchRatio={1}
            touchReleaseOnEdges={true}
            resistanceRatio={0.85}
            loop={false}
          >
            {stationInputs.map((_, index) => {
              const prefilledLetter = getPrefilledLetter(index);
              const isPreFilled = prefilledLetter !== "";
              
              return (
                <SwiperSlide key={index}>
                  <div className="py-8 px-4">
                    <h3 className="text-3xl font-bold mb-6 text-center">Station {index + 1}</h3>
                    
                    {isPreFilled ? (
                      <div className="flex flex-col items-center">
                        <p className="text-lg mb-4">Diese Station hat einen vorgegebenen Buchstaben:</p>
                        <div className="w-24 h-24 border-4 border-gray-400 rounded-lg flex items-center justify-center bg-gray-100">
                          <span className="text-4xl font-bold">{prefilledLetter}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="text-lg mb-4">Trage den Lösungsbuchstaben ein:</p>
                        <input
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={stationInputs[index]}
                          onChange={(e) => handleStationInputChange(e.target.value)}
                          className="w-24 h-24 text-center border-4 border-blue-400 rounded-lg text-4xl font-bold focus:outline-none focus:border-blue-600"
                          placeholder="?"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      {isPreFilled ? "Weiter zur nächsten Station →" : "Buchstabe eingeben und weiter →"}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Solution Display */}
        <div className="border-t-2 pt-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Lösungswort (21 Felder):</h3>
          
          <div className="space-y-3">
            {/* Row 1: positions 1-7 */}
            <div className="flex justify-center gap-1 sm:gap-2">
              {solution.slice(0, 7).map((letter, index) => {
                const isPreFilled = [3, 6].includes(index);
                const hasCorrespondingStation = Object.values(stationToSolutionMap).includes(index);
                return (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{index + 1}</span>
                    <div 
                      onClick={() => hasCorrespondingStation && !isPreFilled && handleSolutionFieldClick(index)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded flex items-center justify-center text-base sm:text-lg font-bold ${
                        isPreFilled ? "border-gray-400 bg-gray-100" : "border-gray-300 bg-white"
                      } ${hasCorrespondingStation && !isPreFilled ? "cursor-pointer hover:border-blue-400 transition-colors" : ""}`}>
                      {letter}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Row 2: positions 8-14 */}
            <div className="flex justify-center gap-1 sm:gap-2">
              {solution.slice(7, 14).map((letter, index) => {
                const actualIndex = index + 7;
                const isPreFilled = [9, 11].includes(actualIndex);
                const hasCorrespondingStation = Object.values(stationToSolutionMap).includes(actualIndex);
                return (
                  <div key={actualIndex} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{actualIndex + 1}</span>
                    <div 
                      onClick={() => hasCorrespondingStation && !isPreFilled && handleSolutionFieldClick(actualIndex)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded flex items-center justify-center text-base sm:text-lg font-bold ${
                        isPreFilled ? "border-gray-400 bg-gray-100" : "border-gray-300 bg-white"
                      } ${hasCorrespondingStation && !isPreFilled ? "cursor-pointer hover:border-blue-400 transition-colors" : ""}`}>
                      {letter}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Row 3: positions 15-21 */}
            <div className="flex justify-center gap-1 sm:gap-2">
              {solution.slice(14, 21).map((letter, index) => {
                const actualIndex = index + 14;
                const isPreFilled = [17, 19].includes(actualIndex);
                const hasCorrespondingStation = Object.values(stationToSolutionMap).includes(actualIndex);
                return (
                  <div key={actualIndex} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{actualIndex + 1}</span>
                    <div 
                      onClick={() => hasCorrespondingStation && !isPreFilled && handleSolutionFieldClick(actualIndex)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded flex items-center justify-center text-base sm:text-lg font-bold ${
                        isPreFilled ? "border-gray-400 bg-gray-100" : "border-gray-300 bg-white"
                      } ${hasCorrespondingStation && !isPreFilled ? "cursor-pointer hover:border-blue-400 transition-colors" : ""}`}>
                      {letter}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Lösungswort:</h3>
          <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-gray-300 text-center">
            <p className="text-xl sm:text-3xl font-bold tracking-wide break-words">
              {outputWord}
            </p>
          </div>
        </div>

        <p className="text-sm text-center mt-4 px-2">
          Viel Spaß beim Rätseln und Verirren!
        </p>
      </div>
    </div>
    </>
  );
};

function CornLabyrinthPuzzleWrapper() {
  return (
    <React.Suspense fallback={<div className="flex flex-col items-center p-2 sm:p-4 bg-green-100 min-h-screen"><div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">Lade...</div></div>}>
      <CornLabyrinthPuzzle />
    </React.Suspense>
  );
}

export default CornLabyrinthPuzzleWrapper;
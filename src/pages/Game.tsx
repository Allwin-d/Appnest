import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Game: React.FC = () => {
  const arr = ["👽", "🤡", "☠️", "🧢", "🎒", "🦄", "🦁", "🐝"];
  const dup = [...arr, ...arr];

  const [count, setCount] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [shuffled, setShuffled] = useState<string[]>(dup);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Shuffle function
  function shuffleArray(input: string[]): string[] {
    const copy = [...input];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Initialize game
  useEffect(() => {
    setShuffled(shuffleArray(dup));
  }, []);

  // Timer using useEffect
  useEffect(() => {
    if (!gameWon) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameWon]);

  // Check for matches when two cards are selected
  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      const [first, second] = selectedCards;

      if (shuffled[first] === shuffled[second]) {
        // Match found
        setTimeout(() => {
          setMatchedCards((prev) => new Set([...prev, first, second]));
          setSelectedCards([]);
          setIsChecking(false);
        }, 800);
      } else {
        setTimeout(() => {
          setFlippedCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(first);
            newSet.delete(second);
            return newSet;
          });
          setSelectedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [selectedCards, shuffled]);

  // Check for win condition
  useEffect(() => {
    if (matchedCards.size === shuffled.length && matchedCards.size > 0) {
      setGameWon(true);
    }
  }, [matchedCards.size, shuffled.length]);

  // Handle card clicks
  function cardClicked(index: number): void {
    if (
      isChecking ||
      flippedCards.has(index) ||
      matchedCards.has(index) ||
      selectedCards.length >= 2
    ) {
      return;
    }

    setFlippedCards((prev) => new Set([...prev, index]));
    setSelectedCards((prev) => [...prev, index]);
    setCount((prev) => prev + 1);
  }

  function handleReset(): void {
    setCount(0);
    setSeconds(0);
    setFlippedCards(new Set());
    setMatchedCards(new Set());
    setSelectedCards([]);
    setGameWon(false);
    setIsChecking(false);
    setShuffled(shuffleArray(dup));
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-light text-gray-700 mb-2">Memory</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex justify-center gap-8 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/20">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Time
            </div>
            <div className="text-lg font-medium text-gray-700">
              {formatTime(seconds)}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/20">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Moves
            </div>
            <div className="text-lg font-medium text-gray-700">
              {Math.floor(count / 2)}
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/20">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Matches
            </div>
            <div className="text-lg font-medium text-gray-700">
              {matchedCards.size / 2}/8
            </div>
          </div>
        </motion.div>

        {/* Win Message */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
            >
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-xl font-medium text-gray-700 mb-1">
                    Congratulations!
                  </p>
                  <p className="text-gray-600">
                    You won in {Math.floor(count / 2)} moves!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <motion.div
          className="grid grid-cols-4 gap-3 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {shuffled.map((item, index) => {
            const isFlipped =
              flippedCards.has(index) || matchedCards.has(index);
            const isMatched = matchedCards.has(index);
            const isSelected = selectedCards.includes(index);

            return (
              <motion.div
                key={index}
                className="aspect-square cursor-pointer perspective-1000"
                onClick={() => cardClicked(index)}
                whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                  scale: isSelected && !isMatched ? 1.05 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <div className="relative w-full h-full preserve-3d">
                  {/* Card Back */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-xl shadow-lg border border-white/30 bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-sm flex items-center justify-center ${
                      isFlipped ? "invisible" : "visible"
                    }`}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200"
                      animate={{ rotate: seconds * 2 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>

                  {/* Card Front */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-xl shadow-lg border flex items-center justify-center text-3xl transform rotate-y-180 ${
                      isMatched
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-200"
                        : "bg-white border-white/30"
                    } ${isFlipped ? "visible" : "invisible"}`}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: isFlipped ? 1 : 0 }}
                      transition={{
                        delay: isFlipped ? 0.15 : 0,
                        type: "spring",
                        stiffness: 400,
                      }}
                    >
                      {item}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={handleReset}
            className="bg-white/80 hover:bg-white text-gray-700 font-medium py-3 px-8 rounded-full shadow-lg border border-white/50 backdrop-blur-sm transition-colors duration-200"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            New Game
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Game;

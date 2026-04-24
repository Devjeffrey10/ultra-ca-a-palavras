import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, FlaskConical, Rocket, RefreshCcw, Trophy, ChevronRight, Sun, Moon, Pill } from 'lucide-react';
import { Theme, GameState, FoundWord, Point } from './types';
import { THEMES } from './constants';
import { generateGrid } from './utils/gameLogic';
import Grid from './components/Grid';
import Sidebar from './components/Sidebar';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [gridData, setGridData] = useState<{ grid: string[][]; placedWords: { word: string; points: Point[] }[] } | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    foundWords: [],
    isComplete: false,
    startTime: null,
    endTime: null
  });
  const [foundWordObjects, setFoundWordObjects] = useState<FoundWord[]>([]);
  const [timer, setTimer] = useState(0);
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>('dark');

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  // Initialize Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState.startTime && !gameState.isComplete) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.startTime, gameState.isComplete]);

  const startGame = useCallback((theme: Theme) => {
    const data = generateGrid(theme.gridSize, theme.words);
    setGridData(data);
    setCurrentTheme(theme);
    setGameState({
      score: 0,
      foundWords: [],
      isComplete: false,
      startTime: Date.now(),
      endTime: null
    });
    setFoundWordObjects([]);
    setTimer(0);
  }, []);

  const handleWordSelection = (selectedWord: string, points: Point[]) => {
    if (!currentTheme || gameState.isComplete) return false;

    // Check if the selected word is in our themed list AND matches its placed location
    // We also check reverse since word search allows it
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const wordMatch = gridData?.placedWords.find(pw => 
      (pw.word === selectedWord || pw.word === reversedWord) && 
      !gameState.foundWords.includes(pw.word)
    );

    if (wordMatch) {
      const newFoundWords = [...gameState.foundWords, wordMatch.word];
      setGameState(prev => ({
        ...prev,
        foundWords: newFoundWords,
        score: prev.score + (wordMatch.word.length * 10),
        isComplete: newFoundWords.length === currentTheme.words.length
      }));
      setFoundWordObjects(prev => [...prev, { word: wordMatch.word, points }]);
      return true;
    }

    return false;
  };

  const resetGame = () => {
    if (currentTheme) startGame(currentTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative w-full max-w-6xl"
      >
        <button 
          onClick={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          className="absolute right-0 top-0 p-3 rounded-xl cyber-border hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-sm"
          title="Alternar Tema"
        >
          {appTheme === 'dark' ? <Sun className="w-5 h-5 text-cyber-blue" /> : <Moon className="w-5 h-5 text-cyber-pink" />}
        </button>

        <div className="flex flex-col items-center justify-center gap-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <img src="/logo.png" alt="Ultra Cursos Logo" className="h-14 md:h-20 object-contain" />
            <img src="/UltraMascote.png" alt="Mascote Ultra" className="h-20 md:h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-cyber-blue/10 dark:bg-cyber-blue/20">
              <Cpu className="text-cyber-blue w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold italic tracking-tighter uppercase flex flex-col items-start leading-none">
              <span className="text-2xl md:text-3xl font-black not-italic opacity-40">Caça Palavras</span>
              <span className="text-cyber-blue drop-shadow-sm">Ultra Cursos</span>
            </h1>
          </div>
        </div>
        <p className="text-text/60 uppercase tracking-[0.4em] text-[10px] font-bold">
          Cursos de Tecnologia & Ciência
        </p>
      </motion.header>

      <main className="w-full max-w-6xl relative">
        <AnimatePresence mode="wait">
          {!currentTheme ? (
            <div className="flex flex-col items-center">
              <motion.div 
                key="menu"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
              >
                {THEMES.map((theme, index) => (
                  <ThemeCard 
                    key={theme.id} 
                    theme={theme} 
                    onClick={() => startGame(theme)} 
                    index={index}
                  />
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row gap-8 items-start justify-center"
            >
              {/* Game Grid */}
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest opacity-40">Tema</span>
                    <span className="text-sm font-bold text-cyber-blue">{currentTheme.name}</span>
                  </div>
                  <button 
                    onClick={() => setCurrentTheme(null)}
                    className="text-[10px] uppercase tracking-widest hover:text-cyber-pink transition-colors font-bold"
                  >
                    Mudar Tema
                  </button>
                </div>
                
                {gridData && (
                  <Grid 
                    grid={gridData.grid} 
                    foundWords={foundWordObjects}
                    onWordSelection={handleWordSelection}
                  />
                )}

                <div className="flex justify-center">
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2 cyber-border rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                  >
                    <RefreshCcw className="w-3 h-3" /> Reiniciar Partida
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <Sidebar 
                theme={currentTheme}
                foundWords={gameState.foundWords}
                score={gameState.score}
                time={timer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Goal Reached Modal */}
      <AnimatePresence>
        {gameState.isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="cyber-card p-12 text-center max-w-md w-full border-2 border-cyber-green/50"
            >
              <div className="flex justify-center mb-6 relative">
                <div className="absolute -top-12 -right-4 w-24 h-24 rotate-12">
                   <img src="/UltraMascote.png" alt="Mascote Ultra" className="w-full h-full object-contain" />
                </div>
                <div className="w-20 h-20 bg-cyber-green rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-cyber-black" />
                </div>
              </div>
              <h2 className="text-4xl font-black uppercase mb-2">Excelente!</h2>
              <p className="opacity-60 mb-8 font-mono">
                Você explorou todos os conceitos de {currentTheme?.name} em {timer} segundos.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setCurrentTheme(null)}
                  className="w-full py-4 bg-cyber-green text-cyber-black font-black uppercase tracking-widest hover:brightness-110 transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  Continuar Aprendendo <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-16 text-[10px] opacity-40 uppercase tracking-[0.5em] font-medium text-center">
        Desenvolvido para Ultra Cursos Carpina-PE • 2026 v2
      </footer>
    </div>
  );
}

interface ThemeCardProps {
  theme: Theme;
  onClick: () => void;
  index: number;
  key?: string | number;
}

function ThemeCard({ theme, onClick, index }: ThemeCardProps) {
  const Icon = theme.id === 'technology' 
    ? Cpu 
    : theme.id === 'science' 
      ? FlaskConical 
      : theme.id === 'pharmacy' 
        ? Pill 
        : Rocket;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, borderColor: 'var(--color-cyber-blue)' }}
      onClick={onClick}
      className="cyber-card p-8 cursor-pointer flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-full cyber-border flex items-center justify-center mb-6 group-hover:bg-cyber-blue/10 group-hover:border-cyber-blue transition-all">
        <Icon className="w-8 h-8 group-hover:text-cyber-blue transition-colors" />
      </div>
      <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">{theme.name}</h3>
      <p className="text-xs opacity-40 mb-6 font-mono leading-relaxed">{theme.description}</p>
      
      <div className="mt-auto w-full pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
          {theme.words.length} Palavras
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-cyber-blue uppercase tracking-widest">
          Jogar <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Timer, Trophy } from 'lucide-react';
import { Theme } from '../types';

interface SidebarProps {
  theme: Theme;
  foundWords: string[];
  score: number;
  time: number;
}

export default function Sidebar({ theme, foundWords, score, time }: SidebarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-80 h-full">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="cyber-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-1">
            <Timer className="w-3 h-3" /> Tempo
          </span>
          <span className="text-xl font-mono font-bold text-cyber-blue">{formatTime(time)}</span>
        </div>
        <div className="cyber-card p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Pontos
          </span>
          <span className="text-xl font-mono font-bold text-cyber-green">{score}</span>
        </div>
      </div>

      {/* Word List */}
      <div className="cyber-card flex-1 p-6 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6 opacity-40 pb-2 border-b border-black/10 dark:border-white/10">
          Palavras para Encontrar
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {theme.words.map((word) => {
            const isFound = foundWords.includes(word);
            return (
              <motion.div
                key={word}
                initial={false}
                animate={{
                  opacity: isFound ? 0.3 : 1,
                  x: isFound ? 5 : 0
                }}
                className={`
                  flex items-center gap-3 py-1 text-sm font-mono tracking-wider
                  ${isFound ? 'text-cyber-green' : 'opacity-80'}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isFound ? 'bg-cyber-green' : 'bg-current opacity-40'}`} />
                <span className={isFound ? 'line-through decoration-cyber-green' : ''}>
                  {word}
                </span>
                {isFound && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="text-[10px] opacity-60 text-center uppercase tracking-widest">
        Dica: Clique e arraste para selecionar
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { playSound } from '../lib/audio';

interface CombatModalProps {
  isOpen: boolean;
  attacker: {
    name: string;
    color: string;
    territory: string;
    armies: number;
  };
  defender: {
    name: string;
    color: string;
    territory: string;
    armies: number;
  };
  onRollDice: (attackDice: number) => Promise<{
    attackRolls: number[];
    defendRolls: number[];
    attackerLosses: number;
    defenderLosses: number;
    conquered: boolean;
  }>;
  onClose: () => void;
  onConquest: (armies: number) => void;
}

export function CombatModal({
  isOpen,
  attacker,
  defender,
  onRollDice,
  onClose,
  onConquest,
}: CombatModalProps) {
  const [attackDice, setAttackDice] = useState(3);
  const [attackRolls, setAttackRolls] = useState<number[]>([]);
  const [defendRolls, setDefendRolls] = useState<number[]>([]);
  const [result, setResult] = useState<string>('');
  const [isRolling, setIsRolling] = useState(false);
  const [conquered, setConquered] = useState(false);
  const [conquestArmies, setConquestArmies] = useState(1);
  const [currentAttackerArmies, setCurrentAttackerArmies] = useState(attacker.armies);
  const [currentDefenderArmies, setCurrentDefenderArmies] = useState(defender.armies);

  // Reset quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setAttackRolls([]);
      setDefendRolls([]);
      setResult('');
      setConquered(false);
      setCurrentAttackerArmies(attacker.armies);
      setCurrentDefenderArmies(defender.armies);
      setAttackDice(Math.min(3, attacker.armies - 1));
    }
  }, [isOpen, attacker.armies, defender.armies]);

  const maxAttackDice = Math.min(3, currentAttackerArmies - 1);

  const handleRoll = async () => {
    setIsRolling(true);
    playSound.diceRoll();

    try {
      const combatResult = await onRollDice(attackDice);

      // Anima os dados
      setTimeout(() => {
        setAttackRolls(combatResult.attackRolls);
        setDefendRolls(combatResult.defendRolls);

        const newAttackerArmies = currentAttackerArmies - combatResult.attackerLosses;
        const newDefenderArmies = currentDefenderArmies - combatResult.defenderLosses;

        setCurrentAttackerArmies(newAttackerArmies);
        setCurrentDefenderArmies(newDefenderArmies);

        if (combatResult.attackerLosses > combatResult.defenderLosses) {
          setResult(`Defensor venceu! Atacante perdeu ${combatResult.attackerLosses} exercito(s).`);
        } else if (combatResult.defenderLosses > combatResult.attackerLosses) {
          setResult(`Atacante venceu! Defensor perdeu ${combatResult.defenderLosses} exercito(s).`);
        } else {
          setResult('Empate tecnico!');
        }

        if (combatResult.conquered) {
          setConquered(true);
          setConquestArmies(attackDice);
          playSound.conquest();
        }

        setIsRolling(false);
      }, 600);
    } catch (error) {
      console.error('Erro no combate:', error);
      setIsRolling(false);
    }
  };

  const handleConquest = () => {
    onConquest(conquestArmies);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !conquered && onClose()}>
      <div className="modal-content max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-rose-500 mb-6">Combate!</h2>

        {/* Display de combate */}
        <div className="flex items-center justify-around mb-6">
          {/* Atacante */}
          <div className="text-center p-4 rounded-lg bg-black/30">
            <h3 className="font-bold mb-1" style={{ color: attacker.color }}>
              {attacker.name}
            </h3>
            <p className="text-sm text-white/70 mb-2">{attacker.territory}</p>
            <div className="flex justify-center gap-2 min-h-[50px] mb-2">
              {attackRolls.map((roll, i) => (
                <div
                  key={i}
                  className={`dice attacker ${isRolling ? 'animate-roll-dice' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {roll}
                </div>
              ))}
            </div>
            <p className="text-lg font-semibold">
              Exercitos: {currentAttackerArmies}
            </p>
          </div>

          {/* VS */}
          <div className="text-3xl font-bold text-yellow-400">VS</div>

          {/* Defensor */}
          <div className="text-center p-4 rounded-lg bg-black/30">
            <h3 className="font-bold mb-1" style={{ color: defender.color }}>
              {defender.name}
            </h3>
            <p className="text-sm text-white/70 mb-2">{defender.territory}</p>
            <div className="flex justify-center gap-2 min-h-[50px] mb-2">
              {defendRolls.map((roll, i) => (
                <div
                  key={i}
                  className={`dice defender ${isRolling ? 'animate-roll-dice' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {roll}
                </div>
              ))}
            </div>
            <p className="text-lg font-semibold">
              Exercitos: {currentDefenderArmies}
            </p>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div
            className={`text-center p-3 rounded-lg mb-4 ${
              result.includes('Atacante') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {result}
          </div>
        )}

        {/* Painel de conquista */}
        {conquered ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
            <h3 className="text-green-400 font-bold text-center mb-3">
              Territorio Conquistado!
            </h3>
            <div className="flex items-center justify-center gap-4">
              <label className="text-sm">Mover exercitos:</label>
              <input
                type="number"
                min={attackDice}
                max={currentAttackerArmies - 1}
                value={conquestArmies}
                onChange={(e) => setConquestArmies(Math.max(attackDice, Math.min(currentAttackerArmies - 1, parseInt(e.target.value) || 1)))}
                className="input w-20 text-center"
              />
            </div>
            <button onClick={handleConquest} className="btn btn-primary w-full mt-4">
              Confirmar Conquista
            </button>
          </div>
        ) : (
          <>
            {/* Controles de ataque */}
            {currentAttackerArmies > 1 && currentDefenderArmies > 0 && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <label className="text-sm">Dados de ataque:</label>
                <select
                  value={attackDice}
                  onChange={(e) => setAttackDice(parseInt(e.target.value))}
                  className="input w-auto"
                  disabled={isRolling}
                >
                  {Array.from({ length: maxAttackDice }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} dado{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Botoes de acao */}
            <div className="flex justify-center gap-4">
              {currentAttackerArmies > 1 && currentDefenderArmies > 0 ? (
                <>
                  <button
                    onClick={handleRoll}
                    disabled={isRolling}
                    className="btn btn-attack px-8"
                  >
                    {isRolling ? 'Rolando...' : 'Rolar Dados'}
                  </button>
                  <button onClick={onClose} className="btn btn-secondary">
                    Parar Ataque
                  </button>
                </>
              ) : (
                <button onClick={onClose} className="btn btn-secondary">
                  Fechar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

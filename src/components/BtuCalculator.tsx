import React, { useState, useRef, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface BtuCalculatorProps {
  onClose: () => void;
}

export function BtuCalculator({ onClose }: BtuCalculatorProps) {
  const [squareMeters, setSquareMeters] = useState('');
  const [sunExposure, setSunExposure] = useState('low');
  const [people, setPeople] = useState('');
  const [heatSources, setHeatSources] = useState('0');
  const [result, setResult] = useState<number | null>(null);
  
  const [position, setPosition] = useState(() => ({
    x: Math.max(0, window.innerWidth / 2 - 200),
    y: Math.max(0, window.innerHeight / 2 - 300)
  }));
  
  const modalRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      const newX = dragStartRef.current.left + deltaX;
      const newY = dragStartRef.current.top + deltaY;
      
      // Limites da tela
      const maxX = window.innerWidth - (modalRef.current?.offsetWidth || 400);
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return;

    e.preventDefault();
    isDraggingRef.current = true;
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: position.x,
      top: position.y
    };

    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
  };

  const calculateBTU = () => {
    let totalBTU = parseFloat(squareMeters) * 650;

    switch (sunExposure) {
      case 'high':
        totalBTU *= 1.3;
        break;
      case 'medium':
        totalBTU *= 1.15;
        break;
    }

    totalBTU += parseInt(people) * 400;
    totalBTU += parseInt(heatSources) * 600;

    setResult(Math.round(totalBTU));
  };

  return (
    <div className="fixed inset-0 bg-black/20">
      <div
        ref={modalRef}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(0, 0)',
          willChange: 'transform'
        }}
        className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-6 w-[400px]"
      >
        <div 
          ref={dragHandleRef}
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center mb-4 cursor-move select-none bg-blue-50 -m-8 p-4 rounded-t-2xl"
        >
          <div className="flex items-center">
            <Calculator className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Calculadora de BTUs</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área do Ambiente (m²)
            </label>
            <input
              type="number"
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              className="input-primary"
              placeholder="Ex: 20"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exposição ao Sol
            </label>
            <select
              value={sunExposure}
              onChange={(e) => setSunExposure(e.target.value)}
              className="input-primary"
            >
              <option value="low">Baixa (Manhã/Tarde)</option>
              <option value="medium">Média (Maior parte do dia)</option>
              <option value="high">Alta (O dia todo)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Pessoas
            </label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="input-primary"
              placeholder="Ex: 2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fontes de Calor Extras
            </label>
            <input
              type="number"
              value={heatSources}
              onChange={(e) => setHeatSources(e.target.value)}
              className="input-primary"
              placeholder="Ex: 1 (TV, Computador, etc)"
              min="0"
            />
          </div>

          <button
            onClick={calculateBTU}
            className="btn-primary"
            disabled={!squareMeters || !people}
          >
            Calcular BTUs
          </button>

          {result && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resultado:</h3>
              <p className="text-2xl font-bold text-blue-600">{result.toLocaleString()} BTUs</p>
              <p className="text-sm text-gray-600 mt-2">
                Recomendação de potência para seu ambiente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function PublicPerceptionForm({ onContinue, formData }: FormStepProps) {
  const [selectedPerception, setSelectedPerception] = useState(formData?.publicPerception || '');

  const perceptions = [
    {
      title: 'Desconhecimento',
      description: 'O público em geral não sabe ou entende pouco sobre a marca/solução (necessário educar sobre a oferta e seus benefícios)'
    },
    {
      title: 'Ceticismo',
      description: 'Há desconfiança ou receio – os clientes estão resistentes, seja por experiências ruins com concorrentes ou por parecer "bom demais para ser verdade" (precisa construir credibilidade)'
    },
    {
      title: 'Insatisfação Latente',
      description: 'O público sente dor com as opções atuais – reconhece problemas/não está satisfeito com os concorrentes, mas talvez não conheça alternativa melhor ainda (oportunidade para posicionar-se como solução ideal)'
    },
    {
      title: 'Satisfeito com Concorrente',
      description: 'Os clientes-alvo já estão servidos por uma opção e relativamente satisfeitos/leais a ela (será preciso diferenciar-se fortemente e mostrar vantagens claras para rompê-los da inércia)'
    },
    {
      title: 'Sensível a Preço',
      description: 'Muitos veem soluções atuais como caras ou fora de alcance; buscam opção mais acessível (posicionar valor acessível/benefício de custo)'
    },
    {
      title: 'Consciente e Exigente',
      description: 'O público entende bem o problema e sabe o que quer; eles comparam criticamente qualidade/funcionalidades (a marca precisa provar superioridade específica)'
    },
    {
      title: 'Entusiastas da Marca (caso já tenha clientes)',
      description: 'Existe uma base fiel que adora a marca; eles percebem-na muito positivamente (aproveitar esse capital para ampliar mensagem – reforçar aquilo que já amam)'
    }
  ];

  const handlePerceptionSelection = (perception: string) => {
    setSelectedPerception(perception);
    // Auto-forward after a brief delay for visual feedback
    setTimeout(() => {
      if (onContinue) {
        onContinue({ publicPerception: perception });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-16 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <div className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Como o público percebe atualmente as soluções existentes (ou a própria marca, se já tiver presença)?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione a opção que mais reflete a situação atual
            </p>
          </div>

          {/* Perception Options */}
          <div className="flex-1 space-y-3 pb-20 max-h-96 overflow-y-auto pr-2">
            {perceptions.map((perception) => (
              <button
                key={perception.title}
                type="button"
                onClick={() => handlePerceptionSelection(perception.title)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 font-outfit ${
                  selectedPerception === perception.title
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-accent hover:bg-gray-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="font-semibold text-base">
                    {perception.title}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {perception.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
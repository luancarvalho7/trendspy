import React, { useState } from 'react';
import Logo from './Logo';
import { FormStepProps } from '../types/form';

export default function MissionSelectionForm({ onContinue, formData }: FormStepProps) {
  const [selectedMissions, setSelectedMissions] = useState<string[]>(formData?.brandMissions || []);

  const missions = [
    {
      title: "Transformação do cliente",
      description: "Foco em impulsionar o progresso do cliente ou facilitar uma grande conquista pessoal",
      example: "Ajudar pessoas a atingirem [objetivo concreto]"
    },
    {
      title: "Impacto social/cultural", 
      description: "Compromisso em melhorar a sociedade ou cultura de alguma forma ampla",
      example: "Contribuir para uma sociedade mais [justa/sustentável/educada/saudável]"
    },
    {
      title: "Excelência e inovação",
      description: "Estabelecer novos padrões de qualidade ou inovação em seu setor", 
      example: "Definir um novo padrão de qualidade em [setor]"
    },
    {
      title: "Propósito pessoal/profissional",
      description: "Origem em uma motivação pessoal do fundador, compartilhando conhecimento",
      example: "Compartilhar minha experiência para acelerar a jornada de outros"
    },
    {
      title: "Eficiência/Simplificação",
      description: "Tornar processos complexos em algo simples e eficiente para o cliente",
      example: "Facilitar a vida de [público-alvo] com soluções simples e práticas"
    },
    {
      title: "Acesso/Democratização",
      description: "Oferecer acesso ampliado a algo antes restrito a poucos",
      example: "Tornar [produto/serviço] acessível a mais pessoas"
    },
    {
      title: "Conexão/Comunidade",
      description: "Criar e fortalecer uma comunidade ou conexões entre pessoas",
      example: "Construir uma rede de apoio e colaboração para [objetivo]"
    },
    {
      title: "Liberdade/Autonomia", 
      description: "Empoderar clientes para que tenham mais liberdade de escolha ou decisão",
      example: "Dar autonomia para que pessoas tomem melhores decisões em [contexto]"
    },
    {
      title: "Legado/Inspiração",
      description: "Deixar um impacto inspirador para futuras gerações ou mudar mentalidades",
      example: "Deixar um legado que inspire futuras gerações em [tema]"
    },
    {
      title: "Especialização/Nicho",
      description: "Ser referência altamente especializada em um nicho específico",
      example: "Ser a referência em [segmento muito específico]"
    },
    {
      title: "Proteção/Segurança",
      description: "Garantir segurança, proteção ou redução de riscos para clientes",
      example: "Garantir que [público] se sinta seguro em [contexto]"
    },
    {
      title: "Prazer/Estilo de vida",
      description: "Tornar a vida do público mais agradável, prazerosa ou estilosa",
      example: "Oferecer experiências que tragam bem-estar e alegria"
    },
    {
      title: "Performance/Alta competição",
      description: "Levar clientes ao seu máximo desempenho ou resultados acima da média",
      example: "Ajudar a alcançar excelência em [área]"
    },
    {
      title: "Sustentabilidade/Meio ambiente",
      description: "Promover práticas sustentáveis e cuidado ambiental em seu mercado", 
      example: "Reduzir impacto ambiental em [setor]"
    },
    {
      title: "Educação/Consciência",
      description: "Elevar o conhecimento ou conscientização sobre um tema importante",
      example: "Empoderar pessoas através da educação em [assunto]"
    },
    {
      title: "Exclusividade/Status",
      description: "Proporcionar exclusividade, prestígio ou senso de status aos clientes",
      example: "Oferecer acesso único a experiências ou produtos raros"
    },
    {
      title: "Velocidade/Agilidade",
      description: "Entregar soluções de forma mais rápida e ágil que alternativas",
      example: "Ajudar clientes a conquistarem resultados em menos tempo"
    },
    {
      title: "Exploração/Descoberta",
      description: "Incentivar descobertas e exploração de novas possibilidades",
      example: "Guiar pessoas a descobrirem oportunidades escondidas em [setor]"
    },
    {
      title: "Identidade/Expressão pessoal",
      description: "Ajudar clientes a expressarem quem são ou a fortalecer sua identidade",
      example: "Oferecer meios para que cada um mostre quem realmente é"
    },
    {
      title: "Transformação cultural/comportamental",
      description: "Desafiar o status quo e influenciar mudanças culturais ou de comportamento",
      example: "Quebrar paradigmas e preconceitos em [área]"
    },
    {
      title: "Colaboração/Cocriação",
      description: "Criar soluções de forma colaborativa com clientes ou parceiros",
      example: "Cocriar o futuro de [mercado] em colaboração com [grupo]"
    },
    {
      title: "Justiça/Equidade",
      description: "Lutar por equidade, justiça e inclusão em determinado contexto",
      example: "Promover igualdade de oportunidades em [setor]"
    },
    {
      title: "Tradição/Preservação",
      description: "Valorizar tradição, história ou patrimônio cultural, mantendo-os vivos",
      example: "Proteger a essência de [tema] para as próximas gerações"
    },
    {
      title: "Saúde/Vitalidade",
      description: "Promover saúde, vitalidade e bem-estar integral",
      example: "Ajudar pessoas a viverem mais e melhor"
    },
    {
      title: "Tecnologia/Futuro",
      description: "Usar tecnologia de ponta para moldar um futuro melhor",
      example: "Ser pioneiro em soluções digitais que transformam [mercado]"
    },
    {
      title: "Entretenimento/Inspiração criativa",
      description: "Levar criatividade, arte ou entretenimento ao público, inspirando-o",
      example: "Criar experiências que emocionam e surpreendem"
    },
    {
      title: "Resiliência/Superação",
      description: "Inspirar superação de desafios e resiliência diante de obstáculos",
      example: "Mostrar que é possível superar barreiras em [assunto]"
    },
    {
      title: "Hospitalidade/Cuidado",
      description: "Acolher e cuidar do cliente em cada detalhe, gerando sensação de acolhimento",
      example: "Fazer cada cliente se sentir acolhido e valorizado"
    }
  ];

  const handleMissionToggle = (mission: string) => {
    if (selectedMissions.includes(mission)) {
      // Remove if already selected
      setSelectedMissions(selectedMissions.filter(m => m !== mission));
    } else {
      // Add if not selected and under limit
      if (selectedMissions.length < 3) {
        setSelectedMissions([...selectedMissions, mission]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMissions.length > 0 && onContinue) {
      onContinue({ brandMissions: selectedMissions });
    }
  };

  const isValidToSubmit = selectedMissions.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6">
        <Logo />
      </div>

      {/* Phase Header */}
      <div className="px-6 mb-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
            <h2 className="text-lg font-semibold text-accent text-center">
              Fase 2: Tom de Voz da Sua Marca
            </h2>
            <p className="text-sm text-accent/80 text-center mt-1">
              Etapa 1: Definir Identidade da Marca
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Question */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-900 text-left font-outfit leading-tight">
              Qual é a missão central da marca?
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Selecione de 1 a 3 opções que mais se conectam à marca ({selectedMissions.length}/3)
            </p>
          </div>

          {/* Mission Options */}
          <div className="flex-1 min-h-0">
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {missions.map((mission) => {
                const isSelected = selectedMissions.includes(mission.title);
                const isDisabled = !isSelected && selectedMissions.length >= 3;
                
                return (
                  <button
                    key={mission.title}
                    type="button"
                    onClick={() => handleMissionToggle(mission.title)}
                    disabled={isDisabled}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-accent bg-accent/5 text-accent'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 text-gray-900 hover:border-accent hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm">
                          {mission.title}
                        </h3>
                        {isSelected && (
                          <div className="text-accent ml-2 flex-shrink-0">✓</div>
                        )}
                      </div>
                      <p className="text-xs opacity-75 leading-relaxed">
                        {mission.description}
                      </p>
                      <p className="text-xs italic opacity-60">
                        Ex: {mission.example}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Section with Continue Button */}
          <div className="pt-6 pb-8">
            <button
              type="submit"
              disabled={!isValidToSubmit}
              className={`w-full py-4 px-6 rounded-full font-medium text-white text-lg transition-all duration-200 font-outfit ${
                isValidToSubmit
                  ? 'bg-black hover:bg-gray-800 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
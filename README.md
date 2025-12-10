# War - Jogo de Estrategia

Um jogo de tabuleiro online inspirado no classico War/Risk, construido com tecnologias modernas.

## Stack Tecnologica

- **Frontend:** React 19 + TypeScript + Vite
- **Estilizacao:** TailwindCSS 4
- **Backend/Database:** Convex (real-time)
- **Renderizacao:** SVG + PixiJS (para animacoes)
- **Audio:** Howler.js
- **Estado:** Zustand

## Funcionalidades

- Multiplayer online em tempo real
- Salas de jogo com codigos para compartilhar
- Sistema de turnos com 3 fases:
  - **Reforcos:** Distribua exercitos nos seus territorios
  - **Ataque:** Ataque territorios vizinhos inimigos
  - **Fortificacao:** Mova exercitos entre seus territorios
- Sistema de combate com dados animados
- Bonus por continentes
- Chat em tempo real (em desenvolvimento)

## Instalacao

### Pre-requisitos

- Node.js 18+
- Conta no [Convex](https://convex.dev)

### Passos

1. Clone o repositorio e instale as dependencias:

```bash
npm install
```

2. Configure o Convex:

```bash
npx convex dev
```

Isso vai pedir para voce criar um projeto no Convex e configurar a URL.

3. Crie o arquivo `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo com sua URL do Convex.

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Em outro terminal, inicie o Convex:

```bash
npm run dev:convex
```

Ou use o comando combinado:

```bash
npm run dev:all
```

## Deploy

### Vercel

1. Conecte seu repositorio ao Vercel
2. Configure a variavel de ambiente `VITE_CONVEX_URL` com a URL de producao do Convex
3. O Vercel vai buildar e fazer deploy automaticamente

### Convex

```bash
npx convex deploy
```

## Estrutura do Projeto

```
war/
├── convex/                 # Backend Convex
│   ├── _generated/         # Tipos gerados automaticamente
│   ├── schema.ts           # Schema do banco de dados
│   ├── game.ts             # Logica do jogo
│   ├── rooms.ts            # Gerenciamento de salas
│   ├── users.ts            # Gerenciamento de usuarios
│   └── territories.ts      # Dados dos territorios
├── src/
│   ├── components/         # Componentes React
│   │   ├── HomeScreen.tsx  # Tela inicial
│   │   ├── LobbyScreen.tsx # Sala de espera
│   │   ├── GameScreen.tsx  # Tela do jogo
│   │   ├── GameMap.tsx     # Mapa SVG interativo
│   │   ├── GameSidebar.tsx # Painel lateral
│   │   └── CombatModal.tsx # Modal de combate
│   ├── game/
│   │   └── territories.ts  # Dados dos territorios (frontend)
│   ├── hooks/              # Custom hooks
│   ├── lib/
│   │   └── audio.ts        # Sistema de audio
│   ├── stores/
│   │   └── gameStore.ts    # Estado global (Zustand)
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Regras do Jogo

### Objetivo
Conquistar todos os territorios do mapa.

### Fases do Turno

1. **Reforcos:** Receba exercitos baseado em:
   - Numero de territorios / 3 (minimo 3)
   - Bonus por continentes completos

2. **Ataque:**
   - Ataque territorios vizinhos
   - Use 1-3 dados (minimo de exercitos - 1)
   - Defensor usa 1-2 dados
   - Empates favorecem o defensor

3. **Fortificacao:**
   - Mova exercitos entre territorios vizinhos
   - Apenas uma vez por turno

### Bonus por Continente

| Continente | Bonus |
|------------|-------|
| Asia | +7 |
| Europa | +5 |
| America do Norte | +5 |
| Africa | +3 |
| America do Sul | +2 |
| Oceania | +2 |

## Melhorias Futuras

- [ ] Sistema de cartas
- [ ] Objetivos secretos
- [ ] IA para jogador solo
- [ ] Animacoes avancadas com PixiJS
- [ ] Efeitos sonoros
- [ ] Chat em tempo real
- [ ] Historico de partidas
- [ ] Ranking de jogadores

## Licenca

MIT

# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-35.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 36: Origens, parte 1 (museu, antepassados, salas 1 e 2) e currículo ampliado

Branch `ccr-955e3134-89aw6g`, a partir da principal depois do merge da
rodada 35.

### Etapa 1 — Currículo ampliado (commit próprio)

- `src/curriculo/curriculo.ts`, `MAPA-CURRICULAR.md` e ROADMAP, todas as
  zonas novas com `requerMotor` e o lugar justificado no mapa curricular:
  - Páginas vivas: **Objetos e classes** (primeira zona: os elementos da
    página são objetos com métodos) e **Programação assíncrona** (depois do
    DOM, antes de Eventos e do fetch).
  - **Ilha Python** (`python`) logo depois de Rede e Servidor e antes da
    IA: fundamentos, orientação a objetos, dados (arquivos, CSV, gráficos) e
    "Outras linguagens" (C, Java/C# e o conceito que é o mesmo). Arte nova
    no mundo (`ArtePython`), o mundo da trilha Web ficou 250 px mais largo.
  - Rede e Servidor: **LGPD e ética** (depois de Segurança, antes do
    projeto), com ponte para a privacidade da IA.
  - Ofício: **Pensando sistemas** e **Como equipes trabalham** (depois de
    Testes automatizados), **Da máquina à produção** (antes do deploy) e
    **Carreira** (a última).
  - Inglês técnico como fio contínuo: `termoIngles` no `Conceito` (o
    glossário mostra "em inglês: ..." e a busca acha pelos dois), regra no
    guia (seção 1).
  - `entrevista-cliente` registrado em `MOTORES_PLANEJADOS`, com as regras
    do prompt (perguntas sugeridas resolvem sozinhas, pergunta livre extra,
    umas 10 perguntas, limite por aluno no servidor, modelo leve, fatos da
    ficha escrita no conteúdo), usado por `oficio-carreira-u3`.
  - Museu: as salas 4 e 6 (planejadas) trocaram de lugar (u4 Por baixo do
    capô, u6 Onde a programação vive), para as salas 3 a 5 ficarem na ordem
    da parte 2 e o corredor seguir as épocas.

### Etapa 2 — O motor do museu e os antepassados

- **Área `exposicao`** na composição (`src/motor/exposicao/modelo.ts`):
  cinco estações (tear, bits, camadas, cor, linha do tempo), estado puro,
  `aplicarAcaoExposicao` usado pela tela, pelas soluções e pela simulação.
  Sete validadores e nove ações (`src/conteudo/tipos.ts`), o evento
  `mexeuNaExposicao`, a checagem `exposicao-do-museu` (dados, ferramenta de
  cada estação, validadores e ações só nas peças que existem), o progresso
  salvo (`EstadoFaseSalvo.exposicao`), o degrau 3 `alvo: "exposicao"`, o
  contexto do tutor e a miniatura da meta.
- **Antepassados** (`src/componentes/museu/antepassados/`): tecelã (tear
  de Jacquard como avó, com a corrente de cartões andando), sonhadora de
  engrenagens (metade de latão, metade planta tracejada), gigante de
  válvulas (as válvulas acendem por palavra, bigode de cabos), terminal
  verde (rabugento, braços cruzados), computador bege (acena com um
  disquete), internet discada (globo tagarela sobre o modem) e celular.
  Piscam, respiram, a boca acompanha o texto e dormem em silhueta.
  `FalaAntepassado` dá o jeito de cada época (trama, engrenagens, válvulas,
  terminal sem acento, 8 bits, modem, notificações), com sons sintetizados
  novos (`fala-*`, `epoca-*`, peças e `proxima-geracao`).
- Tokens `--cor-museu-*` e `--cor-ante-*` nos três temas; mostruário
  `/lab/antepassados`.

### Etapa 3 — O corredor e a próxima geração

- `/ilha/origens` (`src/componentes/museu/corredor/`): corredor de lado no
  computador e descendo no celular (em pé e deitado), parede do fundo em
  profundidade, as oito épocas com faixa, quadro, holofote e pedestal. O
  antepassado acorda quando 60% da época aparece (IntersectionObserver),
  com o som dele, e fala do jeito da época; o computadorzinho guia e reage
  ("Essa é a minha bisavó!"). As portas (`src/lib/museu.ts`) saem do
  currículo e do progresso.
- A árvore da família no fim: com a sala 2 concluída, o corredor leva até
  ela, o lugar acende, o aluno monta o retrato (kit de clientes: pele,
  cabelo, cor, roupa, óculos e a assinatura) e entra; confete, o acorde da
  próxima geração e as boas-vindas de cada parente, das raízes ao
  computadorzinho. `Progresso.proximaGeracao` guarda o retrato.

### Etapa 4 — As salas 1 e 2

- Sala 1, **Como o computador entende** (5 fases): o tear (furar cartões
  tece o desenho), uns e zeros (o cartão revela os bits; válvulas com
  pesos 8, 4, 2, 1), as camadas (JavaScript, instruções, linguagem de
  máquina, numa máquina de brinquedo declarada na placa), letras e cores
  (um byte vira A; #ff0000 e #ff8800 na mesa de cores, com o CSS do botão)
  e o desafio da oficina (estrela, letra B, amarelo). Missões: folha
  quadriculada, `(12).toString(2)` no Console, a aba Fontes, o seletor de
  cores do Estilos e a página `hex-color` da MDN em inglês.
- Sala 2, **Linha do tempo** (3 fases): dos cartões às válvulas, do chip
  ao bolso (com as plaquinhas do que mudou) e o desafio da família inteira.
  Fatos conferidos e anotados em `unidade-2/eventos.ts`; épocas por
  década, sem dois cartões da mesma década na mesma linha.
- 12 conceitos novos com temas e `termoIngles`; 24 itens de revisão
  (previsões sobre vitrines). Unidades publicadas.

### Decisões tomadas sem regra clara

- O museu é área da composição, não tipo de fase novo (ganha a escada de
  ajuda, as estrelas, o desafio com Rever e a meta sem tela nova).
- A ilha Python ficou entre Rede e Servidor e IA, só na trilha Web.
- `FASE_INICIAL` continua a primeira de Sites (o museu vem antes na lista,
  fora da rota). Os testes que tomavam a primeira unidade como a de Sites
  passaram a procurá-la.
- O gigante de válvulas não tem sala; o PC bege recebe a sala 4.
- Falas neutras de gênero na cerimônia ("Agora você também programa",
  "Boas-vindas").

### Validação

- `npm run testar:conteudo`: 49 arquivos, 21.319 testes verdes.
- `npm run lint` e `npm run build` verdes.
- `testes/museu.mjs` (corredor, salas 1 e 2 jogadas pela interface, a
  cerimônia e menos movimento) verde nos três layouts; `testes/mapa.mjs`
  atualizado para o corredor.
- Bateria completa (`PARALELO=4`, servidor de produção): 202 execuções, 200
  verdes e 2 falhas.
  - `audio.mjs`: no corredor, o som da primeira época toca logo depois da
    porta e tomava o `data-ultimo-efeito` antes do teste ler. O motor de
    áudio passou a avisar cada efeito (`efeito-tocado`) e o teste confere a
    porta por esse aviso. Rodado de novo: verde (e `museu.mjs` desktop).
  - `unidades.mjs retrato`: o duplo toque da U4F1 não abre o campo de
    edição. Reproduz igual num build da principal (sem a rodada 36), então
    não é desta rodada; ficou em Pendências no ROADMAP.

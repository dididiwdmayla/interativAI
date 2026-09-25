# Roadmap

Fonte única de status do projeto: o que foi feito, o que está em
andamento e o que vem depois. **Todo prompt do Claude Code termina
atualizando a seção Status deste arquivo.** O detalhe de cada rodada
(etapas, decisões, testes) continua em `docs/PROGRESSO.md`.

## Visão

Plataforma/jogo pra ensinar programação de verdade, do zero até dev
júnior e além, de forma super interativa: um DevTools (F12)
simplificado, prévia ao vivo e o computadorzinho como tutor. Tudo que se
aprende funciona no F12 de verdade. No futuro, trilhas paralelas
(Automação industrial com eletrônica e elétrica, Jogos) compartilham o
núcleo comum.

## Fluxo de trabalho

- Estrutura, motor, visual e criatividade: Claude Opus 5.5. Conteúdo em
  massa: Claude Sonnet 5 (esforço médio).
- Fluxo sequencial: uma sessão nova do Claude Code por prompt, a partir
  da branch principal. Merge depois de conferir o relatório.
- Todo prompt termina atualizando a seção Status deste arquivo.
- Materiais de apoio opcionais (ideia em avaliação): textos teóricos
  brutos em `docs/materiais/<ilha>.md`, produzidos fora (ex: DeepSeek) e
  conferidos pelo Sonnet antes de usar.

## Status

### Feito

- Motor: painel Elementos, prévia, sincronia árvore-código-tela,
  ferramentas (árvore, inspecionar, editar, trilha, esconder, apagar,
  desfazer/refazer, duplicar, renomear tag, links na prévia),
  apresentações e Caixa de Ferramentas, escada de ajuda, modos
  guiado/sozinho/previsão/desafio, tutor Gemini com retry e modelo
  reserva, mobile (retrato e paisagem), 3 temas, sons sintetizados,
  easter egg.
- Fábrica: formato declarativo, `testar:conteudo`, congelamento
  (`publicar:conteudo`), guia, template, atritos.
- Mapa: mundo, ilhas, zonas, unidades, Museu das Origens (vazio),
  desbloqueios.
- Conteúdo: Ilha Sites › Elementos, U1 a U5.
- Rodada 9 (painel Estilos, modo documento, ROADMAP):
  - `docs/ROADMAP.md` (este arquivo) e a regra de atualizar o Status no
    fim de todo prompt (`PROJETO.md` e guia).
  - Currículo com as adições do mapa: ilha IA entre Rede e Servidor e
    Ofício (5 zonas, todas com "IA ao vivo" como motor), sala "Por baixo
    do capô" nas Origens, zonas novas na Lógica (Resolvendo problemas,
    Estruturas de dados, Algoritmos essenciais), na Rede e Servidor
    (Login e autenticação, Segurança; APIs REST e SQL/NoSQL como
    unidades novas) e no Ofício (Git em equipe, Ler código dos outros,
    TypeScript, Testes automatizados, Variáveis de ambiente, Portfólio).
    Filosofia no topo do `MAPA-CURRICULAR.md`. Arte da ilha IA
    (constelação e farolzinho) no mundo, "em construção".
  - CSS editável (`siteAlvo.css`) e motor de cascata próprio
    (`src/motor/css/`): regras que casam, especificidade, ordem,
    `!important`, inline, herança, atalhos, riscadas e valor vencedor,
    rodando igual no navegador e no jsdom; quando não sabe, não risca.
    Editor com abas HTML e CSS; validadores `valorEfetivo`, `declaracao`,
    `regraExiste`, `riscada`; ações de CSS; Bancada do motor no
    `/lab/fases`.

### Em andamento

- Rodada 9, etapas 3 a 7: painel Estilos e Calculado dentro de
  Elementos, modo documento, adicionar atributo pela árvore, mobile dos
  painéis novos, liberações no currículo e a unidade-modelo E1 ("A aba
  Estilos").
- Áudio: planejamento numa conversa separada (músicas no Suno Pro,
  efeitos no ChatGPT). A integração no jogo virá por um prompt do Claude
  Code.

### Próximo (em ordem)

1. Sonnet: U6, E2 a E4 e L1 a L4, depois desta tarefa.
2. Opus: camada de trilhas acima das ilhas, temas (lente sobre o mapa:
   Segurança, APIs, Dados, Desempenho, Acessibilidade, IA, com progresso
   e insígnias), profissões (Front-end, Back-end, Segurança, Dados,
   DevOps, como combinações de temas), glossário vivo (catálogo
   pesquisável com onde cada termo é ensinado e praticado) e sistema de
   áudio.
3. Revisão do dia: ponto fixo no mapa com desafios curtos por revisão
   espaçada.
4. Motores das próximas ilhas (Opus), intercalados com conteúdo
   (Sonnet): E5 (o jogo como site-alvo), Responsivo (modo dispositivo),
   Publicar (auditoria, exportar, projeto-ponte), Origens (linha do
   tempo, comparador de linguagens, diagrama), Lógica (Console, execução
   de JS, depurador), Páginas vivas, Rede e Servidor, IA (IA ao vivo),
   Ofício.

## Decisões aprovadas

- A ordem das ilhas segue a progressão, por causa dos pré-requisitos.
  Temas e profissões são lentes sobre o mapa, não uma reorganização.
- Trilhas: o núcleo comum (Origens, Lógica, IA, Ofício) serve pra
  todas; Web, Jogos e Automação têm ilhas próprias.
- Áudio:
  - um tema musical por ilha, mais o mapa e o museu;
  - loops sem emenda audível, carregados só quando necessários, com
    transição suave entre telas;
  - volume de música separado do de efeitos;
  - áudio só depois da primeira interação;
  - sons sintetizados pras micro-interações e arquivos gerados pros
    momentos grandes;
  - Suno Pro (uso comercial ok; guias de terceiros reportam 20 downloads
    por mês).
- Critério final do núcleo: o projeto do Ofício, feito a partir de uma
  página em branco, sem roteiro.

## Estimativas (grosseiras)

- Núcleo: umas 130 unidades, de 400 a 450 fases, mais de 100 horas com
  os projetos.
- Ilha Sites: 19 unidades, de 8 a 12 horas de jogo.
- Gargalo: o motor de cada ilha (Opus) e o tempo de validação jogando.

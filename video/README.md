# Vídeo de apresentação do InterativAI

O vídeo "Fase 0: Conhecer o InterativAI", feito com o próprio jogo: cenas gravadas do jogo rodando, o computadorzinho de verdade (o SVG e os tokens do repositório), a voz de modem dele (o gerador do repositório) e as músicas e os efeitos de `public/audio`.

É um projeto separado do jogo (Remotion). Nada daqui entra no build da raiz: a pasta `video/` está fora do `tsconfig.json` e do ESLint da raiz, e nada em `src/`, `public/` ou `testes/` do jogo é alterado.

## O que está onde

| Pasta ou arquivo | O que é |
| --- | --- |
| `saida/` | Os arquivos finais, sempre com a versão no nome (`-v1`, `-v2`...). Versionados. |
| `revisao/` | As folhas de contato da última rodada (um quadro a cada 2 s de cada vídeo, e 12 quadros de cada tomada) e o `revisao.txt`. Versionadas. |
| `ROTEIRO.md` | O roteiro com os tempos finais, gerado do `src/roteiro.ts`. |
| `src/roteiro.ts` | A fonte única: blocos, tempos, falas, tomadas, câmera, músicas e efeitos, das duas versões. |
| `src/composicoes/` | A montagem (`Apresentacao.tsx`), os blocos desenhados (`blocos/`) e as capas (`Capa.tsx`). |
| `src/pecas/` | As peças do vídeo: computadorzinho, balão, lista de objetivos, tecla F12, cursor, mergulho na tela, tomada, trilha. |
| `src/dados/` | O que os scripts geram e o vídeo lê: `numeros.json`, `vozes.json`, `batidas.json` e `takes/` (o registro de cada tomada). Versionados. |
| `scripts/` | Gravar, montar, gerar vozes, contar, renderizar, revisar e finalizar. |
| `public/` | Tomadas em mp4, vozes, músicas e efeitos usados no render. Fora do git: os scripts geram de novo. |
| `captura/brutos/` | Os quadros de cada gravação. Fora do git. |

## Do zero ao vídeo

Tudo roda a partir da pasta `video/`. Precisa do Node, do ffmpeg e do Playwright com o Chromium (os mesmos dos testes do jogo).

```bash
cd video
npm install

# 1. O jogo no ar, em build de produção (na raiz do repositório)
(cd .. && npm install && npm run build && npm start)     # deixa rodando em http://localhost:3000

# 2. Preparação
node scripts/contar.mjs      # números do jogo -> src/dados/numeros.json
node scripts/batidas.mjs     # andamento das músicas -> src/dados/batidas.json
node scripts/vozes.mjs       # voz do computadorzinho, sons sintetizados, músicas e efeitos -> public/
node scripts/gravar.mjs      # as 22 tomadas -> public/takes/*.mp4 e src/dados/takes/*.json

# 3. Roteiro, rascunho e render
node scripts/roteiro-md.mjs              # confere o roteiro e gera o ROTEIRO.md
node scripts/renderizar.mjs --rascunho   # metade do tamanho, para ajustar
node scripts/renderizar.mjs              # tamanho final -> out/

# 4. Revisão e entrega
node scripts/revisar.mjs         # folhas de contato, preto e congelado, áudio, afirmações
node scripts/finalizar.mjs v2    # mixagem, capas e legenda -> saida/ (nomes com -v2)
```

`npm run estudio` abre o Remotion Studio para ver e ajustar com a linha do tempo.

### Sem acesso ao Google Fonts ou ao download do Chromium

- O build do jogo busca a Nunito e a JetBrains Mono no Google Fonts. Numa máquina em que a rede bloqueia isso (foi o caso da sessão em que a v1 foi feita), use `node scripts/build-do-jogo.mjs` no lugar do `npm run build`: ele serve as mesmas fontes dos pacotes `@fontsource-variable` desta pasta para o Next, sem alterar o jogo.
- O render usa o Chromium do próprio Remotion (`npx remotion browser ensure`). Se o download for bloqueado, o `navegador.mjs` aponta para o headless shell do Playwright (`~/.cache/ms-playwright` ou `PLAYWRIGHT_BROWSERS_PATH`). Para escolher outro, `REMOTION_BROWSER=/caminho/do/chrome`.

## Como fazer uma v2

1. **Mudar uma fala, um tempo ou um corte:** edite `src/roteiro.ts`. Se a fala mudou, rode `node scripts/vozes.mjs` (a voz é gerada de novo pelo código do jogo). Rode `node scripts/roteiro-md.mjs`: ele avisa se um corte passa do fim da tomada ou se um balão atropela o outro.
2. **Regravar uma tomada:** com o jogo no ar, `node scripts/gravar.mjs T05` (uma ou mais; sem nada, todas). O passo a passo de cada tomada está em `scripts/tomadas.mjs`. Depois, olhe a folha em `revisao/tomadas/` (balão cobrindo a ação, carregamento pela metade, foco errado, texto cortado). O roteiro acha os momentos pelas marcas do registro (`t.marcar("nome")`), então regravar não desalinha os cortes que usam `{ marca: "..." }`.
3. **Conferir quadros soltos:** `FOLHA=teste node scripts/quadros.mjs Apresentacao169 14.5 44 75.4` (instantes em segundos) gera `out/quadros/teste.jpg`.
4. **Renderizar e revisar:** rascunho, render final, `node scripts/revisar.mjs` e olhar as folhas em `revisao/`.
5. **Entregar com nome novo:** `node scripts/finalizar.mjs v2`. O script se recusa a escrever por cima de uma versão que já existe: a v1 fica intacta.

## Regras do vídeo (as mesmas do briefing)

- Zero emojis; ícone é SVG. Cores só pelos tokens de `src/tema/tokens.css` do jogo (`var(--cor-...)`), tema Doce; nenhum hexadecimal nas peças (o `revisar.mjs` confere os dois).
- Tudo o que aparece como interface do jogo é gravação real. O que é desenhado só para o vídeo (balão, lista, tecla, cursor, cartão final) tem o visual do jogo, mas não finge ser uma tela que não existe.
- Animação sempre pelo quadro (`useCurrentFrame`, `interpolate`, `spring`). Nada de Framer Motion, CSS `animation`/`transition` ou `setTimeout` nas composições.
- Números do jogo vêm do `scripts/contar.mjs`, nunca escritos à mão. Nada de preço, grátis, assinatura, certificado nem emprego garantido.
- No 9:16, nada essencial nos 220 px de cima, nos 380 px de baixo nem nos 120 px da direita.

## Como as peças funcionam

- **Tomadas:** o `gravar.mjs` usa o screencast do Chrome (CDP), não o `recordVideo` do Playwright. O screencast só manda quadro quando a tela muda; o `montar-tomada.mjs` ordena os quadros pelo carimbo de tempo e monta um mp4 de 30 fps constantes. O ponteiro não aparece na gravação: cada movimento, clique, toque e tecla vai para o registro, e o Remotion redesenha o cursor (ou o dedo) e aproxima a câmera até as caixas registradas.
- **Formatos de gravação** (`scripts/lib/gravador.mjs`): `computador` (1920 x 1080, escala 1) para as tomadas de paisagem (mundo, ilha, corredor do museu); `perto` (página de 1280 x 720, escala 1,5) e `medio` (1600 x 900, escala 1,2) para as tomadas de interface, que saem no mesmo arquivo de 1920 x 1080 com a letra maior; `celular` (412 x 732, escala 2,625) para o vertical.
- **Voz:** `gerarFala` (do jogo) produz os eventos; `tocarEventosVoz` (do jogo) toca num `OfflineAudioContext` de 48 kHz mono no Chromium sem tela, com o passa-baixa do jogo. Os eventos de cada fala ficam em `src/dados/vozes.json`: a boca abre nos apitos, fica meio aberta nos chiados e fecha nas pausas.
- **Música:** as faixas do jogo, cada bloco com a da ilha que está na tela, cruzamento de 1,5 s e o compasso 1 da faixa nova em cima do corte; as durações dos blocos com música são contadas em batidas (`batidas.json`). A música abaixa 8 dB enquanto ele fala.
- **Mergulho na tela:** a cena aparece dentro da tela do monitor do computadorzinho e a câmera mergulha até ela ocupar o quadro. É o mesmo gesto no começo de cada bloco.

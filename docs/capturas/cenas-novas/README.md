# Quatro ambientes do kit

Capturas da execução real das soluções em `/lab/fases`, em retrato
(390 × 844, densidade 3×). Cada PNG contém somente o palco SVG para facilitar a revisão
no celular. Antes e depois incluem também um estado durante a missão,
quando o movimento ou aviso fica mais claro.

| Ambiente | Doce | Fliperama | Segredo |
| --- | --- | --- | --- |
| Garagem | [antes](garagem-doce-antes.png) · [durante](garagem-doce-durante.png) · [depois](garagem-doce-depois.png) | [antes](garagem-fliperama-antes.png) · [durante](garagem-fliperama-durante.png) · [depois](garagem-fliperama-depois.png) | [antes](garagem-segredo-antes.png) · [durante](garagem-segredo-durante.png) · [depois](garagem-segredo-depois.png) |
| Cozinha | [antes](cozinha-doce-antes.png) · [durante](cozinha-doce-durante.png) · [depois](cozinha-doce-depois.png) | [antes](cozinha-fliperama-antes.png) · [durante](cozinha-fliperama-durante.png) · [depois](cozinha-fliperama-depois.png) | [antes](cozinha-segredo-antes.png) · [durante](cozinha-segredo-durante.png) · [depois](cozinha-segredo-depois.png) |
| Esquina | [antes](esquina-doce-antes.png) · [durante](esquina-doce-durante.png) · [depois](esquina-doce-depois.png) | [antes](esquina-fliperama-antes.png) · [durante](esquina-fliperama-durante.png) · [depois](esquina-fliperama-depois.png) | [antes](esquina-segredo-antes.png) · [durante](esquina-segredo-durante.png) · [depois](esquina-segredo-depois.png) |
| Estufa | [antes](estufa-doce-antes.png) · [durante](estufa-doce-durante.png) · [depois](estufa-doce-depois.png) | [antes](estufa-fliperama-antes.png) · [durante](estufa-fliperama-durante.png) · [depois](estufa-fliperama-depois.png) | [antes](estufa-segredo-antes.png) · [durante](estufa-segredo-durante.png) · [depois](estufa-segredo-depois.png) |

Instantes da simulação:

- Garagem: 0 / 2,6 / 5 s — fechada, carro entrando, fechada após a passagem.
- Cozinha: 0 / 4,2 / 7 s — porta fechada, porta aberta com aviso, fechada sem aviso.
- Esquina: 0 / 3,7 / 5,5 s — carros liberados, travessia, pedestre do outro lado.
- Estufa: 0 / 4,8 / 8 s — terra úmida, rega de dia, noite sem rega.

Reproduzir no build de produção em execução:

```sh
URL_JOGO=http://127.0.0.1:3000 CAPTURAS=1 node testes/cenas-novas.mjs retrato
```

O script também verifica os três temas, os estados principais, fichas,
Por dentro, movimento reduzido, cenários alternativos e console limpo.

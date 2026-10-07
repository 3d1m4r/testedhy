Dhyper Media Studio — arquivo para GitHub Pages

Esta pasta é o site já compilado. O arquivo ZIP reúne estes arquivos na raiz, então você pode extraí-lo diretamente na raiz do repositório GitHub Pages.

Os 12 vídeos continuam hospedados no site original e são carregados diretamente de lá. Os vídeos não foram incluídos no ZIP. As capas dos vídeos e as imagens do site estão neste pacote.

GITHUB PAGES
1. Extraia o arquivo ZIP na raiz de um repositório GitHub.
2. No repositório, abra Settings > Pages.
3. Selecione Deploy from a branch, a branch main e a pasta /(root).

NETLIFY
- Para deploy manual, envie a pasta build inteira.
- Para publicar pelo repositório completo, o netlify.toml na raiz configura a compilação e a pasta de publicação.

O pacote funciona como site estático, sem instalar Node.js ou rodar uma compilação no GitHub Pages. É necessário acesso à internet para as fontes externas e para os vídeos hospedados no site original.

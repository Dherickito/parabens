# Um presente de aniversário

Um álbum digital responsivo, com homenagens da família, páginas individuais, galerias preparadas para receber fotos e um botão de música opcional. O projeto não usa dependências externas de JavaScript; o servidor local é feito com Node.js.

## Executar

1. Abra a pasta do projeto no VS Code.
2. Com a extensão Live Server, abra `index.html` na raiz e escolha **Open with Live Server**. Essa é a forma mais simples de visualizar as fotos e as homenagens.

Como alternativa, instale o [Node.js](https://nodejs.org/) (versão 18 ou superior), execute `npm start` e acesse [http://localhost:3000](http://localhost:3000). No PowerShell, se a política de execução impedir `npm`, use `npm.cmd start`.

As páginas individuais podem ser acessadas pelos cartões na página inicial, incluindo a homenagem da netinha que está a caminho.

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica automaticamente o conteúdo de `public/` no GitHub Pages sempre que houver um push para a branch `main`. Nas configurações do repositório, confirme que **Settings > Pages > Build and deployment > Source** está definido como **GitHub Actions**. Após a primeira implantação, o site ficará disponível em `https://<usuario>.github.io/<repositorio>/`.

O repositório e o site podem ser públicos. As fotografias e mensagens publicadas ficarão acessíveis a qualquer pessoa com o link.

## Personalizar as mensagens

Edite `public/messages.js` para mudar a homenagem da família, as frases dos cartões, as apresentações e as mensagens individuais. Cada familiar tem sua própria mensagem e a lista `photos` indica as imagens da galeria; a primeira foto é usada também no cartão e no destaque da página individual.

## Adicionar fotografias

Substitua os arquivos-guia nas pastas abaixo por suas imagens:

```text
public/images/
├── familia/principal.jpeg, mae1.jpeg–mae3.jpeg, foto1.jpeg–foto8.jpeg
├── dherick/principal.jpeg, foto1.jpeg–foto7.jpeg
├── douglas/principal.jpeg, foto1.jpeg–foto4.jpeg
├── daniel/principal.jpeg, foto1.jpeg–foto2.jpeg
├── valbinho/principal.jpeg, foto1.jpeg–foto3.jpeg
└── neta/principal.jpeg
```

As fotos originais foram preservadas em `fotos/`; cópias foram organizadas nas pastas corretas em `public/images/`. O álbum principal exibe os retratos da mãe e as fotos da família, cada um com uma legenda carinhosa. Clique ou pressione Enter em uma fotografia para abri-la em um quadro centralizado; pressione Esc ou use o botão de fechar para voltar ao álbum. Fotos ausentes mostram um espaço reservado ilustrado, sem interromper a navegação.

## Escolher a música

Coloque sua música em `public/music/musica-escolhida.mp3`. A reprodução só começa após o clique no botão “Nossa trilha”, conforme as restrições dos navegadores. Se o arquivo ainda não tiver sido adicionado, o botão informa que falta escolher a música.

As fontes Playfair Display e DM Sans podem ser carregadas do Google Fonts; se o acesso à internet não estiver disponível, fontes do sistema serão usadas.

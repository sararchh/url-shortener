<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# URL Shortener

Sistema para encurtar URLs em NestJS

## Inicialização e Configuração do Projeto

### Clonar o repositório

```bash
$ git clone https://github.com/sararchh/url-shortener.git
```

### Instalar dependências

```bash
$ yarn install
```

### Configurar variáveis de ambiente

Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente, seguindo o exemplo:

```bash
DATABASE_URL="postgresql://master:123456@database:5432/mydb?schema=public"
POSTGRES_USER="master"
POSTGRES_PASSWORD=123456
POSTGRES_DB="mydb"

JWT_SECRET="mysecretjwt"
PORT=3000
SALT_ROUNDS=10
```

### Executar Docker Compose

Para iniciar o container:

```bash
$ docker-compose up --build -d
```

Para parar o container:

```bash
$ docker-compose down
```

## Compilar e executar o projeto sem Docker

### Executar migrações

```bash
$ yarn migration:run
```

### Desenvolvimento

```bash
$ yarn run start:dev
```

### Produção

```bash
$ yarn run start:prod
```

## Padrão de Commit

Este projeto utiliza o padrão de commits convencionais. Por favor, siga as regras abaixo ao escrever suas mensagens de commit:

- **feat**: Adição de uma nova funcionalidade
- **fix**: Correção de um bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula ausente, etc)
- **refactor**: Mudança de código que não corrige um bug nem adiciona uma funcionalidade
- **perf**: Mudança de código que melhora a performance
- **test**: Adição de testes faltantes ou corrigindo testes existentes
- **build**: Mudanças que afetam o sistema de build ou dependências externas (escopos de exemplo: gulp, broccoli, npm)
- **ci**: Mudanças em arquivos e scripts de configuração de CI (exemplos de escopos: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Outras mudanças que não modificam arquivos de src ou de teste
- **revert**: Reversão de um commit anterior

### Exemplo de mensagem de commit

```
feat: add endpoint to shorten URL
```

### Swagger
- Se encontra na rota /api/docs 
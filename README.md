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

### Executar migrações

```bash
$ yarn migration:run
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

### Desenvolvimento

```bash
$ yarn run start:dev
```

### Produção

```bash
$ yarn run start:prod
```

## Scripts Disponíveis

Além dos comandos acima, você pode usar os seguintes scripts definidos no [package.json](package.json):

- `build`: Compila o projeto
- `format`: Formata o código usando Prettier
- `start`: Inicia o projeto
- `start:dev`: Inicia o projeto em modo de desenvolvimento
- `start:debug`: Inicia o projeto em modo de depuração
- `start:prod`: Inicia o projeto em modo de produção
- `lint`: Executa o ESLint para verificar o código
- `test`: Executa os testes
- `test:watch`: Executa os testes em modo de observação
- `test:cov`: Executa os testes e gera um relatório de cobertura
- `test:debug`: Executa os testes em modo de depuração
- `test:e2e`: Executa os testes end-to-end
- `prisma:generate`: Gera o cliente Prisma
- `migration:generate`: Gera uma nova migração Prisma
- `migration:run`: Executa as migrações Prisma
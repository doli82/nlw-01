# ecoleta-server

## Começando
Dentro da pasta raiz deste servidor, execute o comando a seguir para instalar as dependências.

```bash
npm install
```

Crie o arquivo `.env` na pasta raiz do servidor e insira as variáveis a seguir, alterando o valor do IP presente na variável `BASE_URL` para o IP da sua máquina:

```text
PORT = 3333
BASE_URL = http://192.168.0.101
```

### Instalando o banco de dados

Antes de executar o projeto pela primeira vez, utilize o comando abaixo com a finalidade de preparar o banco de dados `sqlite` para persistir os dados da API

```
npm run knex:migrate
```

Este passo deve ser executado apenas uma vez e serve para popular o banco de dados de ítens que podem ser coletados pelos pontos de coleta

```
npm run knex:seed
```

### Inicializando o servidor 

Após todos os passos anteriores, seu servidor está pronto para ser inicializado em ambiente de desenvolvimento com o seguinte comando:

```
npm run dev
```

Ir para o [README.md](../README.md) principal do projeto
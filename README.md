# TESTE LEV

## Introdução

Este projeto consiste em um sistema de dashboard para gerenciar contratos. Ele permite a criação, visualização, edição, exclusão e importação de contratos através de uma interface web.

## Pré-requisitos

Antes de executar o projeto, você precisará ter as seguintes ferramentas instaladas em sua máquina:

* **Node.js:**
* **npm** ou **yarn**
* **MongoDB**

## Instalação

Siga os passos abaixo para configurar o projeto:

**1. Clonar o Repositório:**

Abra o seu terminal e navegue até o diretório onde você deseja clonar o projeto. Execute o seguinte comando:

```
git clone https://github.com/sergiojordan1/lev-teste.git
cd lev-teste
```

**2. Configurar o backend:**

* Navegue até a pasta `raiz` do projeto e instale as dependencias:

```
npm install
# ou
yarn install
```

* Configure as variáveis de ambiente:

No arquivo `.env` dentro da pasta `raiz` substitua a string de conexão do mongodb e as portas caso necessário:

    PORT=3001 # Ou outra porta de sua preferência para o backend
    MONGODB_URI=mongodb://localhost:27017/lev-teste # Substitua por sua URI do MongoDB

**3. Executar o servidor do backend:**

No terminal, dentro da pasta `raiz`, execute o seguinte comando para iniciar o servidor:

```
npm run dev
# ou
yarn dev
```

O servidor backend deve estar rodando em `http://localhost:3001` (ou na porta que você alterou no .env).

**4. Executar scripts iniciais:**

Executar scrips para adicionar um usuário admin para conseguir fazer login e acessar o dashboard.

* **Adicionar Usuario Admin:** No terminal, dentro da pasta raiz, execute o seguinte comando para criar um usuário admin.

```bash
node scripts/addUserAdmin.js
```

* **IMPORTANTE:** Para acessar o dashboard, é preciso fazer login com o **login** `email@admin.com` e a **senha** `admin123`.

Executar scrips para adicionar alguns registros na tabela de contratos para a visualização no dashboard.

* **Adicionar Contratos:** No terminal, dentro da pasta raiz, execute o seguinte comando para criar um usuário admin.

```bash
node scripts/addContracts.js
```

**5. Configurar o Frontend:**

* Acesse o projeto do frontend está dentro da pasta `application`:

```
cd application
```

* Instale as dependências do frontend:

```
npm install
# ou
yarn install
```

**6. Executar o frontend:**

No terminal, ainda dentro da pasta `application`, execute o seguinte comando para iniciar a aplicação React:

```
npm start
# ou
yarn start
```

A aplicação frontend deve abrir automaticamente no seu navegador em `http://localhost:3000`.

## Executando a Aplicação

1.  Certifique-se de que o servidor **MongoDB** esteja em execução.
2.  Execute o **backend** seguindo as instruções do passo 3 da instalação.
3.  Execute o **frontend** seguindo as instruções do passo 6 da instalação.

## Acessando a Aplicação

* Abra o seu navegador e acesse a URL onde o frontend está rodando `http://localhost:3000/login`.
* Após realizar o login com o usuário e senha criados nos scripts do passo 4, deverá ser redirecionado para o dashboard `http://localhost:3000/dashboard`.

## Importação

* Dentro da pasta `assets` tem uma planilha que deve ser usada para realizar a importação dentro do dashboardç.

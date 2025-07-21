# Gerenciador de Tarefas (Fullstack - Django REST Framework & React)

Este é um projeto fullstack de um Gerenciador de Tarefas que permite aos
usuários se registrarem, fazerem login, criarem, visualizarem,
atualizarem (marcar como concluída) e excluírem suas tarefas.

O backend é construído com Django REST Framework (DRF) e o frontend com React.

## 🚀 Funcionalidades

Backend (Django REST Framework)

 - Autenticação JWT: Registro de usuários, login e gerenciamento de tokens de acesso e refresh.

 - Gerenciamento de Tarefas: API para operações CRUD (Criar, Ler, Atualizar, Excluir) em tarefas.

 - Permissões: Garante que cada usuário só possa gerenciar suas próprias tarefas.

 - Modelos de Dados: User (nativo do Django) e Task.

Frontend (React)

 - Autenticação: Telas de Login e Registro.

 - Proteção de Rotas: Redirecionamento de usuários não autenticados.

 - Listagem de Tarefas: Exibe as tarefas do usuário logado.

 - Criação/Edição de Tarefas: Formulário modal para adicionar ou modificar tarefas.

 - Filtragem de Tarefas: Opções para visualizar todas, completas ou incompletas.

 - Consumo de API: Integração com o backend Django REST Framework.



## ⚙️ Configuração e Execução do Projeto

Siga os passos abaixo para colocar o projeto para rodar em sua máquina local.

### ✅ Pré-requisitos

- Python 3.x e pip
- Node.js e npm (ou Yarn)

---

## 1. Clonar o Repositório

```bash
git clone <https://github.com/Maxlobo/TesteAdviceHealth.git>
cd TesteAdviceHealth
```

## 2. Configuração do Backend (Django REST Framework)

### 2.1. Navegue até a pasta do backend:

```bash
cd backend
```

### 2.2. Criar e Ativar o Ambiente Virtual

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2.4. Rodar Migrações

```bash
python manage.py migrate
```

### 2.5. Iniciar o Servidor Backend

```bash
python manage.py runserver
```

O servidor estará rodando em:
👉 http://localhost:8000


## 3. Configuração do Frontend (React)

Abra um novo terminal e navegue para a pasta do frontend:

cd ../frontend # Ou cd frontend se você já estiver na raiz do projeto

### 3.1. Instalar Dependências

```bash
npm install
```
OR
```bash
yarn install
```

### 3.2. Iniciar o Servidor Frontend

```bash
npm start
```
OR
```bash
yarn start
```

O servidor estará rodando em:
👉 http://localhost:3000
📝 Uso do Aplicativo

# Twitter Clone - Projeto Completo

Um clone completo do Twitter desenvolvido com **Node.js + Express + PostgreSQL** no backend e **React Native + Expo** no frontend, incluindo sistema de avatar e upload de imagens.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** com **Knex.js**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Multer** para upload de arquivos
- **CORS** habilitado
- Estrutura **MVC** (Models, Views, Controllers)

### Frontend
- **React Native** com **Expo**
- **Expo Router** para navegação
- **Redux Toolkit** para gerenciamento de estado
- **Context API** para funcionalidades específicas (Auth, Tweet)
- **AsyncStorage** para persistência local
- **Axios** para comunicação com API
- **Expo Image Picker** para seleção de imagens
- **React Hook Form** para formulários

## 📁 Estrutura do Projeto

```
AmigoTech/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middlewares/     # Middlewares (auth, validação, upload)
│   │   ├── models/          # Models do banco
│   │   ├── routes/          # Definição das rotas
│   │   ├── migrations/      # Migrations do banco
│   │   └── config/          # Configurações
│   ├── uploads/            # Arquivos de upload (avatars)
│   ├── server.js           # Servidor principal
│   └── knexfile.js         # Configuração do Knex
└── twitter-clone/          # App React Native
    ├── app/                # Telas (Expo Router)
    ├── src/
    │   ├── components/     # Componentes reutilizáveis
    │   ├── contexts/       # Context API (Auth, Tweet)
    │   ├── redux/          # Redux store e slices
    │   └── services/       # API calls
    └── package.json
```

## 🛠️ Como Executar

### 1. Configurar o Banco de Dados

```bash
# Criar banco PostgreSQL
createdb twitter_clone

# Ou via psql
psql -U postgres
CREATE DATABASE twitter_clone;
```

### 2. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Executar migrations
npm run migrate

# Executar seeds (opcional)
npm run seed

# Iniciar servidor
node server.js
```

### 3. Frontend

```bash
cd twitter-clone

# Instalar dependências
npm install

# Instalar dependência do image picker
npx expo install expo-image-picker

# Iniciar Expo
npx expo start

# Iniciar Android
digitar "a" no terminal
```

## 🔧 Configuração da API

No arquivo `twitter-clone/src/services/api.ts`, ajuste a baseURL conforme seu ambiente:

- **Expo Go (web)**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`

## 📱 Funcionalidades Implementadas

### ✅ Backend (API)
- [x] **Autenticação**
  - POST `/auth/register` - Cadastro de usuário
  - POST `/auth/login` - Login de usuário
- [x] **Tweets**
  - POST `/tweets` - Criar tweet (autenticado)
  - GET `/tweets` - Feed geral com avatar dos usuários
  - GET `/tweets/:userId` - Tweets de um usuário
  - GET `/search` - Busca tweets por usuário
  - DELETE `/tweets/:id` - Excluir tweet (apenas dono)
- [x] **Likes**
  - POST `/tweets/:id/like` - Curtir tweet
  - DELETE `/tweets/:id/like` - Descurtir tweet
- [x] **Upload de Avatar**
  - POST `/users/avatar` - Upload de foto de perfil
  - DELETE `/users/avatar` - Remover foto de perfil
  - Servir arquivos estáticos em `/uploads`
- [x] **Middlewares**
  - Autenticação JWT
  - Validação de dados
  - Upload de arquivos (Multer)
  - CORS habilitado

### ✅ Frontend (React Native)
- [x] **Navegação**
  - Expo Router configurado
  - Telas de Login/Register
  - Stack privada (Feed, Criar Tweet, Perfil)
  - Sidebar com menu lateral
- [x] **Estado Global**
  - Redux Toolkit configurado
  - AuthSlice (usuário e token)
  - TweetSlice (feed e tweets)
  - Context API para funcionalidades específicas
  - Sincronização de tweets e avatar
  - Pesquisa de tweets por usuário
- [x] **Telas Principais**
  - Login/Registro com validação
  - Feed com FlatList e pull-to-refresh
  - Criar Tweet com contador de caracteres
  - Perfil de usuário com avatar
- [x] **Sistema de Avatar**
  - Upload de foto de perfil
  - Seleção de imagem da galeria
  - Crop automático (1:1)
  - Exibição no header, sidebar e tweets
  - Remoção de avatar
- [x] **Funcionalidades**
  - Armazenamento de token no AsyncStorage
  - Interceptador de requisições (Authorization header)
  - Sistema de likes/deslikes
  - Excluir próprios tweets
  - Interface moderna (tema escuro)
  - Permissões de galeria

## 🎯 Próximos Passos

- [ ] Upload de imagens nos tweets
- [ ] Notificações push
- [ ] Busca de usuários e tweets
- [ ] Comentários nos tweets
- [ ] Retweets
- [ ] Temas personalizáveis

## 🖼️ Sistema de Avatar

O projeto inclui um sistema completo de avatar:

### Backend
- **Upload seguro** com Multer (JPG, PNG, máx 5MB)
- **Armazenamento local** em `/uploads/avatars/`
- **Servir arquivos estáticos** via Express
- **Campo avatar_url** na tabela users
- **API endpoints** para upload e remoção

### Frontend
- **Seleção de imagem** com Expo Image Picker
- **Crop automático** em proporção 1:1
- **Exibição em múltiplos locais:**
  - Header (32x32px)
  - Sidebar (70x70px)
  - Perfil (80x80px)
  - Tweets no feed (44x44px)
- **Atualização em tempo real** via Context API
- **Fallback** para ícone padrão quando não há avatar

## 🐛 Troubleshooting

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute as migrations: `npm run migrate`

### Frontend não conecta à API
- Verifique se o backend está rodando na porta 3000
- Ajuste a baseURL no `api.ts` conforme seu ambiente
- Para Android, use `http://10.0.2.2:3000`

### Próximos passos
- Separar componentes e arquivos maiores(como tweetCard) em outros componentes melhores, para que o código fique mais organizado e facil de manter
- Implementar sistema de notificações
- Implementar sistema de retweets
- Implementar tema escuro e claro
- Implementar sistema de upload de imagens nos tweets
-----------------------------------------------------------------------------------------------------------------------------------------------
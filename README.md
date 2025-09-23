# Twitter Clone - Projeto Completo

Um clone do Twitter desenvolvido com **Node.js + Express + PostgreSQL** no backend e **React Native + Expo** no frontend.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** com **Knex.js**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- Estrutura **MVC** (Models, Views, Controllers)

### Frontend
- **React Native** com **Expo**
- **Redux Toolkit** para gerenciamento de estado
- **React Navigation** para navegação
- **AsyncStorage** para persistência local
- **Axios** para comunicação com API
- **React Hook Form** para formulários

## 📁 Estrutura do Projeto

```
AmigoTech/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middlewares/     # Middlewares (auth, validação)
│   │   ├── models/          # Models do banco
│   │   ├── routes/          # Definição das rotas
│   │   ├── migrations/      # Migrations do banco
│   │   └── config/          # Configurações
│   ├── server.js           # Servidor principal
│   └── knexfile.js         # Configuração do Knex
└── twitter-clone/          # App React Native
    ├── app/                # Telas (Expo Router)
    ├── src/
    │   ├── components/     # Componentes reutilizáveis
    │   ├── contexts/       # Context API
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
npm run dev
```

### 3. Frontend

```bash
cd twitter-clone

# Instalar dependências
npm install

# Iniciar Expo
npm start
```

## 🔧 Configuração da API

No arquivo `twitter-clone/src/services/api.ts`, ajuste a baseURL conforme seu ambiente:

- **Expo Go (web)**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Dispositivo físico**: `http://SEU_IP:3000`

## 📱 Funcionalidades Implementadas

### ✅ Backend (API)
- [x] **Autenticação**
  - POST `/auth/register` - Cadastro de usuário
  - POST `/auth/login` - Login de usuário
- [x] **Tweets**
  - POST `/tweets` - Criar tweet (autenticado)
  - GET `/tweets` - Feed geral
  - GET `/tweets/:userId` - Tweets de um usuário
- [x] **Likes**
  - POST `/tweets/:id/like` - Curtir tweet
  - DELETE `/tweets/:id/like` - Descurtir tweet
- [x] **Middlewares**
  - Autenticação JWT
  - Validação de dados
  - CORS habilitado

### ✅ Frontend (React Native)
- [x] **Navegação**
  - Stack Navigator configurado
  - Telas de Login/Register
  - Stack privada (Feed, Criar Tweet, Perfil)
- [x] **Estado Global**
  - Redux Toolkit configurado
  - AuthSlice (usuário e token)
  - TweetSlice (feed e tweets)
- [x] **Telas Principais**
  - Login/Registro com validação
  - Feed com FlatList e pull-to-refresh
  - Criar Tweet com contador de caracteres
  - Perfil de usuário
- [x] **Funcionalidades**
  - Armazenamento de token no AsyncStorage
  - Interceptador de requisições (Authorization header)
  - Sistema de likes/deslikes
  - Interface moderna (tema escuro)

## 🎯 Próximos Passos

- [ ] Implementar paginação no feed
- [ ] Adicionar upload de imagens
- [ ] Sistema de seguir/deixar de seguir
- [ ] Notificações push
- [ ] Busca de usuários e tweets
- [ ] Temas personalizáveis

## 🐛 Troubleshooting

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute as migrations: `npm run migrate`

### Frontend não conecta à API
- Verifique se o backend está rodando na porta 3000
- Ajuste a baseURL no `api.ts` conforme seu ambiente
- Para Android, use `http://10.0.2.2:3000`

### Erro de CORS
- Certifique-se que o CORS está habilitado no backend
- Verifique se a origem está permitida

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

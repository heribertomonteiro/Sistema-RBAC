# Sistema RBAC — Blog API (NestJS + Prisma)

API de estudo em **NestJS** com **autenticação JWT** e **autorização RBAC** (Role-Based Access Control), usando **Prisma** + **PostgreSQL**. O projeto simula um mini-blog com usuários, posts e um fluxo de moderação.

## Principais recursos

- Autenticação via **JWT**
- Autorização **RBAC** com `@Roles()` + `RolesGuard`
- Hierarquia de permissões: **Admin > Moderator > User**
- **Soft delete** de usuário via `isActive` (desativa acesso)
- Persistência com **Prisma ORM** + **migrations**
- Validação de DTOs com `class-validator`
- **Swagger** disponível em ambiente não-prod (rota `/docs`)

## Stack

- Node.js + TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Passport + JWT
- Argon2 (hash de senha) e compatibilidade com bcrypt para migração de hash (quando aplicável)

## Requisitos

- Node.js (recomendado: LTS)
- PostgreSQL rodando localmente ou em container

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sistema_rbac?schema=public"
PORT=3000
# Em produção o Swagger não sobe (ver src/main.ts)
NODE_ENV=development
```

> Observação: o projeto carrega variáveis com `dotenv/config`.

## Instalação

```bash
npm install
```

## Banco de dados (Prisma)

Aplicar migrations no banco:

```bash
npx prisma migrate dev
```

Opcional (útil para inspecionar dados):

```bash
npx prisma studio
```

## Executando o projeto

Modo desenvolvimento:

```bash
npm run start:dev
```

Build e produção:

```bash
npm run build
npm run start:prod
```

## Documentação (Swagger)

Com a aplicação rodando e **fora de produção** (`NODE_ENV` diferente de `production`), acesse:

- `http://localhost:3000/docs`

## RBAC (roles)

Roles disponíveis:

- `Admin`
- `Moderator`
- `User`

Hierarquia (roles efetivas):

- `Admin` inclui permissões de `Moderator` e `User`
- `Moderator` inclui permissões de `User`

## Rotas principais

### Auth

- `POST /auth/login` — retorna `access_token`

Exemplo de body:

```json
{ "email": "heriberto@example.com", "password": "minha-senha" }
```

### Users

- `GET /users/profile` — perfil do usuário autenticado (JWT)
- `POST /users` — (Admin) cria usuário
- `GET /users` — (Admin) lista usuários (safe)
- `GET /users/search?email=...` — (Admin) busca por email (safe)
- `PATCH /users/:id/roles` — (Admin) atualiza roles
- `PATCH /users/:id` — (Admin) desativa usuário (soft delete via `isActive=false`)

### Posts

- `GET /post` — lista posts publicados (público)
- `POST /post` — (User) cria post
- `GET /post/moderation` — (Moderator) lista todos para moderação
- `PATCH /post/:id` — (Moderator) edita título/conteúdo
- `PATCH /post/:id/publish` — (Moderator) publica
- `PATCH /post/:id/unpublish` — (Moderator) despublica
- `DELETE /post/:id` — (Moderator) remove

## Primeiro usuário Admin

O endpoint de criação de usuários (`POST /users`) é protegido para **Admin**. Para criar o primeiro Admin em ambiente de estudo, uma opção é inserir um registro diretamente no banco (ex.: via Prisma Studio) com `roles=["Admin"]` e `password` com hash Argon2.

## Testes e qualidade

Testes unitários:

```bash
npm test
```

Testes e2e:

```bash
npm run test:e2e
```

Lint/format:

```bash
npm run lint
npm run format
```

---

Projeto para fins de estudo e evolução contínua.

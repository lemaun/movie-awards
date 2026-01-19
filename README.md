# Golden Raspberry Awards API

API RESTful desenvolvida em Node.js/TypeScript para consulta de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards.

## 🎯 Sobre o Projeto

Esta API foi desenvolvida como teste técnico para vaga de **Especialista Node.js**, implementando:

- ✅ Leitura de arquivo CSV com lista de filmes indicados/vencedores
- ✅ Endpoint para obter produtor com maior e menor intervalo entre prêmios consecutivos
- ✅ API RESTful completa com CRUD de filmes
- ✅ Testes de integração automatizados
- ✅ Documentação interativa com Swagger

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** simplificada, organizado em camadas:

```
src/
├── domain/              # Entidades e contratos (regras de negócio)
│   ├── entities/
│   └── repositories/
├── application/         # Casos de uso (lógica de aplicação)
│   └── use-cases/
├── infrastructure/      # Implementações concretas
│   ├── database/        # SQLite
│   ├── csv/             # Loader do CSV
│   └── repositories/    # Repositórios
├── presentation/        # Camada HTTP (Controllers, Rotas)
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── validators/
└── shared/             # Utilitários compartilhados
    ├── errors/
    └── types/
```

### Decisões Técnicas

| Aspecto | Tecnologia | Justificativa |
|---------|-----------|---------------|
| **Runtime** | Node.js | Requisito do teste |
| **Linguagem** | TypeScript | Type safety, melhor DX |
| **Framework** | Fastify | Performance superior, TypeScript nativo |
| **Banco de Dados** | SQLite (better-sqlite3) | SGBD embarcado, sem instalação externa |
| **Validação** | Zod | Runtime validation com inferência de tipos |
| **Testes** | Vitest | Rápido, suporte nativo a ESM |
| **Documentação** | Swagger/OpenAPI | Documentação interativa automática |

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 18.x
- npm >= 9.x

### Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npm run dev

# 3. Acessar a API
# API: http://localhost:3000
# Docs: http://localhost:3000/docs
```

### Outros Comandos

```bash
# Build para produção
npm run build

# Executar build de produção
npm start

# Rodar testes
npm test

# Lint
npm run lint

# Formatar código
npm run format
```

## 📡 Endpoints da API

### Base URL
```
http://localhost:3000/api/movies
```

### Principais Endpoints

#### 1. **Intervalos de Produtores** (Requisito Principal)
```http
GET /api/movies/producer-intervals
```

Retorna o produtor com maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido.

**Resposta:**
```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

#### 2. **Listar Todos os Filmes**
```http
GET /api/movies
```

#### 3. **Listar Apenas Vencedores**
```http
GET /api/movies/winners
```

#### 4. **Buscar por Ano**
```http
GET /api/movies/year/:year

# Exemplo:
GET /api/movies/year/1990
```

#### 5. **Buscar por Produtor**
```http
GET /api/movies/producer?name=Joel

# Exemplo:
GET /api/movies/producer?name=Joel%20Silver
```

#### 6. **Health Check**
```http
GET /health
```

## 📚 Documentação Interativa

Acesse http://localhost:3000/docs para visualizar a documentação **Swagger UI** completa com:
- Schemas de request/response
- Validações
- Possibilidade de testar endpoints diretamente

## 🧪 Testes

### Executar Testes de Integração

```bash
npm test
```

### Cobertura dos Testes

Os testes validam:
- ✅ Carga correta dos dados do CSV
- ✅ Estrutura correta da resposta do endpoint de intervalos
- ✅ Lógica de cálculo de intervalos min/max
- ✅ Validação de parâmetros
- ✅ Filtros (winners, ano, produtor)

## 🗂️ Estrutura de Dados

### Entidade Movie

```typescript
interface Movie {
  id?: number;
  year: number;
  title: string;
  studios: string;
  producers: string;  // Múltiplos produtores separados por vírgula ou "and"
  winner: boolean;
}
```

### Banco de Dados

- **Arquivo**: `data/movies.db` (SQLite)
- **Tabela**: `movies`
- **Índices**: `year`, `winner` (para performance)
- **Inicialização**: Automática ao iniciar a aplicação
- **Carga de Dados**: CSV importado automaticamente na primeira execução

## 🎨 Algoritmo de Cálculo de Intervalos

O algoritmo implementado em `GetProducerIntervals`:

1. Busca todos os filmes vencedores
2. Agrupa vitórias por produtor (tratando múltiplos nomes)
3. Para cada produtor com duas ou mais vitórias:
   - Calcula intervalos entre prêmios consecutivos
4. Identifica o menor e o maior intervalo globalmente
5. Remove os registros de intevalos de vitórias iguais, para evitar repetição de produtores
6. Retorna todos os produtores, em ordem alfabética, que atingiram esses extremos

### Parse de Produtores

Produtores são separados por:
- Vírgula (`,`)
- ` and ` (case-insensitive)

**Exemplo:**
```
"Producer A, Producer B and Producer C"
→ ["Producer A", "Producer B", "Producer C"]
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/movies.db
MOVIELIST_PATH=./movielist.csv
```

## 📦 Build e Deployment

### Build para Produção

```bash
npm run build
```

Output: `dist/`

### Executar Produção

```bash
npm start
```

## 🛠️ Stack Completa

- **Node.js** + **TypeScript**
- **Fastify** - Web framework
- **SQLite** (better-sqlite3) - Database
- **Zod** - Schema validation
- **Vitest** - Testing framework
- **ESLint** + **Prettier** - Code quality
- **Swagger** - API documentation

## 📝 Requisitos Atendidos

- [x] **Requisito 1**: Ler arquivo CSV e inserir dados em banco (SQLite)
- [x] **Requisito 2**: Testes de integração garantindo funcionamento
- [x] **Requisito 3**: Endpoint retornando produtor com maior/menor intervalo
- [x] **Requisito 4 (Não-funcional 1)**: API RESTful nível 2 de maturidade
- [x] **Requisito 5 (Não-funcional 2)**: Testes de integração
- [x] **Requisito 6 (Não-funcional 3)**: Banco em memória (SQLite embarcado)
- [x] **Requisito 7 (Não-funcional 4)**: README com instruções
- [x] **Requisito 8 (Não-funcional 5)**: Código disponibilizado (Git)

## 🌟 Diferenciais Implementados

- ✨ Clean Architecture simplificada
- ✨ TypeScript em strict mode
- ✨ Documentação OpenAPI/Swagger interativa
- ✨ Validação robusta com Zod
- ✨ Error handling centralizado
- ✨ Código formatado e lintado
- ✨ Commits semânticos

## 📄 Licença

MIT

---

**Desenvolvido por Leandro Lago da Silva como teste técnico para vaga de Especialista Node.js**

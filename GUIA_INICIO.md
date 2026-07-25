# CareerHub — Guia de Início do Código

Este guia parte do que já está definido no seu Project Proposal, PRS e Interim Progress Report, e te leva do zero até um backend + frontend rodando com registro/login funcionando de ponta a ponta. O resto (Applications, Interviews, CVs, Dashboard) segue o mesmo padrão que você vai ver aqui.

## 0. O que já vem pronto neste scaffold

- `backend/`: projeto Spring Boot (Maven) com:
  - As 4 entidades JPA do PRS: `User`, `JobApplication`, `Interview`, `CvDocument`.
  - Migration Flyway (`V1__init_schema.sql`) criando as 4 tabelas com as FKs corretas.
  - Spring Security + JWT **funcionando de verdade** (não é só stub): `JwtService`, `JwtAuthFilter`, `CustomUserDetailsService`, `SecurityConfig`.
  - `AuthController` com `/api/auth/register` e `/api/auth/login` (Requisitos 1 e 2 do PRS).
  - Um teste unitário de exemplo (`AuthServiceTest`) usando JUnit + Mockito, igual ao que a especificação pede (mínimo 70% de cobertura).
- `frontend/`: projeto React (Vite) com:
  - `AuthContext` (guarda o token JWT e o usuário logado).
  - Páginas `Login`, `Register`, `Dashboard` (placeholder) já conectadas ao backend.
  - `ProtectedRoute` para rotas que exigem login.
  - Cliente axios que injeta o JWT automaticamente em toda requisição.
- `docker-compose.yml`: sobe um Postgres local em segundos.

Isso cobre a base dos Requisitos 1 e 2. Os Requisitos 3–6 (Applications, Interviews, CVs, Dashboard) ficam para você implementar seguindo o mesmo padrão — a seção 4 deste guia mostra exatamente como.

## 1. Rodando pela primeira vez

```bash
# 1. Suba o Postgres
cd careerhub-starter
docker compose up -d

# 2. Rode o backend (dentro de careerhub-starter/backend)
# Requer Java 17+ e Maven 3.9+ instalados.
# Dica: no IntelliJ, basta abrir a pasta backend/ como projeto Maven e rodar
# CareerhubApplication diretamente, sem precisar do terminal.
cd backend
mvn spring-boot:run

# 3. Em outro terminal, rode o frontend
cd ../frontend
npm install
npm run dev
```

Teste rápido do backend (antes mesmo do frontend), com curl:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Hugo Lomba","email":"hugo@example.com","password":"password123"}'
```

Se voltar um JSON com `token`, a autenticação está funcionando — o ponto que o Interim Report identificou como o mais difícil já está resolvido.

## 2. Ordem recomendada de implementação a partir daqui

Você já passou da Semana 5 do plano original (Fases 3–4 do Project Proposal), então o ideal agora é priorizar por dependência técnica, não pela ordem original do Gantt:

1. **Requirement 3 — Manage Job Applications** (CRUD). É o núcleo do sistema; Interviews, CVs e Dashboard dependem dela.
2. **Requirement 4 — Manage Interviews**, ligada a uma `JobApplication`.
3. **Requirement 6 — Analytics Dashboard**, porque nesse ponto você já tem dados reais (applications + interviews) para agregar.
4. **Requirement 5 — Upload CV Versions** (prioridade Média no PRS — pode vir depois do Dashboard sem prejuízo).
5. **Testes** (JUnit/Mockito) em paralelo a cada feature, não deixar para o final — mais fácil bater os 70% de cobertura assim.
6. **Docker + deploy** (Fase 6) só depois que as features estiverem estáveis.

## 3. Padrão a seguir (repita isso para cada feature)

Para cada requisito funcional, a estrutura é sempre: `Entity` (já existe) → `Repository` (já existe) → `DTO`s de request/response → `Service` (regra de negócio) → `Controller` (endpoints REST) → `Test` (Service com Mockito).

### Exemplo: próximo passo é o Requirement 3 (Applications)

Crie em `backend/src/main/java/com/careerhub/application/`:

- `dto/JobApplicationRequest.java` — campos: companyName, jobTitle, applicationDate, status, jobUrl, notes.
- `dto/JobApplicationResponse.java` — o que devolver ao frontend.
- `JobApplicationService.java` — métodos `create`, `findAllForUser`, `update`, `delete`, `filterByStatus`. Pegue o usuário logado assim:

```java
String email = SecurityContextHolder.getContext().getAuthentication().getName();
User user = userRepository.findByEmail(email).orElseThrow();
```

- `JobApplicationController.java` — endpoints REST:

```
GET    /api/applications              -> lista as applications do usuário logado
POST   /api/applications              -> cria
GET    /api/applications/{id}         -> detalhe
PUT    /api/applications/{id}         -> edita
DELETE /api/applications/{id}         -> remove
GET    /api/applications?status=X     -> filtro (Alternate flow A1 do UC-03)
```

Como o `SecurityConfig` já exige `.anyRequest().authenticated()` para tudo fora de `/api/auth/**`, esses endpoints já ficam protegidos por JWT automaticamente — nada extra a configurar.

Repita a mesma estrutura para `interview` (Requirement 4) e `cv` (Requirement 5, mas usando `MultipartFile` no controller para o upload). Para o Dashboard (Requirement 6), não precisa de entidade nova: é um `AnalyticsController` que consulta `JobApplicationRepository`/`InterviewRepository` e calcula as métricas (taxa de resposta, taxa de conversão em entrevista, etc.) em memória ou via query agregada.

## 4. No frontend

Depois de cada endpoint novo no backend, adicione a página React correspondente (elas já estão listadas na seção 4.1 GUI do PRS): `Applications List`, `Application Detail`, `Add/Edit Application`, `Interviews Page`, `CV Manager Page`. Todas devem usar `apiClient` (já configurado com o JWT) e ficar dentro de `<ProtectedRoute>` no `App.jsx`, do mesmo jeito que `Dashboard` já está.

## 5. Testes (Requisito de manutenibilidade — mínimo 70% cobertura)

Use `AuthServiceTest.java` como modelo: mocke os repositórios com `@Mock`, injete no service com `@InjectMocks`, e teste os fluxos principais e de exceção (equivalente aos "Exceptional flows" do PRS, ex: E1/E2 de cada Use Case). Rode:

```bash
cd backend
mvn test
mvn jacoco:report   # se adicionar o plugin JaCoCo ao pom.xml para medir cobertura
```

## 6. Antes da entrega final

- Docker: crie um `Dockerfile` para o backend (build multi-stage com Maven + JRE) e um para o frontend (build Vite + servir com Nginx), e adicione os dois ao `docker-compose.yml` já existente.
- Confirme os requisitos não-funcionais do PRS: HTTPS em produção, resposta de API < 500ms, tratamento de erros com status codes corretos (já coberto pelo `GlobalExceptionHandler`).
- Atualize o Trello/Gantt mencionado no Proposal para refletir o progresso real, já que o Interim Report ficou desatualizado em relação ao código.

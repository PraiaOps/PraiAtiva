# Escopo Técnico - PraiAtiva

## 1. Visão Geral do Projeto

### 1.1 Descrição
PraiAtiva é uma plataforma que conecta pessoas a atividades esportivas, lazer e serviços nas praias brasileiras. O sistema visa combater o sedentarismo oferecendo uma solução digital para descoberta, agendamento e participação em atividades físicas nas praias.

### 1.2 Objetivos Principais
- Conectar usuários a atividades esportivas nas praias
- Facilitar o agendamento e pagamento de aulas e eventos
- Oferecer sistema de delivery especializado (I-BULANTE)
- Prover informações em tempo real sobre condições das praias
- Criar comunidade ativa de praticantes de esportes

## 2. Arquitetura do Sistema

### 2.1 Visão Arquitetural
O projeto utiliza Arquitetura Hexagonal (Ports and Adapters) com preparação para microserviços graduais.

```
[Clients]     [Adapters]        [Core Domain]         [External]
   │             │                   │                    │
Web ────┐    ┌─► REST API       ┌─► Business Rules ◄──┐  │
        │    │                  │                     │  │
Mobile ─┼────┼─► GraphQL   ◄────┼─► Use Cases    ◄───┼──┤
        │    │                  │                     │  │
PWA ────┘    └─► WebSocket ◄────┘   Entities    ◄────┘  │
                                                        │
                                                    Services
```

### 2.2 Stack Tecnológica

#### Frontend
- **Framework Principal:** Next.js 14+
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Estado Global:** React Context + Hooks
- **Formulários:** React Hook Form
- **Validação:** Zod
- **Componentes UI:** Componentes próprios + HeadlessUI

#### Backend
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Mensageria:** Apache Kafka (futuro)
- **API:** REST + GraphQL + WebSockets

#### Mobile (Futuro)
- **Framework:** React Native
- **Navegação:** React Navigation
- **Estado:** React Context + Hooks
- **Maps:** React Native Maps

#### DevOps
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel (Frontend) / Railway (Backend)
- **Monitoramento:** Sentry
- **Logs:** DataDog
- **CDN:** Cloudflare

### 2.3 Estrutura de Diretórios
```
src/
├── core/                 # Domain Layer
│   ├── entities/
│   ├── use-cases/
│   └── ports/
├── adapters/            # Adapter Layer
│   ├── primary/         # Input adapters
│   │   ├── rest/
│   │   ├── graphql/
│   │   └── websocket/
│   └── secondary/       # Output adapters
│       ├── database/
│       ├── cache/
│       └── external/
├── infrastructure/      # Framework Layer
│   ├── config/
│   ├── database/
│   └── services/
└── presentation/        # UI Layer
    ├── web/
    ├── mobile/
    └── components/
```

## 3. Funcionalidades Principais

### 3.1 Sistema de Usuários
```typescript
enum UserRole {
  STUDENT = 'student',           // Aluno/Consumidor
  INSTRUCTOR = 'instructor',     // Professor/Instrutor
  VENDOR = 'vendor',            // Vendedor (I-BULANTE)
  BUSINESS = 'business',        // Estabelecimento/Escola
  ADMIN = 'admin',              // Administrador do Sistema
  SUPER_ADMIN = 'super_admin'   // Super Administrador
}
```

### 3.2 Módulos Principais

#### Autenticação e Autorização
- Login Social (Google, Facebook)
- JWT + Refresh Tokens
- Autenticação 2FA para perfis especiais
- Controle de permissões baseado em roles

#### Geolocalização
- Integração com Mapbox
- Tracking em tempo real
- Geocoding e reverse geocoding
- Cálculo de distâncias e rotas

#### Pagamentos
- Integração com Stripe
- Split de pagamentos
- Sistema de reembolso
- Carteira digital

#### Agendamentos
- Sistema de calendário
- Gestão de disponibilidade
- Confirmações automáticas
- Lembretes e notificações

#### I-BULANTE
- Sistema de pedidos
- Tracking de entregadores
- Pagamento in-app
- Avaliações e reviews

## 4. Integrações Externas

### 4.1 APIs e Serviços
- Previsão do tempo
- Condições do mar
- Qualidade da água
- Mapas e rotas
- Gateways de pagamento
- Provedores de email/SMS

### 4.2 Segurança
- SSL/TLS
- Rate Limiting
- CORS configurado
- Sanitização de inputs
- Proteção contra DDoS
- Criptografia de dados sensíveis

## 5. Escalabilidade e Performance

### 5.1 Estratégias de Cache
- Cache em múltiplas camadas
- Redis para dados em tempo real
- CDN para assets estáticos
- Cache de consultas frequentes

### 5.2 Otimizações
- Lazy loading de componentes
- Otimização de imagens
- Minificação de assets
- Code splitting
- Tree shaking

## 6. Monitoramento e Logs

### 6.1 Métricas
- Performance do sistema
- Uso de recursos
- Tempo de resposta
- Erros e exceções
- KPIs de negócio

### 6.2 Logs
- Logs estruturados
- Rastreamento de erros
- Auditoria de ações
- Monitoramento em tempo real

## 7. Roadmap Técnico

### Fase 1 - MVP Web (3-4 meses)
- Setup da infraestrutura básica
- Autenticação e perfis
- Geolocalização básica
- Cadastro de atividades
- Busca e filtros

### Fase 2 - Features Avançadas (2-3 meses)
- Sistema de pagamentos
- Agendamento/Calendário
- Integrações (clima, maré)
- Chat básico

### Fase 3 - Mobile Beta (3-4 meses)
- MVP Mobile com React Native
- Features básicas do web
- Notificações push
- Geolocalização em tempo real

### Fase 4 - Escalabilidade (2-3 meses)
- Otimizações de performance
- Melhorias de UX/UI
- Analytics e métricas
- Preparação para escala

## 8. Considerações de Desenvolvimento

### 8.1 Padrões de Código
- ESLint + Prettier
- Conventional Commits
- Code Review obrigatório
- Testes automatizados
- Documentação atualizada

### 8.2 Qualidade e Testes
- Testes unitários (Jest)
- Testes de integração
- Testes E2E (Cypress)
- Testes de performance
- Code coverage mínimo de 80%

### 8.3 CI/CD
- Build automatizado
- Testes automatizados
- Deploy automático
- Ambientes de staging
- Rollback automático

## 9. Requisitos de Sistema

### 9.1 Desenvolvimento
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Redis >= 6.x
- Git

### 9.2 Produção
- Servidor Linux
- 4GB RAM (mínimo)
- SSL certificado
- Backup automatizado
- Monitoramento 24/7

## 10. Documentação

### 10.1 Código
- JSDoc para funções
- README atualizado
- Documentação de API
- Guias de contribuição
- Changelog mantido

### 10.2 Arquitetura
- Diagramas atualizados
- Decisões documentadas
- Fluxos de dados
- Integrações
- Segurança

## 11. Contatos e Suporte

### 11.1 Time Técnico
- Tech Lead: [Nome]
- Frontend Lead: [Nome]
- Backend Lead: [Nome]
- DevOps: [Nome]

### 11.2 Canais
- Email: tech@praiativa.com.br
- Slack: #tech-team
- GitHub: github.com/praiativa
- Jira: praiativa.atlassian.net 
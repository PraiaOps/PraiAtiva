# PraiAtiva

Plataforma de atividades na praia.

## Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Chakra UI](https://chakra-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Requisitos

- Node.js 18.x ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/praiativa.git
cd praiativa
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PraiAtiva
NEXT_PUBLIC_APP_DESCRIPTION=Plataforma de atividades na praia
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts

- `npm run dev` ou `yarn dev`: Inicia o servidor de desenvolvimento
- `npm run build` ou `yarn build`: Cria a versão de produção
- `npm run start` ou `yarn start`: Inicia o servidor de produção
- `npm run lint` ou `yarn lint`: Executa o linter
- `npm run format` ou `yarn format`: Formata o código com Prettier

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── config/        # Configurações
  ├── contexts/      # Contextos React
  ├── hooks/         # Hooks personalizados
  ├── pages/         # Páginas Next.js
  ├── services/      # Serviços
  ├── styles/        # Estilos
  ├── types/         # Tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# Dashboard PraiAtiva - Melhorias de Interface

Este projeto implementa melhorias na interface do dashboard de usuários do PraiAtiva, focando em uma abordagem "mobile-first" para garantir uma excelente experiência em dispositivos móveis.

## Principais Alterações

### 1. Renomeação para "Meu Perfil"
- Alteramos o menu "Meu Dashboard" para "Meu Perfil" em todos os pontos da aplicação, tornando a navegação mais intuitiva e amigável para o usuário.

### 2. Menu Lateral Vertical Responsivo
- Implementamos um menu lateral vertical que se adapta perfeitamente a qualquer tamanho de tela
- O menu é recolhível em dispositivos móveis, proporcionando mais espaço para o conteúdo principal
- Categorização clara de funções por tipo de usuário (aluno, instrutor, admin)
- Navegação simplificada com ícones intuitivos

### 3. Layout Responsivo para Dashboard
- Cartões e elementos redimensionados para visualização ideal em telas pequenas
- Otimização da densidade de informações para evitar sobrecarga visual em dispositivos móveis
- Grid layout adaptativo que reorganiza elementos conforme o tamanho da tela

### 4. Melhorias na UX Mobile
- Botões maiores para facilitar interações por toque
- Espaçamento adequado entre elementos interativos
- Melhor organização visual da hierarquia de informações
- Feedback visual para interações (estados hover, active, etc.)

### 5. Performance
- Otimização de componentes para carregamento mais rápido em redes móveis
- Redução de renderizações desnecessárias

## Benefícios das Mudanças

1. **Experiência consistente em todos os dispositivos**: Os usuários têm a mesma qualidade de experiência independente do dispositivo utilizado.

2. **Priorização de informações**: O layout vertical permite uma organização mais lógica e hierárquica do conteúdo.

3. **Melhor navegação**: Menu lateral facilita a navegação entre diferentes seções, especialmente em celulares.

4. **Design mais moderno**: A interface atualizada transmite profissionalismo e modernidade.

5. **Redução de erros de UI**: Correção de problemas específicos que ocorriam na versão mobile da aplicação.

## Próximos Passos

- Realizar testes de usabilidade com usuários reais em dispositivos móveis
- Implementar melhorias adicionais de acessibilidade
- Otimizar ainda mais o desempenho em dispositivos com conexões limitadas 
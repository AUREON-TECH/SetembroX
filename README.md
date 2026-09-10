# EstéticaGYR V2 🌸

PWA mobile-first para ajudar cada pessoa a construir seu **Perfil Ideal** de autocuidado, estilo e bem-estar sem perseguir padrões externos.

## O que já existe

- Perfil Ideal personalizado por sensação desejada, prioridades, estilo, tempo e objetivo.
- Gigi, amiga virtual contextual que usa o perfil salvo no aparelho para responder de forma personalizada.
- Ritual diário adaptado às prioridades escolhidas.
- Checklist, sequência de autocuidado e métricas de conclusão.
- Check-in diário de bem-estar com linha do tempo e média de evolução.
- Dados locais/offline com `localStorage`.
- PWA instalável, service worker e atalhos para Gigi, Rotina e Evolução.
- Estrutura de banco segura em `supabase-schema.sql`, com RLS por usuário, pronta para um projeto Supabase dedicado.

## Privacidade

A V2 atualmente guarda perfil, conversas, rotina e check-ins **somente no dispositivo**. Nenhuma foto ou dado pessoal é enviado para servidor.

O arquivo `supabase-schema.sql` foi preparado para a futura versão com login e sincronização em nuvem. Não use o banco de outro produto em produção para isso; crie/conecte um projeto dedicado ao EstéticaGYR.

## Próxima camada

1. Supabase Auth (email/Google).
2. Sincronização segura dos dados do usuário.
3. Gigi com modelo de IA via Edge Function autenticada, sem expor chave secreta no navegador.
4. Fotos privadas de evolução via Storage com RLS.
5. Push notifications reais e agenda adaptativa.
6. Plano Free / GYR PRO.

## Publicação

O app é estático e compatível com GitHub Pages. O arquivo principal é `index.html` e o `manifest.json` usa escopo relativo para funcionar dentro do caminho `/Esteticagyr/`.

> O EstéticaGYR oferece organização de autocuidado e estilo. Não realiza diagnóstico médico e não substitui profissionais de saúde qualificados.
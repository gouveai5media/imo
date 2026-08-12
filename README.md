# IMO — Imóvel em Ordem

MVP navegável da nova plataforma **Imóvel em Ordem**, criado para modernizar o sistema legado e validar a nova experiência antes da integração com o banco atual.

## Acessos de demonstração

Todos usam a senha `123456`.

- `admin` — Super Admin
- `incorporadora` — Incorporadora
- `sindico` — Síndico
- `morador` — Morador / Proprietário

## O que já está nesta versão

- Login demonstrativo por perfil
- Dashboards específicos por tipo de usuário
- Tema Clean e Dark com preferência persistida
- Layout responsivo para desktop e mobile
- Super Admin, Incorporadora, Síndico e Morador
- Empreendimentos e incorporadoras
- Moradores e unidades
- Manuais protegidos
- Garantias e alertas de vigência
- Assistência técnica / chamados
- Plano de manutenção
- Reservas de espaços
- Quadro de avisos
- Planos de reforma
- Documentos, plantas e Databook
- Vídeos de uso e operação

## Próximas etapas

1. Refinar identidade visual com os arquivos oficiais da IMO.
2. Conectar Supabase Auth e PostgreSQL.
3. Estruturar multi-tenant: incorporadora → empreendimento → bloco → unidade.
4. Criar regras reais de permissões por perfil.
5. Migrar/mapeiar dados do sistema PHP/MySQL atual.
6. Implantar ambiente de homologação e depois produção.

> Esta versão utiliza dados fictícios para demonstração e não deve armazenar credenciais ou informações reais de clientes.
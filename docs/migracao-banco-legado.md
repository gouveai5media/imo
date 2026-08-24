# IMO — Mapa oficial do banco legado e estratégia de migração

Snapshot analisado: `u612612193_imo.20260823120653.sql.gz` (23/08/2026)

> Este documento é a referência técnica inicial para migrar o sistema antigo da IMO para o sistema novo. O banco legado continua sendo a fonte da verdade até o corte final. Nenhuma etapa de desenvolvimento deve sobrescrever ou alterar a produção antiga.

## Princípios da migração

1. Preservar sempre o `legacy_id` de cada registro importado.
2. A migração precisa ser idempotente: poder rodar novamente sem duplicar dados.
3. Validar contagens antes/depois por módulo.
4. Normalizar charset para UTF-8/utf8mb4.
5. Não importar cegamente estruturas serializadas do PHP; transformar em relações explícitas.
6. Arquivos físicos precisam ser migrados junto com os registros do banco.
7. Usuários e senhas exigem tratamento separado e auditoria de logins duplicados.
8. O banco legado não possui FKs declaradas; os vínculos serão reconstruídos e validados no migrador.

## Mapa principal

| Domínio novo | Tabela legado | Registros | Destino sugerido | Observações |
|---|---|---:|---|---|
| Condomínios | `phpwcms_condominios` | 133 | `condominiums` | Fonte principal do cadastro do empreendimento. |
| Unidades | `phpwcms_apartamentos` | 6.552 | `units` | Número, bloco, tipo, usuário, condomínio, fase e arquivos por unidade. |
| Usuários/perfis | `phpwcms_userdetail` | 6.553 | `users` + `profiles` | Login, e-mail, hash legado, dados pessoais e último acesso. |
| Reservas | `phpwcms_agendamentos` | 51 | `reservations` | Vínculo com usuário, unidade, condomínio e espaço. |
| Espaços | `phpwcms_espacos` | 17 | `common_areas` | Regras de taxa, cancelamento, prazo e horários. |
| Chamados | `phpwcms_solicitacoes_assistencia` | 1.633 | `support_tickets` | Histórico completo de assistência. |
| Agenda de assistência | `phpwcms_agendamentos_assistencia` | 119 | `support_appointments` | Opções de data, selecionada, justificativa e status. |
| Anexos de assistência | `phpwcms_arquivos_assistencia` | 1.312 | `support_attachments` | Arquivos físicos precisam ser localizados na hospedagem. |
| Respostas | `phpwcms_respostas` | 744 | `ticket_messages` | Respostas vinculadas por `resposta_rel`. |
| Conversas | `phpwcms_conversas` | 20 | `conversations` | Verificar uso atual antes de migrar. |
| Arquivos | `phpwcms_arquivos` | 3.601 | `documents` / `document_files` | Nome, título, extensão, relação, tipo e status. |
| Manuais | `phpwcms_manuais` | 244 | `manuals` | Possui `manual_permissoes`; não importar permissão como texto serializado. |
| Pastas | `phpwcms_pastas` | 138 | `document_folders` | Estrutura de organização por condomínio e tipo. |
| Protocolos/arquivos | `phpwcms_protocolos` | 700 | `document_protocols` | Confirmar função no código legado antes do corte. |
| Status/leitura | `phpwcms_status` | 2.758 | `document_access` / `document_status` | Tem `status_leitura`, pasta, cliente e tipo. Importante para PDFs. |
| Reformas | `phpwcms_reformas` | 362 | `renovations` | Escopo, cronograma, conclusão, profissionais, responsável e status. |
| Comentários de reformas | `phpwcms_reformas_comentarios` | 27 | `renovation_messages` | Histórico da reforma. |
| Avisos | `phpwcms_avisos` | 3.796 | `announcements` / `notifications` | Verificar diferença para quadro de avisos. |
| Quadro de avisos | `phpwcms_quadro_avisos` | 44 | `notice_board` | Conteúdo editorial/destaque. |
| Histórico de acessos | `phpwcms_historico_acessos` | 7.807 | `audit_logs` | Preservar antes/depois quando houver. |

## Manutenções

A manutenção é um domínio próprio e deve ser preservada, não reconstruída manualmente.

| Tabela legado | Registros | Destino sugerido | Papel |
|---|---:|---|---|
| `phpwcms_manutencoes_base` | 287 | `maintenance_templates` | Base pré-definida de rotinas. |
| `phpwcms_manutencoes_condominios` | 12.734 | `maintenance_tasks` | Rotinas aplicadas ao condomínio. |
| `phpwcms_manutencoes_apartamentos` | 7.636 | `unit_maintenance_tasks` | Rotinas ligadas a apartamentos/unidades específicas. |
| `phpwcms_manutencoes_unidades` | 4.730 | `unit_type_maintenance_tasks` | Rotinas por tipo de unidade. |
| `phpwcms_registros` | 606 | `maintenance_records` | Registros de realização, custo, responsável e comprovantes. |
| `phpwcms_registros_unidades` | 34 | `unit_maintenance_records` | Realizações por unidade. |
| `phpwcms_nao_realizados` | 511.883 | `maintenance_non_compliance` | Histórico volumoso de não realizados. |
| `phpwcms_nao_realizados_unidades` | 297.440 | `unit_maintenance_non_compliance` | Histórico volumoso por unidade. |
| `phpwcms_lista_sistemas` | 54 | `maintenance_systems` | Catálogo de sistemas. |
| `phpwcms_lista_subsistemas` | 81 | `maintenance_subsystems` | Catálogo de subsistemas. |
| `phpwcms_lista_responsaveis` | 6 | `maintenance_responsibility_types` | Catálogo de responsáveis. |

### Regra confirmada do cadastro

No sistema novo, as rotinas de manutenção já existem como base e são selecionadas/aplicadas conforme o empreendimento. O cadastro do condomínio não deve criar manutenção do zero quando já houver um template equivalente.

## Cadastro de condomínio — campos legados importantes

A tabela `phpwcms_condominios` possui, entre outros:

- `condominio_id`
- `condominio_data`
- `condominio_codigo`
- `condominio_referencia`
- `condominio_nome`
- `condominio_cnpj`
- `condominio_assistencia`
- `condominio_contato`
- `condominio_telefone`
- `condominio_vencimento`
- `condominio_habitese`
- endereço completo
- `condominio_blocos`
- `condominio_sindico`
- `condominio_incorporadora`
- `condominio_acessos`
- `condominio_modulos`
- `condominio_manutencoes`
- `condominio_manutencoes_unidades`
- `condominio_lembrete`
- limites de armazenamento
- `condominio_norma`
- `condominio_status`

### Campos novos do sistema novo

- Construtora: não existe no legado e será complementada posteriormente.
- Prazo contratual 2/5/10/15 anos: regra nova; `condominio_vencimento` continua sendo a fonte da data limite migrada.
- Dados do síndico e incorporadora serão normalizados em entidades próprias e relacionados ao condomínio.

## Módulos encontrados no legado

`condominio_modulos` contém estrutura serializada do PHP. O migrador deve converter os códigos para uma tabela de relacionamento `condominium_modules`.

Mapeamento conhecido:

- `furacao` → Plantas de Furação
- `dwg` → Plantas de Furação (DWG)
- `maleta` → Databook
- `maletauser` → Databook (usuários)
- `videos` → Vídeos
- `assistencia` → Assistência Técnica
- `planos` → Planos de Reforma
- `manutencao` → Planos de Manutenção
- `unidades` → Manutenção de Unidades
- `garantias` → Gestão das Garantias
- `agendamento` → Agendamento de Espaços
- `chamados` → Livro/Chamados
- `avisos` → Quadro de Avisos

No cadastro de um novo condomínio, DWG, Databook (usuários) e Manutenção de Unidades começam desmarcados e são habilitados somente se contratados.

## Documentos e PDFs — regras já confirmadas

Esta seção ainda será refinada com o cliente, mas estas regras já estão definidas:

- Manual do Proprietário é diferente do Manual do Síndico.
- Proprietário não visualiza Manual do Síndico nem documentos de áreas que não pertencem ao seu perfil/unidade.
- Plantas de furação são vinculadas por tipo de unidade.
- Síndico pode acessar documentos administrativos, áreas comuns e outros materiais permitidos ao condomínio.
- Incorporadora possui visão ampla dos documentos dos empreendimentos vinculados.
- Arquivo marcado como `Somente leitura` deve abrir em visualizador estilo revista, sem botão de download/cópia na interface.
- A permissão real deve ser aplicada no backend; esconder botão no frontend não é mecanismo de segurança suficiente.
- `phpwcms_manuais.manual_permissoes` e `phpwcms_status.status_leitura` precisam ser estudados antes de fechar o modelo final.

## Usuários e autenticação — atenção crítica

- `phpwcms_userdetail` contém 6.553 registros.
- O campo legado de senha é `detail_password`.
- A grande maioria dos valores observados possui formato de 32 caracteres hexadecimais, compatível com MD5, mas o algoritmo deve ser confirmado no código de autenticação antes da migração final.
- Há logins repetidos no banco legado; a migração de autenticação precisa deduplicar identidade sem perder os vínculos com várias unidades/condomínios.
- Não alterar as senhas do banco antigo.
- Estratégia preferida, se tecnicamente viável: autenticar o hash legado no primeiro login e re-hashar para padrão moderno no novo sistema.

## Charset

O dump mistura latin1, utf8mb3 e utf8mb4. Todo texto migrado deve ser normalizado e validado em UTF-8/utf8mb4, com testes específicos para `ç`, `ã`, `é`, nomes próprios, endereços e textos de chamados.

## Arquivos físicos

O dump SQL não substitui o backup da pasta de arquivos. Antes do corte final é obrigatório:

1. inventariar `filearchive`, `upload`, imagens e demais pastas usadas pelo sistema;
2. relacionar caminho físico ↔ registro do banco;
3. calcular checksum dos arquivos migrados;
4. validar arquivos órfãos e registros sem arquivo físico;
5. preservar cópia somente-leitura do legado.

## Ordem recomendada de implementação da migração

1. `condominiums`
2. incorporadoras / síndicos
3. unidades / blocos / tipos
4. usuários / perfis / vínculos de unidade
5. módulos do condomínio
6. documentos / pastas / manuais / permissões
7. assistência técnica / mensagens / anexos
8. espaços / reservas
9. reformas
10. garantias
11. manutenção (templates → tarefas → registros → não realizados)
12. avisos / ocorrências
13. histórico/auditoria
14. arquivos físicos
15. autenticação e corte final

## Validação obrigatória

Cada importador deverá gerar relatório contendo:

- quantidade origem;
- quantidade importada;
- quantidade ignorada;
- quantidade com erro;
- IDs legados afetados;
- relações órfãs;
- duplicidades encontradas;
- checksum/validação de arquivos quando aplicável.

## Próximo trabalho técnico

1. Criar o schema normalizado do sistema novo.
2. Criar tabela `migration_legacy_map` para rastrear `legacy_table`, `legacy_id`, `new_table`, `new_id` e status da migração.
3. Escrever importadores por domínio, começando por Condomínios → Unidades → Usuários.
4. Criar relatório automático de auditoria do dump antes de cada migração de teste.
5. Fazer a primeira migração em ambiente de homologação, nunca diretamente sobre produção.

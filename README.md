# GoalMat

## Requisitos funcionais
- [ ] Deve ser possível se registrar
- [ ] Deve ser possível se autenticar
- [ ] Deve ser possível editar o nome, foto e senha do usuário
- [ ] Deve ser possível cadastrar uma meta
- [ ] Deve ser possível editar uma meta
- [ ] Deve ser possível excluir uma meta
- [ ] Deve ser possível completar uma meta
- [ ] Deve ser possível desfazer a conclusão de uma meta
- [ ] Deve ser possível visualizar as metas e o resumo da semana atual
- [ ] Deve ser possível visualizar as metas e o resumo da semana anterior
- [ ] Deve ser possível visualizar uma dashboard com informações de tarefas completadas na semana, tarefas adicionadas desde a semana anterior, gráfico em barras mostrando as                                                                      últimas 4 semanas e as 3 metas com maior frequência de conclusão semanal esperada
- [ ] Deve ser possível criar um grupo
- [ ] Deve ser possível editar as informações do grupo
- [ ] Deve ser possível excluir um grupo
- [ ] Deve ser possível entrar em um grupo pelo código de convite
- [ ] Deve ser possível gerar outro código de convite para o grupo
- [ ] Deve ser possível sair do grupo
- [ ] Deve ser possível expulsar um membro do grupo
- [ ] Deve ser possível criar / editar / excluir metas do grupo
- [ ] Deve ser possível completar / desfazer a conclusão de uma meta do grupo
- [ ] Deve ser possível visualizar uma gameficação com pontos de conclusão de tarefas entre os membros do grupo
- [ ] Deve ser possível visualizar o resumo da semana atual do grupo
- [ ] Deve ser possível assinar o plano "Plus"

## Regras de negócio
- [ ] Um grupo só pode ser criado por um usuário Plus
- [ ] Um usuário free só pode fazer parte de um grupo por vez
- [ ] Apenas o dono do grupo pode editar as informações do grupo
- [ ] Apenas o dono do grupo pode exclui-lo
- [ ] Apenas o dono do grupo pode criar / editar / excluir metas do grupo
- [ ] Apenas o dono do grupo pode expulsar um membro
- [ ] Apenas o dono do grupo pode gerar outro código de convite
- [ ] A dashboard só pode ser visualizada por um usuário Plus

## Requisitos não funcionais
- [ ] A API deve ser feita com Fastify
- [ ] Deve ser gerado um JWT para autenticação do usuário
- [ ] Deve ser utilizado o Stripe como forma de pagamento para assinatura Plus
- [ ] As imagens de perfil do usuário e foto do grupo devem ser armazenadas no R2 da Cloudflare
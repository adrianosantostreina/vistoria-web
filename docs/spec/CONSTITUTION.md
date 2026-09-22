# Constitution — Sistema de Vistorias

Regras inquebraveis do projeto. Cada uma tem codigo estavel, citavel em
commits, revisoes e regras do harness.

## Arquitetura (AR)

AR-01  Regra de negocio mora em `services/`, nunca em componente ou tela.

AR-02  Componentes nao chamam API diretamente. Dados entram por props ou por
       hook de `features/`.

AR-03  Web e app nunca duplicam regra de negocio. O que vale nos dois vive no
       pacote compartilhado.

AR-04  Datas trafegam como string ISO em UTC. O app em campo roda em fusos
       diferentes e `Date` serializa com o fuso local, causando divergencia de
       um dia na sincronizacao.

## Qualidade (QC)

QC-01  Toda feature tem teste antes de ser considerada pronta.

QC-02  Nenhuma funcao ultrapassa 40 linhas sem justificativa registrada.

## Dominio (DM)

DM-01  Vistoria finalizada e imutavel. Nenhuma operacao altera vistoria com
       status 'finalizada'.

DM-02  Item obrigatorio sem foto impede a finalizacao. Validar antes de
       permitir a acao, nao depois.

DM-03  Data de conclusao e sempre a do dispositivo em campo. O vistoriador
       pode ficar horas sem sinal; a data do servidor registraria o momento
       do sync, nao o do trabalho.

<h1 align="center">💊 Projeto Salus 💊</h1>

<p align="center">O <strong>MedSalus</strong> é um projeto desenvolvido por estudantes do 4º semestre de Desenvolvimento de Software Multiplataforma (DSM) da <strong>FATEC Jacareí</strong>, com o objetivo de criar soluções tecnológicas que promovam qualidade de vida, autonomia e segurança para pacientes que necessitam de acompanhamento contínuo na administração de medicamentos. Inspirados pelos desafios do envelhecimento populacional e pelo potencial transformador da Internet das Coisas (IoT), nossa equipe une conhecimentos em desenvolvimento de software, hardware embarcado, cloud computing e design de experiência do usuário para construir um sistema integrado que faz a diferença na vida real das pessoas.</p>

<h2 align="center">📌 Sobre o Projeto</h2>

# 🏥 MedDisk  – Sistema Inteligente de Gerenciamento e Dispensação de Medicamentos com Integração IoT e Aplicativo Móvel

O **MMdeDisk** é uma solução completa composta por:

- 📦 **Dispositivo físico IoT**: Caixa organizadora com múltiplos compartimentos inteligentes, sensores de abertura, atuadores de travamento e alerta sonoro;
- ☁️ **Backend em nuvem**: API REST desenvolvida em **Node.js + TypeScript + Express** para gerenciamento de dados, sincronização e lógica de negócio;
- 📱 **Aplicativo móvel**: Interface intuitiva para pacientes e responsáveis acompanharem a medicação, receberem notificações e visualizarem históricos.

> **Objetivo principal**: Reduzir erros na administração de medicamentos, promover adesão ao tratamento e oferecer tranquilidade para familiares e cuidadores por meio de monitoramento remoto e alertas inteligentes.

**Instituição**: Faculdade de Tecnologia Professor Francisco de Moura – FATEC Jacareí  
**Curso**: 4º DSM – Desenvolvimento de Software Multiplataforma  
**Parceiro**: Prof. Leandro Toss Hoffmann  
**Focal Point**: Prof. Neymar Siqueira Dellareti  
**Kick-off**: 25/03/2026

---

<h2>🗓️ Sprints</h2>

| Sprints | Início | Fim | Relatório |
|---------|--------|-----|-----------|
| 1ª sprint | 13/04/2026 | 30/04/2026 | <a href="#">Em breve</a> |
| 2ª sprint | 04/05/2026 | 21/05/2026 | <a href="#">Em breve</a> |
| 3ª sprint | 25/05/2026 | 11/06/2026 | <a href="#">Em breve</a> |

> 🎯 **Apresentação Final**: Semana de 22/07/2026 (data a definir)

---

<h2>📋 Product Backlog</h2>

| ID | Requisito | Descrição | Prioridade | User Story | Critérios de Aceitação (DoD) | Definição de Pronto (DoR) |
|----|-----------|-----------|------------|------------|-----------------------------|---------------------------|
| **RF01** | Cadastro e Configuração de Medicamentos | Permitir cadastro de medicamentos com nome, dosagem, horários e compartimento associado. | Alta | Como cuidador, quero cadastrar os medicamentos do paciente para que o sistema organize a dispensação automática. | ✅ Formulário de cadastro funcional.<br>✅ Validação de campos obrigatórios.<br>✅ Associação correta ao compartimento físico. | 🔹 Modelo de dados definido.<br>🔹 API de cadastro implementada e testada. |
| **RF02** | Programação de Horários | Definir múltiplos horários por medicamento, com frequência e intervalos específicos. | Alta | Como usuário, quero programar os horários de cada remédio para garantir a administração no momento certo. | ✅ Interface de agendamento intuitiva.<br>✅ Suporte a repetição diária/semanal.<br>✅ Sincronização com dispositivo IoT. | 🔹 Lógica de agendamento validada.<br>🔹 Integração com backend concluída. |
| **RF03** | Controle de Compartimentos (IoT) | Dispositivo libera apenas o compartimento correspondente ao horário programado. | Alta | Como paciente, quero que apenas o remédio do momento seja liberado para evitar confusão. | ✅ Servo motor atua apenas no compartimento correto.<br>✅ Leitura de sensor confirma abertura.<br>✅ Feedback visual/sonoro no dispositivo. | 🔹 Firmware do IoT desenvolvido.<br>🔹 Comunicação com backend estabelecida. |
| **RF04** | Bloqueio de Compartimentos Indevidos | Compartimentos não programados permanecem travados. | Alta | Como responsável, quero garantir que o paciente não acesse medicamentos fora do horário. | ✅ Travamento mecânico/eletrônico funcional.<br>✅ Tentativas de acesso indevido registradas.<br>✅ Estado dos compartimentos sincronizado com app. | 🔹 Mecanismo de bloqueio testado.<br>🔹 Regras de acesso implementadas no firmware. |
| **RF05** | Emissão de Alerta Sonoro | Dispositivo emite alerta sonoro no horário da medicação. | Alta | Como usuário com dificuldade visual, quero ser alertado por som quando for hora de tomar o remédio. | ✅ Buzzer/alto-falante acionado no horário exato.<br>✅ Volume ajustável.<br>✅ Alerta registrado no histórico. | 🔹 Componente de áudio integrado.<br>🔹 Testes de timing validados. |
| **RF06** | Registro de Retirada de Medicamento | Sistema registra quando o compartimento foi aberto e o medicamento retirado. | Alta | Como cuidador, quero saber se o paciente retirou o medicamento no horário correto. | ✅ Sensor de abertura detecta ação.<br>✅ Timestamp registrado no backend.<br>✅ Histórico atualizado no app móvel. | 🔹 Sensor calibrado e testado.<br>🔹 Endpoint de registro funcional. |
| **RF07** | Monitoramento de Atraso na Administração | Monitora se o medicamento foi retirado dentro de intervalo configurável após o alerta. | Alta | Como responsável, quero ser avisado se o paciente esquecer de tomar o remédio no tempo esperado. | ✅ Timer configurável por medicamento.<br>✅ Detecção de não-retirada aciona fluxo de notificação.<br>✅ Logs de eventos armazenados. | 🔹 Lógica de monitoramento implementada.<br>🔹 Configuração de tempo exposta na API. |
| **RF08** | Notificação ao Responsável | Envia notificação push/app ao responsável caso o medicamento não seja retirado a tempo. | Alta | Como familiar, quero receber um alerta no celular se o paciente não tomar o remédio no horário. | ✅ Notificação enviada via Firebase/APNs.<br>✅ Mensagem clara com nome do medicamento e horário.<br>✅ Confirmação de entrega registrada. | 🔹 Serviço de notificação configurado.<br>🔹 Cadastro de responsáveis funcional. |
| **RF09** | Aplicativo Móvel para Monitoramento | App permite visualizar programação, histórico e receber notificações. | Alta | Como usuário, quero acompanhar toda a rotina de medicação pelo meu celular de forma simples. | ✅ Telas de dashboard, histórico e configurações.<br>✅ Notificações em tempo real.<br>✅ Interface acessível para idosos. | 🔹 Protótipo validado com usuários.<br>🔹 Integração com API concluída. |
| **RF10** | Integração com Servidor em Nuvem | Dispositivo IoT comunica-se com backend para envio/recebimento de programações e eventos. | Alta | Como sistema, quero que todos os componentes troquem dados de forma confiável e segura. | ✅ Protocolo MQTT/HTTPS implementado.<br>✅ Payloads validados e criptografados.<br>✅ Reconexão automática em falhas de rede. | 🔹 Endpoint de comunicação IoT documentado.<br>🔹 Testes de integração realizados. |
| **RF11** | Sincronização de Dados | Garantir consistência entre dispositivo, servidor e app móvel. | Alta | Como administrador, quero que uma alteração no app seja refletida imediatamente no dispositivo. | ✅ Atualizações propagadas em tempo real.<br>✅ Conflitos de sincronia tratados.<br>✅ Estado final consistente em todos os clientes. | 🔹 Estratégia de sync definida (websockets/polling).<br>🔹 Testes de concorrência executados. |
| **RF12** | Cadastro de Responsáveis | Permitir cadastro de um ou mais responsáveis para receber notificações. | Média | Como paciente, quero adicionar meus filhos como responsáveis para que todos acompanhem minha medicação. | ✅ Múltiplos usuários vinculados a um dispositivo.<br>✅ Permissões de acesso configuráveis.<br>✅ Convite por e-mail/QR Code. | 🔹 Modelo de relacionamento definido.<br>🔹 Fluxo de onboarding testado. |
| **RNF01** | Arquitetura da Solução | Sistema composto por IoT, Backend Node.js/TS, API REST e App Móvel. | Alta | Como desenvolvedor, quero uma arquitetura modular que facilite manutenção e evolução. | ✅ Diagrama de componentes documentado.<br>✅ Separação clara de responsabilidades.<br>✅ Comunicação entre camadas padronizada. | 🔹 Repositórios organizados.<br>🔹 Documentação de arquitetura aprovada. |
| **RNF02** | Segurança da Informação | Autenticação, proteção de dados sensíveis e comunicação segura (HTTPS/MQTTs). | Alta | Como usuário, quero que meus dados de saúde estejam protegidos contra acessos não autorizados. | ✅ JWT/OAuth para autenticação.<br>✅ Dados sensíveis criptografados em repouso e trânsito.<br>✅ Headers de segurança configurados. | 🔹 Pentest básico realizado.<br>🔹 Políticas de segurança documentadas. |
| **RNF03** | Confiabilidade do Sistema | Funcionamento contínuo mesmo com falhas temporárias de conexão. | Alta | Como paciente em área com internet instável, quero que o dispositivo funcione offline e sincronize depois. | ✅ Cache local no dispositivo.<br>✅ Mecanismo de retry com backoff.<br>✅ Filas de eventos pendentes. | 🔹 Testes de resiliência executados.<br>🔹 Estratégia de offline-first implementada. |
| **RNF04** | Usabilidade | Interface simples, intuitiva e acessível, especialmente para público idoso. | Alta | Como idoso com pouca familiaridade tecnológica, quero usar o app sem dificuldade. | ✅ Contraste adequado, fontes grandes, navegação linear.<br>✅ Testes com usuários reais.<br>✅ Feedbacks incorporados nas iterações. | 🔹 Guia de acessibilidade seguido.<br>🔹 Protótipo validado com público-alvo. |
| **RNF05** | Manutenibilidade | Código modular, bem estruturado e com separação de responsabilidades. | Média | Como desenvolvedor, quero entender e modificar o código rapidamente sem quebrar funcionalidades. | ✅ Padrões de código (ESLint/Prettier).<br>✅ Documentação de funções e módulos.<br>✅ Baixo acoplamento entre componentes. | 🔹 Revisões de código realizadas.<br>🔹 Métricas de qualidade (SonarQube) monitoradas. |
| **RNF06** | Persistência de Dados | Dados armazenados em banco de dados em nuvem com backup e escalabilidade. | Alta | Como administrador, quero que os históricos de medicação estejam seguros e disponíveis para auditoria. | ✅ Banco escolhido (PostgreSQL/MongoDB).<br>✅ Migrações versionadas.<br>✅ Backup automático configurado. | 🔹 Schema definido e documentado.<br>🔹 Scripts de deploy do DB testados. |
| **RNF07** | Eficiência Energética (IoT) | Dispositivo projetado para consumo eficiente, garantindo operação contínua. | Média | Como usuário, quero que a caixa de remédios funcione por dias sem precisar de recarga constante. | ✅ Modo sleep entre eventos.<br>✅ Componentes de baixo consumo selecionados.<br>✅ Monitoramento de bateria no app. | 🔹 Perfil de consumo medido.<br>🔹 Estratégia de energia documentada. |
| **RNF08** | Integração Contínua (CI) | Pipeline executa build, testes e lint a cada commit. | Alta | Como equipe, quero detectar erros cedo e manter a qualidade do código automaticamente. | ✅ GitHub Actions/GitLab CI configurado.<br>✅ Testes unitários e de integração rodando.<br>✅ Relatórios de cobertura gerados. | 🔹 Arquivo de pipeline versionado.<br>🔹 Status do CI visível no PR. |
| **RNF09** | Entrega Contínua (CD) | Deploy automatizado em ambiente de homologação/produção após aprovação. | Alta | Como DevOps, quero liberar novas versões rapidamente e com segurança. | ✅ Deploy em staging automático.<br>✅ Aprovação manual para produção.<br>✅ Rollback em caso de falha. | 🔹 Ambiente de cloud configurado (AWS/Azure/GCP).<br>🔹 Scripts de deploy testados. |
| **RNF10** | Automação de Testes | Testes unitários e de integração executados no pipeline. | Alta | Como QA, quero garantir que novas funcionalidades não quebrem o que já funciona. | ✅ Cobertura mínima de 80%.<br>✅ Mocks para serviços externos.<br>✅ Testes de API com Supertest/Jest. | 🔹 Suite de testes organizada.<br>🔹 Relatórios de falhas claros. |
| **RNF11** | Controle de Versionamento | Git com branches organizadas, commits descritivos e estratégia definida (ex: Git Flow). | Média | Como desenvolvedor, quero colaborar sem conflitos e rastrear mudanças facilmente. | ✅ Branches main/develop/feature.<br>✅ Commits com conventional commits.<br>✅ PRs com revisão obrigatória. | 🔹 .gitignore configurado.<br>🔹 Guia de contribuição no README. |
| **RNF12** | Monitoramento de Build e Deploy | Pipeline fornece feedback claro sobre falhas e sucessos. | Média | Como tech lead, quero saber rapidamente se uma alteração quebrou o build ou os testes. | ✅ Notificações no Slack/Teams.<br>✅ Badges de status no README.<br>✅ Logs detalhados acessíveis. | 🔹 Integração com ferramentas de monitoramento.<br>🔹 Dashboard de CI/CD visível. |
| **RP01** | Tecnologias Obrigatórias (Backend) | Backend em Node.js + Express + TypeScript. | Alta | Como equipe técnica, quero padronizar a stack para facilitar onboarding e manutenção. | ✅ Projeto inicializado com TS.<br>✅ Express configurado com rotas modulares.<br>✅ Tipagem rigorosa em todos os módulos. | 🔹 Boilerplate aprovado.<br>🔹 Linter e formatter configurados. |
| **RP02** | Integração com Dispositivo IoT | Projeto deve contemplar integração com dispositivo físico (sensores, atuadores, servo motores, buzzer). | Alta | Como desenvolvedor IoT, quero simular ou conectar hardware real para validar o fluxo completo. | ✅ Protótipo físico ou simulado funcional.<br>✅ Leitura de sensores e atuação de motores.<br>✅ Comunicação com backend validada. | 🔹 Diagrama de pinagem documentado.<br>✅ Firmware testado em ambiente controlado. |
| **RP03** | Comunicação IoT | Comunicação entre dispositivo e servidor via HTTP ou MQTT. | Alta | Como arquiteto, quero garantir que o protocolo escolhido seja adequado para cenários de baixa conectividade. | ✅ Protocolo implementado e documentado.<br>✅ Payloads estruturados e validados.<br>✅ Tratamento de desconexões. | 🔹 Especificação do protocolo definida.<br>🔹 Testes de estresse de rede realizados. |
| **RP04** | Aplicativo Móvel | Desenvolvimento de app nativo ou híbrido para interação com o sistema. | Alta | Como usuário final, quero uma experiência fluida e responsiva no meu smartphone. | ✅ App publicado em ambiente de teste.<br>✅ Navegação intuitiva e acessível.<br>✅ Integração com API backend. | 🔹 Framework móvel escolhido (React Native/Flutter).<br>🔹 Protótipo validado com usuários. |
| **RP05** | Arquitetura Cliente-Servidor | Solução com separação clara entre dispositivo, backend e frontend móvel. | Alta | Como arquiteto de software, quero garantir escalabilidade e manutenção facilitada. | ✅ Diagrama de arquitetura documentado.<br>✅ APIs bem definidas e versionadas.<br>✅ Comunicação assíncrona quando necessário. | 🔹 Decisões arquiteturais registradas em ADRs.<br>🔹 Revisão de arquitetura aprovada. |
| **RP06** | Desenvolvimento Incremental | Projeto desenvolvido em sprints com entregas parciais funcionais. | Alta | Como PO, quero visualizar progresso constante e ajustar prioridades conforme necessário. | ✅ Entregas ao final de cada sprint.<br>✅ Funcionalidades testadas e documentadas.<br>✅ Feedback incorporado nas iterações. | 🔹 Backlog refinado e priorizado.<br>🔹 Critérios de aceitação claros por item. |
| **RP07** | Documentação Técnica | Documentação da arquitetura, diagramas e descrição da comunicação entre elementos. | Média | Como novo membro da equipe, quero entender rapidamente como o sistema funciona. | ✅ README completo no repositório.<br>✅ Diagramas de caso de uso e componentes.<br>✅ Guia de contribuição e setup. | 🔹 Documentação versionada junto ao código.<br>🔹 Revisão técnica da documentação. |
| **RP08** | Escopo Compatível com o Semestre | Solução viável dentro do tempo disponível, podendo utilizar simulações para componentes físicos. | Alta | Como equipe, quero entregar um MVP funcional mesmo com limitações de hardware. | ✅ MVP com funcionalidades essenciais.<br>✅ Simulações documentadas e substituíveis.<br>✅ Roadmap de evolução pós-semestre. | 🔹 Escopo validado com orientadores.<br>🔹 Plano de mitigação de riscos definido. |
| **RP09** | Pipeline Automatizado | CI/CD configurado com GitHub Actions, GitLab CI ou similar. | Alta | Como DevOps, quero automatizar processos repetitivos para focar em valor. | ✅ Pipeline executando build, testes e lint.<br>✅ Deploy automatizado em staging.<br>✅ Notificações de status integradas. | 🔹 Arquivo de pipeline versionado.<br>🔹 Documentação de uso do pipeline. |
| **RP10** | Execução Automatizada de Testes | Testes automatizados integrados ao pipeline de CI. | Alta | Como QA, quero garantir qualidade com execução automática de testes a cada alteração. | ✅ Suite de testes unitários e de integração.<br>✅ Cobertura mínima de 80%.<br>✅ Relatórios de falhas claros. | 🔹 Framework de testes escolhido e configurado.<br>🔹 Mocks e fixtures organizados. |
| **RP11** | Deploy Automatizado | Deploy do backend automatizado, preferencialmente em ambiente de nuvem. | Alta | Como administrador, quero liberar novas versões sem intervenção manual. | ✅ Deploy em cloud (AWS/Azure/GCP).<br>✅ Variáveis de ambiente gerenciadas com segurança.<br>✅ Rollback em caso de falha. | 🔹 Infraestrutura como código (Terraform/CloudFormation).<br>🔹 Ambiente de produção isolado. |
| **RP12** | Conteinerização | Solução utilizando Docker para padronização do ambiente de execução. | Média | Como desenvolvedor, quero garantir que o sistema rode igual em qualquer ambiente. | ✅ Dockerfile para backend e IoT.<br>✅ Docker Compose para ambiente local.<br>✅ Imagens otimizadas e seguras. | 🔹 Base images oficiais e atualizadas.<br>🔹 Scan de vulnerabilidades integrado ao pipeline. |

---

<h2>Equipe</h2>

| Nome | Cargo | Midia Social |
| ---- | ----- | ------------ |
| Gabriel Frois | Scrum Master | <a href="https://github.com/GabrielFrois"><img src="https://skillicons.dev/icons?i=github"></a> |
| Gabriel Camargo | Project Owner | <a href="https://github.com/AllanDreemur"><img src="https://skillicons.dev/icons?i=github"></a> |
| Felipe Ribeiro | Desenvolvedor | <a href="https://github.com/feliperib286"><img src="https://skillicons.dev/icons?i=github"></a> |
| João Victor | Desenvolvedor | <a href="https://github.com/joaoestreano"><img src="https://skillicons.dev/icons?i=github"></a> |
| Pedro Prado | Desenvolvedor | <a href="https://github.com/PeedroPrado"><img src="https://skillicons.dev/icons?i=github"></a> |

---

<h2>🛠️ Tecnologias Utilizadas</h2>

<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nodejs,express,react,docker,githubactions,mqtt,postgres" />
</p>

- **Backend**: Node.js, Express, TypeScript
- **IoT**: ESP32/Arduino, MQTT/HTTP, Sensores e Atuadores
- **Mobile**: React Native / Flutter (a definir)
- **Banco de Dados**: PostgreSQL / MongoDB
- **Cloud**: AWS / Azure / GCP (a definir)
- **DevOps**: Docker, GitHub Actions, CI/CD
- **Testes**: Jest, Supertest, Testing Library

---

<h2>📂 Estrutura do Projeto</h2>

---

<h2>🚀 Como Contribuir</h2>

1. Faça um **fork** do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um **Pull Request**

> 📌 Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.

---

<p align="center"><strong>Feito pela equipe CapyDev – FATEC Jacareí | 2026</strong></p>

# 📚 Classroom Reservation System – UFRB

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-563d7c?style=for-the-badge&logo=bootstrap&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)

Sistema web para reserva de salas e laboratórios da UFRB – com autenticação, aprovação por docentes e controle automatizado de uso dos espaços físicos acadêmicos.

---

## 🧩 O Problema

Na realidade atual da UFRB, a **reserva de salas é feita manualmente na portaria**, exigindo a presença do professor para cada confirmação para um aluno. Esse processo é:

- **Altamente burocrático** para os alunos;
- Exige **autorização presencial ou aprovação da Reitoria**;
- Inviabiliza o uso espontâneo dos laboratórios, limitando projetos e atividades práticas;
- Uso de salas para estudo dirigido por um grupo de estudo;
- A maioria dos professores que dão Aula não ficam disponiveis para o aluno poder solicitar acesso,
- Por conta disto acontece muito A **liberação não registrada** das chaves, baseada em confiança, ou uma liberação anterior, ou seja normalmente so é solicitado na primeira vez, e não há garantia de quem usará pois não ha registro oficial do nome do aluno, ou verificação se é de fato aluno.

---

## ✅ A Solução

O *Classroom Reservation System* digitaliza e automatiza esse processo, permitindo:

- **Alunos solicitarem reservas online** com indicação do docente responsável;
- **Professores aprovarem digitalmente** as solicitações via painel web;
- **Servidores liberarem chaves** apenas mediante autorização registrada no sistema;
- **Painéis de uso por sala**, garantindo visibilidade, rastreabilidade e segurança;
- Registro completo de **quem usou**, **quando usou**, **para quê**, e **quem autorizou**.

---

## 🚀 Tecnologias Utilizadas

| Camada       | Tecnologia                  |
|--------------|-----------------------------|
| Backend      | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) |
| Banco de Dados | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| Frontend     | HTML5, CSS3, [Bootstrap](https://getbootstrap.com/), JS puro |
| Autenticação | JWT, Bcrypt                 |
| E-mail       | Nodemailer (SMTP)           |
| Projeto      | Jira Software (Kanban) |

---
🧑‍💻 Gerenciamento do Projeto

O desenvolvimento foi organizado com metodologia ágil (Kanban), utilizando o Jira da Atlassian para dividir o progresso em:

- Planejamento e modelagem

- Backend com Express + MongoDB

- Frontend com Bootstrap

- Integração, testes e deploy
[🔗 Acesse o board Kanban aqui](https://classroom-reservation-system.atlassian.net/jira/software/projects/CPG/summary)

## 📋 Funcionalidades Principais

- Cadastro e login com autenticação JWT (usuários: alunos, professores, técnicos, servidores)
- Painel de solicitação de reservas com envio para aprovação
- Painel de aprovação para professores
- Controle de salas, status e recursos disponíveis
- Histórico completo de reservas por sala e usuário
- Envio de e-mail automático ao aluno após aprovação
- Estrutura flexível para escalar e auditar o uso dos espaços

---

## 🛠️ Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/quguit/Guilherme-Portifolio/classroom-reservation-system.git

# Acesse o diretório
cd classroom-reservation-system

# Instale as dependências
npm install

# Configure o .env com as variáveis necessárias 

# Execute o projeto
npm start
```

✍️ Autor

Desenvolvido por Guilherme Nascimento @quguit \
Graduando em Engenharia de Computação \
Desenvolvedor Full-stack.

🎯 MVP – Sistema de Reserva de Salas/Laboratórios
🔧 Tecnologias Utilizadas
Camada	Tecnologia
Frontend	HTML5, CSS3, JavaScript, Bootstrap
Backend	Node.js com Express.js (leve e rápido)
Banco de Dados	MongoDB (NoSQL)
Autenticação	JWT (JSON Web Tokens), Bcrypt (hash de senha)
Outros	Nodemailer (e-mails), Mongoose (ODM)
🧩 Funcionalidades do MVP
🔐 Autenticação (Login/Cadastro)

    Cadastro e login com validação por tipo de usuário (Aluno, Professor, Técnico, Funcionário).

    Senha criptografada com Bcrypt.

    Sessões autenticadas via JWT.

    Recuperação de senha via e-mail.

🧑‍🎓 Perfis de Usuário

    Aluno:

        Cadastro/login.

        Solicitação de reserva com aprovação de professor.

        Visualização das reservas aprovadas.

    Professor:

        Cadastro/login.

        Reserva direta de salas.

        Aprovação/rejeição de reservas de alunos.

    Funcionário/Técnico:

        Cadastro/login.

        Visualização de todas as reservas.

        Atualização de status de limpeza e observações.

🏫 Gerenciamento de Salas

    Cadastro de salas com número, tipo, capacidade, recursos, observações e status.

    Atualização de informações das salas mediante solicitação.

📆 Sistema de Reservas

    Criar reserva com data/hora, tipo de uso e recursos necessários.

    Associação de reserva com sala específica e responsável.

    Controle de status de devolução de chave.

    Visualização de reservas (por tipo de usuário).

✅ Aprovação de Reservas

    Professores recebem notificações de solicitações de alunos e podem aprovar ou negar.

📬 Notificações

    E-mail automático ao aluno após aprovação de reserva.

📱 Interface Web (UI)

Telhas iniciais por tipo de usuário após login:
Tela do Aluno	Tela do Professor	Tela dos Funcionários
Solicitar reserva	Reservar sala	Ver reservas do dia
Ver reservas aprovadas	Aprovar pedidos	Atualizar status da sala

Outras Telas:

    Formulário de login/cadastro

    Formulário de reserva

    Visualização de salas e seus detalhes

    Painel de administração (reservas e salas)

🗃️ Estrutura Básica do MongoDB
```plaintext
Usuários
- _id
- nome
- email
- senha_hash
- tipo (aluno, professor, tecnico, funcionario)
- matricula/siap/id_registro
- contato

Salas
- _id
- numero
- tipo (aula/lab)
- capacidade
- recursos [projetor, ar-condicionado, etc.]
- status_limpeza (limpo, limpando, sujo)
- observacoes

Reservas
- _id
- sala_id
- usuario_id (quem reservou)
- tipo_usuario
- motivo
- data_inicio
- data_fim
- status_reserva (pendente, aprovado, negado)
- devolucao_chave (boolean)
```

📅 Metodologia de Projeto
Kanban ou Scrum
🧪 Testes

    Testes unitários para API (Jest ou Mocha)

    Testes manuais de UI nos principais navegadores

    Testes de autenticação, fluxos de reserva e validações

🧠 Futuras Melhorias (pós-MVP)

    Integração com sistema de leitura de QRCode (para reserva via chaveiro)

    Notificações por push

    Dashboard com estatísticas de uso

    CRUD avançado de usuários com permissões diferenciadas

    Upload de arquivos/documentos para comprovação de reservas
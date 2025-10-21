Método 1: Usar a API do Gmail (recomendado)
Este método é o mais seguro e robusto para enviar e-mails de uma aplicação, pois não requer que você use sua senha diretamente. Ele utiliza credenciais OAuth 2.0 para autenticação.
1. Crie um projeto no Google Cloud Console:
   Acesse o Google Cloud Console.
   Crie um novo projeto, dando um nome a ele.
2. Habilite a API do Gmail:
   Dentro do projeto, vá para "APIs e serviços" > "Biblioteca".
   Procure por "Gmail API" e clique em "Ativar".
3. Crie credenciais OAuth 2.0:
   Vá para "APIs e serviços" > "Credenciais".
   Clique em "Criar credenciais" e escolha "ID do cliente OAuth".
   Siga as instruções para configurar a "Tela de consentimento OAuth".
   Selecione o tipo de aplicativo (por exemplo, "Aplicativo para computador" ou "Aplicativo da Web") e crie.
   Baixe o arquivo JSON com as credenciais (client_id.json).
4. Siga as instruções específicas da biblioteca cliente:
   A maioria das linguagens de programação tem bibliotecas cliente para a API do Google (como Python, Node.js, etc.). Use a documentação específica para a sua linguagem.
   O arquivo JSON baixado será usado para gerar um token de acesso para a sua conta, permitindo que a aplicação envie e-mails em seu nome.
   O processo envolve usar a biblioteca para autenticar o usuário, receber o token e, em seguida, chamar o método send da API do Gmail.
   
Método 2: Usar o servidor SMTP do Gmail
   Este método é mais simples para configurações rápidas, mas é menos seguro, pois requer o uso de uma Senha de App específica em vez da sua senha regular do Google.
1. Ative a verificação em duas etapas:
   Acesse sua conta do Google, vá em "Segurança".
   Habilite a "Verificação em duas etapas".
2. Crie uma senha de app:
   Após ativar a verificação, procure por "Senhas de app" na barra de pesquisa.
   Selecione "App" (por exemplo, "Outro") e dê um nome (ex: "API de e-mail").
   O Google irá gerar uma senha de 16 dígitos. Copie-a, pois ela só será exibida uma vez.
3. Configure a sua API ou aplicação:
   Use as seguintes configurações na sua API, biblioteca ou aplicação que precisa enviar e-mails:
   Servidor SMTP: smtp.gmail.com
   Porta: 587 (para TLS) ou 465 (para SSL)
   Nome de usuário: Seu endereço de e-mail completo (por exemplo, voce@gmail.com)
   Senha: A senha de app de 16 dígitos que você gerou, não a sua senha normal.
   Segurança: Use TLS ou SSL. 


Teste endpoint plain text
```
curl -X POST http://localhost:8081/mail/contact -H "Content-Type: application/json" -d '{"nome": "João Silva","email": "joao@example.com","telefone": "(11) 99131-8744","assunto": "Dúvida sobre o produto","mensagem": "Gostaria de mais informações sobre o produto X."}'
```

Teste HTML  
```
curl -X POST http://localhost:8081/mail/html \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Katia Urano",
    "email": "katia.urano@gmail.com",
    "telefone": "(11) 99999-9999", 
    "assunto": "Teste HTML",
    "mensagem": "Mensagem de teste",
    "htmlContent": "<html><body><h1>Teste</h1><p>Email HTML</p></body></html>"
  }'
```



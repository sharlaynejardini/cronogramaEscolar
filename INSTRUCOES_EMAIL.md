# Lembretes por e-mail

Para enviar e-mail automaticamente 1 dia antes dos eventos, use o arquivo `email-reminders.gs` no Google Apps Script da planilha.

1. Abra a planilha.
2. Vá em `Extensões` > `Apps Script`.
3. Cole o conteúdo de `email-reminders.gs`.
4. Crie uma aba chamada `PROFESSORES`.
5. Coloque os e-mails dos professores na coluna `A`, um por linha.
6. No Apps Script, execute a função `criarDisparoDiario()` uma vez e autorize.

Depois disso, a função `enviarLembretesDeAmanha()` roda todos os dias às 7h e envia um lembrete quando houver evento no dia seguinte.

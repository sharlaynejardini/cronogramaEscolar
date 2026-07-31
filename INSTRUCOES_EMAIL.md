# Lembretes por e-mail

Para enviar e-mail 3 dias antes dos eventos, use o arquivo `email-reminders.gs` no Google Apps Script da planilha.

1. Abra a planilha.
2. Vá em `Extensões` > `Apps Script`.
3. Cole o conteúdo de `email-reminders.gs`.
4. Crie uma aba chamada `PROFESSORES`.
5. Crie a lista de professores com nome e e-mail. Pode ser `Nome` na coluna `A` e `E-mail` na coluna `B`, ou o contrário.
6. Abra o Apps Script logada na conta `sharlayne.fonseca@professor.barueri.br`, ou configure esse e-mail como alias autorizado no Gmail da conta que executa o script.
7. No Apps Script, execute a função `instalarEnvioAutomatico()` uma vez e autorize.

Depois disso, a função `enviarLembretesAntecipados()` roda todos os dias às 7h e envia um alerta individual quando houver evento daqui a 3 dias. O e-mail usa o nome do professor e o nome do evento.

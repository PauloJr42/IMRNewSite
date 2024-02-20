document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
  
    var email = document.getElementById('email').value;
  
    // Objeto contendo os dados a serem enviados
    var data = {
      email: email
    };
  
    // Requisição AJAX para enviar os dados para o arquivo PHP
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'form.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Exibe a resposta do servidor
        console.log(xhr.responseText);
      }
    };
  
    // Envia os dados como JSON
    xhr.send(JSON.stringify(data));
  });
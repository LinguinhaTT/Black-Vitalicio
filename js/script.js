window.addEventListener("elementor/frontend/init", function () {
  const ENDPOINT_CHECK_ALUNOS = window.location.origin + "/wp-json/alunos/v1/check";
  const ENDPOINT_CHECK_BLACK = window.location.origin + "/wp-json/black/v1/check";
  
  // ========== CONFIGURAÇÕES GLOBAIS ==========
  const configPluginAlunos = document.querySelector("alunos-config");
  const usuarioEncontradoRedirectUrl = configPluginAlunos ? configPluginAlunos.dataset.usuarioEncontradoRedirectUrl : null;
  const usuarioEncontradoRedirectTime = configPluginAlunos ? configPluginAlunos.dataset.usuarioEncontradoRedirectTime : 0;
  const usuarioNaoEncontradoRedirectUrl = configPluginAlunos ? configPluginAlunos.dataset.usuarioNaoEncontradoRedirectUrl : null;
  const usuarioNaoEncontradoRedirectTime = configPluginAlunos ? configPluginAlunos.dataset.usuarioNaoEncontradoRedirectTime : 0;

  // ========== ELEMENTOS COMUNS ==========
  const etapas = document.querySelectorAll(".etapa");
  const etapaInicial = document.querySelector(".etapa-inicial");
  const etapaNaoEncontrado = document.querySelector(".etapa-naoencontrado");

  // ========== FORM ALUNOS ==========
  const formAlunos = document.querySelector("#verificacao_aluno");
  const etapaVerificarAlunos = document.querySelector(".etapa-verificar");
  const etapaEncontradoAlunos = document.querySelector(".etapa-encontrado");
  const emailToSwitchAlunos = document.querySelectorAll(".dado_usuario");

  // ========== FORM BLACK ==========
  const formBlack = document.querySelector("#verificacao_aluno2");
  const etapaNaoAluno = document.querySelector(".etapa-naoaluno");
  const etapaEncontradoBlack = document.querySelector(".etapa-encontrado2");
  const emailToSwitchBlack = document.querySelectorAll(".dado_usuario2");

  // ========== BOTÕES DE NAVEGAÇÃO ==========
  const btnEtapaInicial = document.querySelectorAll(".btn-etapa-inicial");
  btnEtapaInicial.forEach((btn) => {
    btn.addEventListener("click", function () {
      etapas.forEach((etapa) => {
        etapa.style.display = "none";
      });
      if (etapaInicial) {
        etapaInicial.style.display = "inherit";
      }
    });
  });

  const btnEtapaVerificar = document.querySelector(".btn-etapa-verificar");
  if (btnEtapaVerificar) {
    btnEtapaVerificar.addEventListener("click", function () {
      if (etapaInicial) etapaInicial.style.display = "none";
      if (etapaVerificarAlunos) etapaVerificarAlunos.style.display = "inherit";
    });
  }

  const btnEtapaNaoAluno = document.querySelector(".btn-etapa-naoaluno");
  if (btnEtapaNaoAluno) {
    btnEtapaNaoAluno.addEventListener("click", function () {
      if (etapaInicial) etapaInicial.style.display = "none";
      if (etapaNaoAluno) etapaNaoAluno.style.display = "inherit";
    });
  }

  const btnVoltarBlack = document.querySelectorAll(".btn-voltar-black");
  btnVoltarBlack.forEach((btn) => {
    btn.addEventListener("click", function () {
      etapas.forEach((etapa) => {
        etapa.style.display = "none";
      });
      if (etapaNaoAluno) {
        etapaNaoAluno.style.display = "inherit";
      }
    });
  });

  // ========== PROCESSAMENTO FORM ALUNOS ==========
  if (formAlunos) {
    formAlunos.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const emailInput = formAlunos.querySelector("#form-field-dado_usuario");
      
      if (!emailInput) {
        console.error("Campo de dado_usuario não encontrado no form alunos");
        return;
      }

      const emailValue = emailInput.value.trim();

      // Atualiza elementos com o valor digitado
      emailToSwitchAlunos.forEach((el) => {
        el.textContent = emailValue;
      });

      const param = emailValue.includes('@') ? 'email' : 'cpf';
      const urlParams = new URLSearchParams(window.location.search);

      // Faz requisição para API
      fetch(
        ENDPOINT_CHECK_ALUNOS + "?" + param + "=" + encodeURIComponent(emailValue),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Esconde etapa de verificação
          if (etapaVerificarAlunos) {
            etapaVerificarAlunos.style.display = "none";
          }

          if (data.existe) {
            // Encontrado
            if (etapaEncontradoAlunos) {
              etapaEncontradoAlunos.style.display = "inherit";
            }

            if (usuarioEncontradoRedirectUrl) {
              setTimeout(() => {
                const redirectUrl = new URL(usuarioEncontradoRedirectUrl);
                urlParams.forEach((value, key) => {
                  redirectUrl.searchParams.append(key, value);
                });
                window.location.href = redirectUrl.toString();
              }, usuarioEncontradoRedirectTime * 1000);
            }
          } else {
            // Não encontrado
            if (usuarioNaoEncontradoRedirectUrl) {
              setTimeout(() => {
                const redirectUrl = new URL(usuarioNaoEncontradoRedirectUrl);
                urlParams.forEach((value, key) => {
                  redirectUrl.searchParams.append(key, value);
                });
                window.location.href = redirectUrl.toString();
              }, usuarioNaoEncontradoRedirectTime * 1000);
            }
            
            if (etapaNaoEncontrado) {
              etapaNaoEncontrado.style.display = "inherit";
            }
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar aluno:", error);
          // Esconde etapa de verificação mesmo em caso de erro
          if (etapaVerificarAlunos) {
            etapaVerificarAlunos.style.display = "none";
          }
          if (etapaNaoEncontrado) {
            etapaNaoEncontrado.style.display = "inherit";
          }
        });
    });
  }

  // ========== PROCESSAMENTO FORM BLACK ==========
  if (formBlack) {
    formBlack.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const emailInput = formBlack.querySelector("#form-field-dado_usuario") || 
                         formBlack.querySelector('input[type="email"]') ||
                         formBlack.querySelector('input[type="text"]');
      
      if (!emailInput) {
        console.error("Campo de email não encontrado no form Black");
        return;
      }

      const emailValue = emailInput.value.trim();

      // Atualiza elementos com o valor digitado
      emailToSwitchBlack.forEach((el) => {
        el.textContent = emailValue;
      });

      const param = emailValue.includes('@') ? 'email' : 'cpf';
      const urlParams = new URLSearchParams(window.location.search);

      // Faz requisição para API Black
      fetch(
        ENDPOINT_CHECK_BLACK + "?" + param + "=" + encodeURIComponent(emailValue),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Esconde a etapa naoaluno
          if (etapaNaoAluno) {
            etapaNaoAluno.style.display = "none";
          }

          if (data.existe) {
            // Encontrado
            if (etapaEncontradoBlack) {
              etapaEncontradoBlack.style.display = "inherit";
            }

            if (usuarioEncontradoRedirectUrl) {
              setTimeout(() => {
                const redirectUrl = new URL(usuarioEncontradoRedirectUrl);
                urlParams.forEach((value, key) => {
                  redirectUrl.searchParams.append(key, value);
                });
                window.location.href = redirectUrl.toString();
              }, usuarioEncontradoRedirectTime * 1000);
            }
          } else {
            // Não encontrado
            if (usuarioNaoEncontradoRedirectUrl) {
              setTimeout(() => {
                const redirectUrl = new URL(usuarioNaoEncontradoRedirectUrl);
                urlParams.forEach((value, key) => {
                  redirectUrl.searchParams.append(key, value);
                });
                window.location.href = redirectUrl.toString();
              }, usuarioNaoEncontradoRedirectTime * 1000);
            }
            
            if (etapaNaoEncontrado) {
              etapaNaoEncontrado.style.display = "inherit";
            }
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar Black:", error);
          // Esconde a etapa naoaluno mesmo em caso de erro
          if (etapaNaoAluno) {
            etapaNaoAluno.style.display = "none";
          }
          if (etapaNaoEncontrado) {
            etapaNaoEncontrado.style.display = "inherit";
          }
        });
    });
  }
});
document.getElementById("year").textContent = new Date().getFullYear();

const serviceSelect = document.getElementById("tipo-solicitacao");
const equipmentFields = document.getElementById("equipment-fields");

if (serviceSelect && equipmentFields) {

    // Selecionar automaticamente o serviço informado na URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedService = urlParams.get("servico");

    if (selectedService) {
        const optionExists = Array.from(serviceSelect.options)
            .some(option => option.value === selectedService);

        if (optionExists) {
            serviceSelect.value = selectedService;
        }
    }


    const servicesWithoutEquipment = [
        "consultoria",
        "contrato_mensal_ti",
        "sites",
        "email-dominio",
        "gestao-ti",
        "orcamento",
        "outro"
    ];



    function updateEquipmentFields() {

        const selectedService = serviceSelect.value;
        const equipmentSection = document.getElementById("equipment-section");
        const equipmentSelect = document.getElementById("equipamento");
        const otherEquipmentField = document.getElementById("other-equipment-field");
        const otherEquipmentInput = document.getElementById("outro-equipamento");

        if (!equipmentSection || !equipmentSelect) return;

        // Equipamentos permitidos para cada serviço
        const equipmentByService = {
            "manutencao": ["desktop", "notebook", "netbook", "macbook", "impressora", "servidor"],
            "redes": ["desktop", "notebook", "roteador", "switch", "firewall", "nobreak", "servidor"],
            "servidores": ["desktop", "notebook", "servidor", "nobreak"],
            "backup": ["desktop", "notebook", "netbook", "macbook", "servidor"],
            "cftv": ["camera", "dvr-nvr", "nobreak", "roteador", "switch"],

            "controle-acesso": ["catraca", "controladora-acesso", "fechadura-eletronica", "leitor-biometrico", "leitor-facial", "teclado-rfid"],

        };

        // Oculta equipamentos quando nenhum serviço está selecionado
        // ou quando o serviço não necessita de equipamento


        if (!selectedService || servicesWithoutEquipment.includes(selectedService)) {

            equipmentSection.style.display = "none";
            equipmentSelect.required = false;

            // Limpa o equipamento selecionado
            equipmentSelect.value = "";

            // Limpa a marca e o modelo informados anteriormente
            const marcaModeloField = document.getElementById("marca-modelo");

            if (marcaModeloField) {
                marcaModeloField.value = "";
            }

            // Atualiza o campo "Outro equipamento"
            equipmentSelect.dispatchEvent(new Event("change"));

            return;
        }


        equipmentSection.style.display = "block";
        equipmentFields.style.display = "grid";
        equipmentSelect.required = true;

        // Recupera todas as opções originais
        const options = Array.from(equipmentSelect.options);
        const allowedEquipment = equipmentByService[selectedService];

        options.forEach(option => {

            // Opção inicial permanece disponível
            if (option.value === "") {
                option.hidden = false;
                option.disabled = false;
                return;
            }

            // Serviços sem restrição exibem todos os equipamentos
            const isAllowed = option.value === "outro" ||
                !allowedEquipment ||
                allowedEquipment.includes(option.value);

            option.hidden = !isAllowed;
            option.disabled = !isAllowed;

        });

        // Limpa a seleção anterior caso não seja compatível
        const selectedOption = equipmentSelect.selectedOptions[0];

        if (!selectedOption || selectedOption.disabled) {
            equipmentSelect.value = "";
        }

        // Atualiza campos dependentes do equipamento
        equipmentSelect.dispatchEvent(new Event("change"));

    }

    // ==========================================
    // ORIENTAÇÕES DINÂMICAS POR TIPO DE SERVIÇO
    // ==========================================

    const descricaoField = document.getElementById("descricao");

    const placeholdersPorServico = {
        "suporte": "Descreva o problema apresentado e informe quando começou.",

        "contrato_mensal_ti": "Conte-nos sobre sua empresa, quantidade de usuários e necessidades de suporte e gestão de TI.",

        "manutencao": "Informe o equipamento, os problemas apresentados e quando começaram.",

        "gestao-ti": "Descreva a estrutura atual de TI da empresa e quais atividades deseja contratar.",

        "redes": "Descreva sua rede, os problemas identificados ou as melhorias desejadas.",

        "servidores": "Informe o tipo de servidor, sua utilização e o serviço ou problema que precisa solucionar.",

        "backup": "Descreva quais dados precisam ser protegidos e como o backup é realizado atualmente.",

        "cftv": "Informe a quantidade aproximada de câmeras e o tipo de instalação ou manutenção desejada.",

        "controle-acesso": "Descreva o ambiente e a necessidade de controle de acesso.",

        "email-dominio": "Sua empresa já possui um domínio registrado? Se sim, informe o endereço (ex.: suaempresa.com.br). Informe também se deseja registrar um novo domínio, criar contas de e-mail corporativo, configurar e-mails existentes ou realizar uma migração. Caso necessite de contas de e-mail, indique a quantidade aproximada.",

        "sites": "Conte-nos sobre sua empresa, o tipo de site desejado e as funcionalidades necessárias.",

        "equipamentos": "Informe os equipamentos desejados, quantidades e configurações necessárias.",

        "consultoria": "Descreva os objetivos da consultoria e os principais desafios tecnológicos.",

        "orcamento": "Descreva o produto ou serviço para o qual deseja receber um orçamento.",

        "outro": "Descreva sua necessidade ou o serviço que deseja contratar."
    };

    function atualizarOrientacaoDescricao() {
        if (!descricaoField) return;

        const servico = serviceSelect.value;

        descricaoField.placeholder =
            placeholdersPorServico[servico] ||
            descricaoField.dataset.placeholderDefault ||
            "Descreva sua necessidade ou o serviço que deseja contratar.";
    }

    serviceSelect.addEventListener("change", updateEquipmentFields);

    serviceSelect.addEventListener("change", atualizarOrientacaoDescricao);

    updateEquipmentFields();

    atualizarOrientacaoDescricao();
}

/* ==========================================
   ENVIO DO FORMULÁRIO - FORMSPREE
========================================== */

const requestForm = document.querySelector(".request-form");
const formStatus = document.getElementById("form-status");

if (requestForm && formStatus) {

    requestForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = requestForm.querySelector(".form-submit");
        const originalButtonContent = submitButton.innerHTML;

        formStatus.className = "form-status";
        formStatus.textContent = "";

        submitButton.disabled = true;
        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Enviando...
        `;

        const formData = new FormData(requestForm);

        try {

            const response = await fetch(requestForm.action, {
                method: requestForm.method,
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                formStatus.className = "form-status success";

                formStatus.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>

                    <div>
                        <strong>Solicitação enviada com sucesso!</strong>
                        <span>
                            Recebemos suas informações e entraremos em contato
                            o mais breve possível.
                        </span>
                    </div>
                `;

                requestForm.reset();

                if (typeof updateEquipmentFields === "function") {
                    updateEquipmentFields();
                }

                const descricaoField = document.getElementById("descricao");

                if (descricaoField) {
                    descricaoField.placeholder =
                        descricaoField.dataset.placeholderDefault ||
                        "Descreva sua necessidade ou o serviço que deseja contratar.";
                }

            } else {

                throw new Error("Erro no envio");

            }

        } catch (error) {

            formStatus.className = "form-status error";

            formStatus.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>

                <div>
                    <strong>Não foi possível enviar sua solicitação.</strong>
                    <span>
                        Tente novamente em alguns instantes ou entre em contato
                        pelo WhatsApp.
                    </span>
                </div>
            `;

        } finally {

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;

        }

    });

}

/* ==========================================
   OUTRO EQUIPAMENTO
========================================== */

const equipmentSelect = document.getElementById("equipamento");
const otherEquipmentField = document.getElementById("other-equipment-field");
const otherEquipmentInput = document.getElementById("outro-equipamento");

if (equipmentSelect && otherEquipmentField && otherEquipmentInput) {

    function updateOtherEquipmentField() {

        if (equipmentSelect.value === "outro") {

            otherEquipmentField.style.display = "flex";
            otherEquipmentInput.required = true;

        } else {

            otherEquipmentField.style.display = "none";
            otherEquipmentInput.required = false;
            otherEquipmentInput.value = "";

        }

    }

    equipmentSelect.addEventListener("change", updateOtherEquipmentField);

    equipmentSelect.addEventListener("change", function () {

        const marcaModeloField = document.getElementById("marca-modelo");

        if (marcaModeloField) {
            marcaModeloField.value = "";
        }

    });

    updateOtherEquipmentField();

}


/* ==========================================
   ATENDIMENTO PRESENCIAL
========================================== */

const attendanceSelect = document.getElementById("atendimento");
const presentialFields = document.getElementById("presential-fields");

if (attendanceSelect && presentialFields) {

    const addressInput = document.getElementById("endereco");
    const neighborhoodInput = document.getElementById("bairro");
    const cityInput = document.getElementById("cidade");
    const periodSelect = document.getElementById("periodo");

    function updatePresentialFields() {

        const isPresential = attendanceSelect.value === "presencial";
        const cepField = document.getElementById("cep");
        const numeroField = document.getElementById("numero");

        if (cepField) {
            cepField.required = isPresential;
        }

        if (numeroField) {
            numeroField.required = isPresential;
        }


        if (isPresential) {

            presentialFields.style.display = "block";

            addressInput.required = true;
            neighborhoodInput.required = true;
            cityInput.required = true;
            periodSelect.required = true;


        } else {

            presentialFields.style.display = "none";

            addressInput.required = false;
            neighborhoodInput.required = false;
            cityInput.required = false;
            periodSelect.required = false;

            // Limpa todos os campos do endereço
            presentialFields.querySelectorAll("input, select, textarea")
                .forEach(function (campo) {

                    if (campo.type === "checkbox") {
                        campo.checked = false;
                    } else {
                        campo.value = "";
                    }

                });

            // Restaura o campo Número para edição
            const numeroField = document.getElementById("numero");

            if (numeroField) {
                numeroField.readOnly = false;
                numeroField.required = false;
            }

            // Limpa a mensagem da consulta do CEP
            const cepStatus = document.getElementById("cep-status");

            if (cepStatus) {
                cepStatus.textContent = "";
            }

        }


    }

    attendanceSelect.addEventListener("change", updatePresentialFields);

    updatePresentialFields();
}


/* ==========================================
   CONTROLE DO NÚMERO DO IMÓVEL
========================================== */

const numeroInput = document.getElementById("numero");
const semNumeroCheckbox = document.getElementById("sem-numero");
const modalidadeAtendimento = document.getElementById("atendimento");

if (numeroInput && semNumeroCheckbox && modalidadeAtendimento) {

    function atualizarNumeroImovel() {

        const presencial =
            modalidadeAtendimento.value === "presencial";

        if (semNumeroCheckbox.checked) {
            numeroInput.value = "S/N";
            numeroInput.readOnly = true;
        } else {
            if (numeroInput.value === "S/N") {
                numeroInput.value = "";
            }

            numeroInput.readOnly = false;
        }

        numeroInput.required = presencial;
    }

    semNumeroCheckbox.addEventListener("change", atualizarNumeroImovel);

    modalidadeAtendimento.addEventListener("change", function () {
        atualizarNumeroImovel();
    });

    atualizarNumeroImovel();
}


/* ==========================================
   CONSULTA AUTOMÁTICA DE CEP - VIACEP
========================================== */

const cepInput = document.getElementById("cep");
const cepStatus = document.getElementById("cep-status");
const enderecoInput = document.getElementById("endereco");
const bairroInput = document.getElementById("bairro");
const cidadeInput = document.getElementById("cidade");

if (cepInput && enderecoInput && bairroInput && cidadeInput) {

    let consultaCepAtual = 0;

    cepInput.addEventListener("input", async function () {

        const cep = cepInput.value.replace(/\D/g, "").slice(0, 8);

        // Formata automaticamente o CEP
        cepInput.value = cep.length > 5
            ? cep.slice(0, 5) + "-" + cep.slice(5)
            : cep;

        const consulta = ++consultaCepAtual;

        // Limpa o endereço anterior ao modificar o CEP
        enderecoInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";

        if (cepStatus) {
            cepStatus.textContent = "";
        }

        if (cep.length !== 8) {
            return;
        }

        if (cepStatus) {
            cepStatus.textContent = "Consultando CEP...";
        }

        try {

            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (!response.ok) {
                throw new Error("Falha na consulta");
            }

            const dados = await response.json();

            // Ignora consultas antigas ou atendimento não presencial
            if (
                consulta !== consultaCepAtual ||
                document.getElementById("atendimento")?.value !== "presencial" ||
                cepInput.value.replace(/\D/g, "") !== cep
            ) {
                return;
            }

            if (dados.erro) {

                if (cepStatus) {
                    cepStatus.textContent =
                        "CEP não encontrado. Informe o endereço manualmente.";
                }

                return;
            }

            enderecoInput.value = dados.logradouro || "";
            bairroInput.value = dados.bairro || "";

            cidadeInput.value = dados.localidade
                ? `${dados.localidade}-${dados.uf || ""}`
                : "";


            if (cepStatus) {
                cepStatus.textContent =
                    "Endereço localizado. Confira os dados antes de continuar.";
            }


        } catch (error) {

            // Ignora consultas antigas ou atendimento não presencial
            if (
                consulta !== consultaCepAtual ||
                document.getElementById("atendimento")?.value !== "presencial" ||
                cepInput.value.replace(/\D/g, "") !== cep
            ) {
                return;
            }

            if (cepStatus) {
                cepStatus.textContent =
                    "Não foi possível consultar o CEP neste momento. " +
                    "Verifique sua conexão ou preencha o endereço manualmente.";
            }

        }

    });

}


/* ==========================================
   IDENTIFICAÇÃO DO CONTRATO MENSAL
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const plano = params.get("plano");
    const descricao = document.getElementById("descricao");
    const tipoSolicitacao = document.getElementById("tipo-solicitacao");

    if (!descricao || !tipoSolicitacao) return;

    const descricoes = {

        essencial:
            "Tenho interesse no L&G TI Essencial, " +
            "com mensalidade a partir de R$ 1.000,00 " +
            "e contrato mínimo de 12 meses. " +
            "Gostaria de receber uma proposta comercial.",

        empresarial:
            "Tenho interesse no contrato de Gestão de TI Empresarial. " +
            "Gostaria de solicitar uma avaliação da infraestrutura " +
            "e receber uma proposta comercial personalizada."

    };


    if (
        tipoSolicitacao.value === "contrato_mensal_ti" &&
        Object.prototype.hasOwnProperty.call(descricoes, plano)
    ) {
        // Preenche automaticamente a descrição do plano
        descricao.value = descricoes[plano];

        // Guarda o texto inserido automaticamente
        let descricaoAutomatica = descricoes[plano];

        // Identifica alterações feitas pelo próprio cliente
        descricao.addEventListener("input", function () {
            descricaoAutomatica = null;
        });

        // Verifica mudanças no serviço desejado
        tipoSolicitacao.addEventListener("change", function () {

            // Limpa somente se o texto ainda for o automático
            if (
                tipoSolicitacao.value !== "contrato_mensal_ti" &&
                descricaoAutomatica !== null &&
                descricao.value === descricaoAutomatica
            ) {
                descricao.value = "";
                descricaoAutomatica = null;
            }

        });
    }


});


/* ==========================================
   MENU MOBILE - L&G TECNOLOGIA
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.querySelector(".menu-toggle");
    const menu = document.getElementById("menu-principal");

    if (!menuButton || !menu) return;

    function closeMenu() {
        menu.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu de navegação");

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    menuButton.addEventListener("click", function () {

        const isOpen = menu.classList.toggle("menu-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
        );

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }

    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", function (event) {
        if (
            !menu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

});
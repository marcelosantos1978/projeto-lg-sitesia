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
        "sites",
        "email-dominio",
        "consultoria",
        "orcamento",
        "contrato_mensal_ti"
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
            "manutencao": ["desktop", "notebook", "netbook", "macbook", "servidor"],
            "redes": ["roteador", "switch", "firewall", "nobreak"],
            "servidores": ["servidor", "nobreak"],
            "backup": ["desktop", "notebook", "servidor"],
            "cftv": ["camera", "dvr-nvr", "nobreak"],
            "controle-acesso": ["controle-acesso"]
        };

        // Serviços que não necessitam de equipamento
        if (servicesWithoutEquipment.includes(selectedService)) {
            equipmentSection.style.display = "none";
            equipmentSelect.value = "";
            equipmentSelect.dispatchEvent(new Event("change"));
            return;
        }

        equipmentSection.style.display = "block";
        equipmentFields.style.display = "grid";

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


    serviceSelect.addEventListener("change", updateEquipmentFields);

    updateEquipmentFields();
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

        }

    }

    attendanceSelect.addEventListener("change", updatePresentialFields);

    updatePresentialFields();
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

        descricao.value = descricoes[plano];

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
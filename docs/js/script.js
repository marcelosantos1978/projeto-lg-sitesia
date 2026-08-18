document.getElementById("year").textContent = new Date().getFullYear();

const serviceSelect = document.getElementById("tipo-solicitacao");
const equipmentFields = document.getElementById("equipment-fields");

if (serviceSelect && equipmentFields) {

    const servicesWithoutEquipment = [
        "sites",
        "email-dominio",
        "consultoria",
        "orcamento"
    ];

    function updateEquipmentFields() {

        const selectedService = serviceSelect.value;

        if (servicesWithoutEquipment.includes(selectedService)) {

            equipmentFields.style.display = "none";

        } else {

            equipmentFields.style.display = "grid";

        }

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
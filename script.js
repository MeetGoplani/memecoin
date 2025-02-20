document.addEventListener("DOMContentLoaded", () => {
    // Function to handle image upload
    function handleImageUpload(uploadBox, inputElement, previewElement) {
        uploadBox.addEventListener("click", () => inputElement.click());

        inputElement.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewElement.src = e.target.result;
                    previewElement.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle image upload for icon and banner
    handleImageUpload(document.getElementById("icon-upload"), document.getElementById("icon-input"), document.getElementById("icon-preview"));
    handleImageUpload(document.getElementById("banner-upload"), document.getElementById("banner-input"), document.getElementById("banner-preview"));

    // Handle option selection in boxes
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function(event) {
            if (event.target.classList.contains('option')) {
                box.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                event.target.classList.add('selected');
            }
        });
    });

    // URL Validation Logic
    const allowedDomains = ["example.com", "twitter.com", "t.me", "discord.com"];

    function validateURL(input) {
        const errorElement = input.nextElementSibling;
        const value = input.value.trim();

        if (!value) {
            errorElement.textContent = "This field is required.";
            return false;
        }

        try {
            const url = new URL(value);
            const domain = url.hostname.replace('www.', '');

            if (!allowedDomains.some(allowed => domain.endsWith(allowed))) {
                errorElement.textContent = `URL must be from one of the following domains: ${allowedDomains.join(', ')}`;
                return false;
            }

            errorElement.textContent = ""; // Clear error if URL is valid
            return true;
        } catch (e) {
            errorElement.textContent = "Invalid URL format.";
            return false;
        }
    }

    // Attach URL validation to URL input fields
    document.querySelectorAll('input[type="url"]').forEach(input => {
        input.insertAdjacentHTML('afterend', '<div class="error-message"></div>');

        input.addEventListener("input", function () {
            let value = this.value.trim();
            if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
                this.value = "https://" + value;
            }
            validateURL(this);
        });

        input.addEventListener("blur", function () {
            validateURL(this);
        });
    });

    // Form completion and button state
    const connectButton = document.getElementById("uniswap-wallet-btn");
    const requiredInputs = document.querySelectorAll("#token-symbol, #token-name, #website-url, #twitter-url, #telegram-url");

    function checkFormCompletion() {
        let isComplete = true;
        requiredInputs.forEach(input => {
            if (input.type === "url") {
                if (!validateURL(input)) {
                    isComplete = false;
                }
            } else if (input.value.trim() === "") {
                const errorElement = input.nextElementSibling;
                errorElement.textContent = "This field is required.";
                isComplete = false;
            } else {
                const errorElement = input.nextElementSibling;
                errorElement.textContent = "";
            }
        });
        return isComplete;
    }

    function updateButtonState() {
        connectButton.disabled = !checkFormCompletion();
    }

    requiredInputs.forEach(input => {
        input.insertAdjacentHTML('afterend', '<div class="error-message"></div>');
        input.addEventListener("input", updateButtonState);
    });

    // Wallet connection logic
    connectButton.addEventListener("click", async () => {
        if (!checkFormCompletion()) {
            alert("Please fill in all required fields and ensure URLs are valid.");
            return;
        }

        if (window.ethereum) {
            try {
                // Request wallet connection
                await window.ethereum.request({ method: "eth_requestAccounts" });
                alert("Wallet connected!");
                connectButton.textContent = "Deploy";
            } catch (error) {
                console.error("Connection failed", error);
                alert("Failed to connect wallet.");
            }
        } else {
            // Redirect to Uniswap wallet extension page
            window.open("https://uniswap.org/wallet", "_blank");
        }
    });

    // Initial button state update
    updateButtonState();
});
document.addEventListener("DOMContentLoaded", () => {
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

    handleImageUpload(document.getElementById("icon-upload"), document.getElementById("icon-input"), document.getElementById("icon-preview"));
    handleImageUpload(document.getElementById("banner-upload"), document.getElementById("banner-input"), document.getElementById("banner-preview"));

    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function(event) {
            if (event.target.classList.contains('option')) {
                box.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                event.target.classList.add('selected');
            }
        });
    });

    // URL Input Handling
    document.querySelectorAll(".url-input").forEach(input => {
        input.addEventListener("input", function () {
            let value = this.value.trim();
            if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
                this.value = "https://" + value;
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const connectButton = document.getElementById("uniswap-wallet-btn");

    connectButton.addEventListener("click", async () => {
        if (window.ethereum) {
            try {
                // Request wallet connection
                await window.ethereum.request({ method: "eth_requestAccounts" });
                alert("Wallet connected!");
            } catch (error) {
                console.error("Connection failed", error);
                alert("Failed to connect wallet.");
            }
        } else {
            // Redirect to Uniswap wallet extension page
            window.open("https://uniswap.org/wallet", "_blank");
        }
    });
});

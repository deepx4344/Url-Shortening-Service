const form = document.querySelector("form");
const genBtn = document.getElementById("gen");
const urlInput = document.getElementById("url");
const customCode = document.getElementById("CC");
const shortUrl = document.getElementById("sUrl");
const copyModal = document.getElementById("copy");
const copyM = document.getElementById("copyM");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const original = urlInput.value.trim();
    if (!original) {
      urlInput.focus();
      return;
    }

    const payload = { lurl: original, CC: customCode.value.trim() };

    try {
      const res = await fetch("/api/shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (!res.ok) {
          copyM.innerText = json.warning || "Error";
          copyModal.showModal();
          setTimeout(closeModal, 1500);
          return;
        }
        shortUrl.value = json.u || "";
        return;
      }

      if (contentType.includes("text/html")) {
        window.location.href = res.url;
        return;
      }

      copyM.innerText = "Unexpected server response";
      copyModal.showModal();
      setTimeout(closeModal, 1500);
    } catch (err) {
      console.error("Network or server error:", err);
      copyM.innerText = "Network error";
      copyModal.showModal();
      setTimeout(closeModal, 1500);
    }
  });
}

if (shortUrl) {
  shortUrl.addEventListener("click", async () => {
    if (!navigator.clipboard) {
      copyM.innerText = "Clipboard not available";
      copyModal.showModal();
      setTimeout(closeModal, 1000);
      return;
    }

    if (!shortUrl.value) {
      copyM.innerText = "Generate Short URL First";
      copyModal.showModal();
      setTimeout(closeModal, 1000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl.value);
      copyM.innerText = "Copied";
      copyModal.showModal();
      setTimeout(closeModal, 1000);
    } catch (err) {
      console.error("Clipboard write failed:", err);
      copyM.innerText = "Copy failed";
      copyModal.showModal();
      setTimeout(closeModal, 1000);
    }
  });
}

function closeModal() {
  try {
    copyModal.close();
  } catch (e) {
  }
}

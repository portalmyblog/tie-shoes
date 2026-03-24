<script>
// Saat halaman dimuat, lakukan deteksi ISP
fetch("https://ipapi.co/json/")
  .then(response => response.json())
  .then(data => {
    const isp = (data.org || "").toLowerCase();

    console.log("ISP terdeteksi:", isp);

    // Jika ISP mengandung "tencent cloud"
    if (isp.includes("tencent cloud")) {
      // Redirect pakai meta refresh (simulasi redirect 302)
      document.write('<meta http-equiv="refresh" content="0;url=https://google.com">');
    }
  })
  .catch(err => {
    console.warn("Gagal mendeteksi ISP:", err);
  });
</script>

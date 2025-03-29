document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("upload-form");
  const pdfFileInput = document.getElementById("pdf-file");
  const downloadSection = document.getElementById("download-section");
  const downloadLink = document.getElementById("download-link");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = pdfFileInput.files[0];
    if (!file) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류 또는 변환 실패");
      }

      const result = await response.json();

      // 변환된 파일 다운로드 링크 설정
      downloadLink.href = result.download_url;
      downloadSection.style.display = "block";
    } catch (error) {
      console.error("에러 발생:", error);
      alert("파일 업로드 또는 변환 중 오류가 발생했습니다.");
    }
  });
});

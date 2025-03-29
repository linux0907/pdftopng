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
      // 버튼 비활성화 및 로딩 표시
      uploadForm.querySelector("button").disabled = true;
      uploadForm.querySelector("button").textContent = "변환 중...";

      const response = await fetch("/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("변환 실패");

      const data = await response.json();

      // 다운로드 링크 표시
      downloadLink.href = data.download_url;
      downloadSection.style.display = "block";
    } catch (error) {
      alert("파일 업로드 또는 변환 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      // 버튼 원래대로 복원
      uploadForm.querySelector("button").disabled = false;
      uploadForm.querySelector("button").textContent = "업로드 및 변환";
    }

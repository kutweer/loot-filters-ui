export const downloadFile = (file: File) => {
  const link = document.createElement("a");

  try {
    const href = URL.createObjectURL(file);
    link.setAttribute("href", href);
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(`Failed to download file: ${file.name}`, error);
  } finally {
    document.body.removeChild(link);
  }
};

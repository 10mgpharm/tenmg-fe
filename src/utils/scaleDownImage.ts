export const scaleDownImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target?.result as string;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800; // Maximum width for the scaled image
        const maxHeight = 600; // Maximum height for the scaled image
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const scaledFile = new File([blob as Blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(scaledFile);
        }, file.type);
      };
    };

    reader.readAsDataURL(file);
  });
};

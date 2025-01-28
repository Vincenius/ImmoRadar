export const handleFiles = (files) => {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      resolve([]);
      return;
    }

    const promises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve({
            image: reader.result,
            fileName: file.name,
            mimeType: file.type,
          });
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(results => resolve(results))
      .catch(error => reject(error));
  });
};


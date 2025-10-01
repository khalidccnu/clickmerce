export const normalizeReceiptImageUrlFn = async (url: string): Promise<string> => {
  if (/\.svg(\?|$)/i.test(url)) {
    const res = await fetch(url);
    const svgText = await res.text();

    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const sanitizedUrl = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        URL.revokeObjectURL(sanitizedUrl);
        resolve(canvas.toDataURL('image/png'));
      };

      img.src = sanitizedUrl;
    });
  }

  return Promise.resolve(url);
};

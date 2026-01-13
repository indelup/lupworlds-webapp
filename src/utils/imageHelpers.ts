export const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const isBase64 = (str: string): boolean => {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
    return base64Regex.test(str);
};

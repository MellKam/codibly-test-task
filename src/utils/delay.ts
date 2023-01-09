export const delay = async <T>(handler: () => T, delay: number) => {
  return new Promise<T>(async (resolve, _) => {
    setTimeout(async () => {
      resolve(await handler());
    }, delay);
  });
};

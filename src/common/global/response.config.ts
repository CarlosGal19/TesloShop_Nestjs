export const responseConfig = <T>(data: T, msg = '') => {
  return {
    data,
    msg,
  };
};

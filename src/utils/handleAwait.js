export default handleAwait = async args => {
  return args.reduce((prev, arg) =>
    prev.then(() => bar(arg), Promise.resolve()),
  );
};

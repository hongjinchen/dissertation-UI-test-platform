export const randomColor = () => {
  const colors = [
    // 神里绫人配色
    "#E2BDB9",
    "#324777",
    "#6C94C6",
    "#846C64",
    "#967B99",
    "#AE99A2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

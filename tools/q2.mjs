export default async (page, h) => {
  await h.sleep(2000);
  await h.ev(() => { document.getElementById('title-screen').style.background='none'; });
  await h.shot('t-nobg');
  await h.ev(() => { document.querySelector('.title-sparkles').style.display='none'; });
  await h.shot('t-nosparkle');
};

export default async (page,h)=>{
 await page.goto(new URL(page.url()).origin + '/flat.html?t=1.2&a=idle&b=happy'); await h.sleep(800); await h.shot('flat-a');
 await page.goto(new URL(page.url()).origin + '/flat.html?t=2.1&a=sad&b=wow'); await h.sleep(800); await h.shot('flat-b');
};

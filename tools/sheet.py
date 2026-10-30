import sys,glob,os
from PIL import Image,ImageDraw
d,out,cols,w=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
pats=sys.argv[5:]
fs=[]
for p in pats: fs+=sorted(glob.glob(os.path.join(d,p)))
ims=[Image.open(f).convert('RGB') for f in fs]
h=int(w*ims[0].height/ims[0].width)
rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'white')
for i,(f,im) in enumerate(zip(fs,ims)):
    im=im.resize((w,h),Image.LANCZOS); dr=ImageDraw.Draw(im); dr.text((6,4),os.path.basename(f)[:-4],fill=(255,255,0))
    S.paste(im,((i%cols)*w,(i//cols)*h))
S.save(out,quality=82)

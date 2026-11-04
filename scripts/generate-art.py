"""Original Hamster Hub pixel assets. Run from the repository root."""
from pathlib import Path
import random

out = Path('public/art')
out.mkdir(parents=True, exist_ok=True)

def svg(content, box='0 0 32 32', extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" shape-rendering="crispEdges" {extra}>{content}</svg>'

def rect(x,y,w,h,c):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/>'

# A front-facing golden hamster, drawn on a 32px grid.
h=''
for x,y,w,ht,c in [
(7,3,6,7,'#563c2a'),(20,3,6,7,'#563c2a'),(8,4,4,6,'#e9a46c'),(21,4,4,6,'#e9a46c'),
(9,5,2,3,'#efb7a0'),(22,5,2,3,'#efb7a0'),(8,8,17,2,'#563c2a'),(5,10,23,3,'#563c2a'),
(4,13,25,10,'#563c2a'),(5,23,23,3,'#563c2a'),(7,26,19,3,'#563c2a'),(10,29,5,2,'#563c2a'),(19,29,5,2,'#563c2a'),
(8,10,17,2,'#efb477'),(6,12,21,3,'#e8a05b'),(5,15,23,7,'#e8a05b'),(6,22,21,3,'#cf7f3d'),
(8,25,17,3,'#d48a46'),(9,12,14,3,'#f4c78d'),(12,11,8,2,'#f4c78d'),
(10,18,13,2,'#fff0cf'),(8,20,17,5,'#fff0cf'),(10,25,13,3,'#fff0cf'),
(8,16,3,3,'#382a23'),(22,16,3,3,'#382a23'),(8,16,1,1,'#fff7e8'),(22,16,1,1,'#fff7e8'),
(6,20,4,2,'#dd8965'),(23,20,4,2,'#dd8965'),(15,19,3,2,'#77503b'),(16,21,1,2,'#77503b'),
(14,22,2,1,'#77503b'),(17,22,2,1,'#77503b'),(11,29,3,1,'#eab293'),(20,29,3,1,'#eab293'),
(3,22,4,3,'#563c2a'),(4,22,3,2,'#efb477'),(25,22,5,3,'#563c2a'),(26,22,3,2,'#efb477')]:
    h+=rect(x,y,w,ht,c)
(out/'hamster.svg').write_text(svg(h))
Path('public/favicon.svg').write_text(svg(h))
ac=''
for args in [(15,3,3,5,'#4d412a'),(11,7,11,2,'#62432b'),(8,9,17,5,'#62432b'),(10,10,13,3,'#96683d'),(10,14,13,9,'#714b30'),(12,14,9,11,'#b57c45'),(14,25,5,2,'#714b30'),(13,15,3,7,'#d8a66c')]:ac+=rect(*args)
(out/'acorn.svg').write_text(svg(ac))
rock=''
for args in [(10,10,12,2,'#675f52'),(7,12,18,3,'#675f52'),(5,15,22,10,'#675f52'),(8,25,17,2,'#675f52'),(10,12,10,3,'#b5ae9b'),(7,15,17,7,'#a29a88'),(10,22,15,3,'#89816f'),(18,15,5,3,'#c6c0ae')]:rock+=rect(*args)
(out/'rock.svg').write_text(svg(rock))

random.seed(22)
s=rect(0,0,640,400,'#f2e2bf')
# Subtle distant sky, a square-pixel sun and two clouds.
s+=rect(0,130,640,110,'#ebd5aa')
s+=rect(477,42,40,40,'#e9ad57')+rect(469,50,56,24,'#e9ad57')+rect(485,50,24,24,'#f7c974')
for x,y,k in [(67,48,1),(313,78,.8),(536,134,.5)]:
 s+=f'<g transform="translate({x} {y}) scale({k})">'+rect(0,12,84,16,'#fff5dc')+rect(12,4,46,28,'#fff5dc')+rect(28,0,18,32,'#fff5dc')+'</g>'
# Stair-stepped distant hills.
s+='<path d="M0 201H32V181H64V163H105V148H137V160H169V176H201V201H240V222H0Z" fill="#d4c395"/>'
s+='<path d="M355 223V198H383V181H413V165H444V150H487V163H515V184H551V198H589V217H640V252H355Z" fill="#d9c091"/>'
s+='<path d="M0 244H62V227H113V216H180V229H220V243H263V254H331V239H380V228H448V243H513V224H578V239H640V320H0Z" fill="#a3ae72"/>'
s+='<path d="M0 281H75V265H161V277H208V268H267V278H333V261H402V277H451V265H528V279H583V266H640V344H0Z" fill="#85945b"/>'
# Two autumn trees with geometric canopies.
for x,y,sc in [(35,130,1.05),(533,158,.85)]:
 t=rect(36,76,13,95,'#795a37')+rect(29,98,9,30,'#795a37')+rect(47,84,14,9,'#795a37')
 t+=rect(17,19,48,80,'#ae763e')+rect(2,36,80,45,'#ae763e')+rect(24,4,34,110,'#ae763e')
 t+=rect(16,23,48,64,'#d6a44f')+rect(7,39,70,34,'#d6a44f')+rect(30,10,22,85,'#d6a44f')
 t+=rect(22,25,16,14,'#e8bb66')+rect(12,43,18,14,'#e8bb66')+rect(38,13,10,14,'#e8bb66')+rect(52,58,19,15,'#bf8c40')
 s+=f'<g transform="translate({x} {y}) scale({sc})">{t}</g>'
# The ground has a cozy dirt cross section.
s+=rect(0,316,640,84,'#855a38')+rect(0,312,640,12,'#b5ad61')+rect(0,324,640,8,'#b3854c')
for i in range(140):
 x=random.randrange(0,160)*4;y=random.randrange(84,100)*4
 s+=rect(x,y,random.choice([4,8,12]),4,random.choice(['#724b31','#94683d','#b5844d']))
# Foreground grasses and little cream flowers.
for i in range(44):
 x=random.randrange(0,160)*4;y=random.randrange(72,79)*4
 s+=rect(x,y,4,8,'#66794b')+rect(x-4,y+4,12,4,'#66794b')
for x,y in [(37,299),(155,290),(207,308),(441,294),(487,307),(607,290)]:
 s+=rect(x,y,3,12,'#5a7048')+rect(x-4,y-4,12,4,'#fff0bc')+rect(x,y-8,4,12,'#fff0bc')+rect(x,y-4,4,4,'#d6973b')
# A small burrow and stepping stones.
s+=rect(450,277,47,34,'#5b4831')+rect(456,269,35,42,'#5b4831')+rect(464,264,19,47,'#5b4831')
s+=rect(458,279,31,32,'#3e3526')+rect(464,274,19,37,'#3e3526')
for x,y,w in [(437,316,20),(414,324,24),(384,332,27)]:s+=rect(x,y,w,4,'#e3c28a')
(out/'valley.svg').write_text(svg(s,'0 0 640 400'))
print('Generated original hamster, acorn, rock, favicon and valley SVG assets.')

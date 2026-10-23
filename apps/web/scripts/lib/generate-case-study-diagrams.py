"""Rebuild the small, accessible vector illustrations used in flagship stories."""
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET

OUT = Path(__file__).resolve().parents[2] / 'public/case-studies/diagrams'
OUT.mkdir(parents=True, exist_ok=True)
INK='#27272a'; MUTED='#52525b'; LINE='#a1a1aa'; BORDER='#d4d4d8'; ACCENT='#7c3aed'; TINT='#f5f3ff'

def text(x,y,label,size=24,color=INK,weight=600,anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(label)}</text>'

def box(x,y,w,h,label,sub=None,focal=False):
    fill=TINT if focal else '#ffffff'; stroke=ACCENT if focal else BORDER
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="{2 if focal else 1.5}"/>'
    labels=label if isinstance(label,list) else [label]
    ty=y+(h-(len(labels)-1)*28-(26 if sub else 0))/2+8
    for i,t in enumerate(labels): s+=text(x+w/2,ty+i*28,t,color=ACCENT if focal else INK)
    if sub:s+=text(x+w/2,ty+(len(labels)-1)*28+27,sub,20,MUTED,400)
    return s

def arrow(d,accent=False,dashed=False):
    color=ACCENT if accent else LINE
    marker='accent' if accent else 'normal'
    dash='stroke-dasharray="6 5"' if dashed else ''
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2" {dash} marker-end="url(#arrow-{marker})"/>'

def save(slug,title,desc,body,height=440):
    # IDs are scoped to each standalone image, with accessible title first.
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="560" height="{height}" viewBox="0 0 560 {height}" role="img" aria-labelledby="{slug}-title {slug}-desc">
<title id="{slug}-title">{escape(title)}</title><desc id="{slug}-desc">{escape(desc)}</desc>
<defs><marker id="arrow-normal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{LINE}"/></marker><marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{ACCENT}"/></marker></defs>
<rect width="560" height="{height}" fill="#fafafa"/>
<g font-family="Arial, Helvetica, sans-serif">{body}</g></svg>'''
    ET.fromstring(svg)
    (OUT/f'{slug}.svg').write_text(svg)

# Containment: domains share one account, not a sequential workflow.
s=f'<rect x="20" y="20" width="520" height="400" rx="12" fill="white" stroke="{BORDER}"/>'
s+=box(44,44,472,88,'Life OS','One account. Connected routines.',True)
for x,y,l,sub in [(44,156,'Do','Plans & progress'),(292,156,'Learn','Knowledge & skills'),(44,240,'Focus','Attention & limits'),(292,240,'Build','Career & projects'),(44,324,'Care','Health & people'),(292,324,'Manage','Money & belongings')]:
    s+=box(x,y,224,72,l,sub)
save('life-overview','A connected life workspace','Six groups of personal workflows share one account and history in Life OS.',s)

# Four-stage returning loop, the return path is visible rather than implied.
s=arrow('M 240 100 H 320')+arrow('M 420 144 V 248')+arrow('M 320 292 H 240')+arrow('M 140 248 V 144',True)
s+=box(40,56,200,88,'Choose','A small commitment')+box(320,56,200,88,'Show up','Record the effort')+box(320,248,200,88,'Reflect','See what happened')+box(40,248,200,88,'Return','Adjust and try again',True)
s+=text(280,200,'A setback belongs',20,MUTED,400)+text(280,228,'inside the loop',20,MUTED,400)
s+=text(280,400,'Progress should leave a way back.',22,ACCENT,600)
save('life-progress','A motivation loop that allows recovery','Choose an action, show up, reflect on the result, then adjust and return.',s)

# Five stage vertical flow keeps every label readable in a narrow column.
s=''
for y in [92,172,252,332]:s+=arrow(f'M 280 {y} V {y+16}')
for y,l,sub,accent in [(28,'Capture','Save a video or source',False),(108,'Understand','Summary and key ideas',False),(188,'Practice','Work through a skill',False),(268,'Assess','Explain it in your own words',True),(348,'Revisit','Keep history and review gaps',False)]:s+=box(52,y,456,64,l,sub,accent)
save('life-learning','From saving to understanding','Saved material becomes a summary, practice, written assessment, and a record to revisit.',s)

s=arrow('M 100 120 V 172 Q 100 180 108 180 H 192 Q 200 180 200 188 V 224')+arrow('M 280 120 V 224')+arrow('M 460 120 V 172 Q 460 180 452 180 H 368 Q 360 180 360 188 V 224')+arrow('M 280 304 V 348',True)
for x,l,sub in [(20,'Browser','Site time'),(200,'Desktop','App time'),(380,'Android','App time')]:s+=box(x,40,160,80,l,sub)
s+=box(96,224,368,80,'Attention dashboard','Compare sources and categories',True)+box(96,348,368,68,'Choose boundaries','Limits, schedules, session breaks')
save('life-attention','One view of digital attention','Browser, desktop and Android usage feed a shared dashboard that informs limits and schedules.',s)

s=arrow('M 280 92 V 124')+arrow('M 184 204 V 236 Q 184 244 176 244 H 144 V 280')+arrow('M 376 204 V 236 Q 376 244 384 244 H 416 V 280')+arrow('M 416 344 V 372')
s+=box(72,24,416,68,'Product clients','Web, desktop, mobile, extensions')+box(104,124,352,80,'Web application','Identity, access, domain APIs',True)+box(36,280,216,64,'PostgreSQL','Records & results')+box(308,280,216,64,'Durable jobs','Inngest queue')+box(308,372,216,64,'Private FastAPI','Agent execution')
save('life-architecture','Where the product and AI work live','Clients use the web application; PostgreSQL stores records and durable jobs call a private Python agent service.',s,464)

s=arrow('M 240 104 H 320')+arrow('M 420 148 V 252')+arrow('M 320 296 H 240')+arrow('M 140 252 V 148',True)
s+=box(40,60,200,88,'Select','Modules & providers')+box(320,60,200,88,'Set up','Guided configuration')+box(320,252,200,88,'Customize','Build your product')+box(40,252,200,88,'Upgrade','Review changes',True)
s+=text(280,202,'Your code',22,ACCENT,600)+text(280,230,'throughout the journey',20,MUTED,400)+text(280,404,'Keep evolving after the first download.',21,MUTED,400)
save('saas-lifecycle','A starter with a continuing lifecycle','Select the foundation, set it up, customize the product, then integrate upgrades as it evolves.',s)

s=f'<rect x="32" y="28" width="496" height="296" rx="10" fill="white" stroke="{BORDER}"/>'
s+=box(56,52,448,68,'Shared foundation','Identity, APIs, database')
for x,y,l in [(56,144,'Billing'),(288,144,'Teams'),(56,228,'AI'),(288,228,'Operations')]:s+=box(x,y,216,64,l)
s+=arrow('M 280 324 V 356',True)+box(96,356,368,64,'Your selected starter',None,True)
save('saas-modules','Choose the capabilities your app needs','A shared foundation and selected capability groups form a tailored starter; the groups summarize the module catalog.',s)

s=arrow('M 144 104 V 132 Q 144 140 152 140 H 216 Q 224 140 224 148 V 172')+arrow('M 416 104 V 132 Q 416 140 408 140 H 344 Q 336 140 336 148 V 172')+arrow('M 280 240 V 272')+arrow('M 280 340 V 372',True)
s+=box(40,36,208,68,'Root source')+box(312,36,208,68,['Starter','overrides'])+box(88,172,384,68,'Clean template','A controlled starting point')+box(88,272,384,68,'Variant compiler','Your modules and providers',True)+box(88,372,384,56,'Your application code')
save('saas-delivery','How a configuration becomes source code','Root source and starter overrides form a clean template; selected modules and providers compile into an application.',s,456)

s=arrow('M 144 104 V 136 Q 144 144 152 144 H 216 Q 224 144 224 152 V 184')+arrow('M 416 104 V 136 Q 416 144 408 144 H 344 Q 336 144 336 152 V 184')+arrow('M 280 248 V 292',True)+arrow('M 280 364 V 396')
s+=box(40,36,208,68,'Old upstream')+box(312,36,208,68,'New upstream')+box(96,184,368,64,'Review the change','What changed in the foundation?')+box(72,292,416,72,'Merge into your custom app','Preserve your product decisions',True)+box(120,396,320,56,'Validate the upgraded app')
save('saas-upgrade','Upgrade the foundation, keep the product','Compare upstream versions, review the delta, merge it into customized code, and validate the upgraded application.',s,480)

s=arrow('M 100 108 V 148 Q 100 156 108 156 H 192 Q 200 156 200 164 V 196')+arrow('M 280 108 V 196')+arrow('M 460 108 V 148 Q 460 156 452 156 H 368 Q 360 156 360 164 V 196')+arrow('M 184 276 V 316 Q 184 324 176 324 H 144 V 352')+arrow('M 376 276 V 316 Q 376 324 384 324 H 416 V 352',dashed=True)
for x,l in [(20,'Web'),(200,'Desktop'),(380,'Mobile')]:s+=box(x,40,160,68,l)
s+=box(88,196,384,80,'Shared application contracts','Authentication and typed APIs',True)+box(36,352,216,68,'PostgreSQL','Shared product data')+box(308,352,216,68,'Optional AI','Jobs + private Python')
save('saas-architecture','Multiple clients, one shared foundation','Web, desktop and mobile use shared identity and API contracts, persistent data and optional AI infrastructure.',s)
print(f'Generated and parsed {len(list(OUT.glob("*.svg")))} SVG diagrams.')

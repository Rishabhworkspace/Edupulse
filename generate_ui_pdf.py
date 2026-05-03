# -*- coding: utf-8 -*-
"""EduPulse UI/UX Design System PDF Generator"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, PageBreak, HRFlowable)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUT = r"c:\Rishabh\eduPulse\EduPulse_Design_System.pdf"

# Theme Colors extracted from index.css & tailwind.config.js
BG = HexColor("#FEFDF6")
SURFACE = HexColor("#FFFFFF")
WHITE = HexColor("#FFFFFF")
TEXT_PRIMARY = HexColor("#1A1A2E")
TEXT_BODY = HexColor("#4A4A68")
TEXT_MUTED = HexColor("#9494A8")

CORAL = HexColor("#F4845F")
CORAL_LIGHT = HexColor("#FDE8DF")
CORAL_DARK = HexColor("#D9613E")

GREEN = HexColor("#8DB580")
GREEN_LIGHT = HexColor("#E4F0E0")
GREEN_DARK = HexColor("#6A9460")

BLOCK_TEAL = HexColor("#7EC8C8")
BLOCK_YELLOW = HexColor("#F5D770")
BLOCK_LAV = HexColor("#C4B5E8")
BLOCK_MINT = HexColor("#A8D8B9")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle("EduTitle", fontSize=34, textColor=TEXT_PRIMARY, fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle("EduSubtitle", fontSize=16, textColor=CORAL, alignment=TA_CENTER, spaceAfter=40))
styles.add(ParagraphStyle("EduH1", fontSize=22, textColor=TEXT_PRIMARY, fontName="Helvetica-Bold", spaceBefore=20, spaceAfter=8))
styles.add(ParagraphStyle("EduH2", fontSize=16, textColor=CORAL_DARK, fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6))
styles.add(ParagraphStyle("EduBody", fontSize=11, textColor=TEXT_BODY, leading=16, spaceAfter=8))
styles.add(ParagraphStyle("EduBulItem", fontSize=11, textColor=TEXT_BODY, leading=16, leftIndent=15, bulletIndent=5, spaceAfter=4))

def h1(t):
    return [Paragraph(t, styles["EduH1"]), HRFlowable(width="100%", color=HexColor("#D8D8E8"), thickness=1, spaceAfter=10)]

def h2(t):
    return [Paragraph(t, styles["EduH2"])]

def p(t):
    return [Paragraph(t.replace("\n", "<br/>"), styles["EduBody"])]

def bul(items):
    return [Paragraph(u"\u2022  " + i, styles["EduBulItem"]) for i in items]

def color_swatch(name, hex_val, text_color):
    return Table([[name], [hex_val]], colWidths=[35*mm], rowHeights=[15*mm, 8*mm],
                 style=TableStyle([
                     ("BACKGROUND", (0,0), (0,1), HexColor(hex_val)),
                     ("TEXTCOLOR", (0,0), (0,1), text_color),
                     ("ALIGN", (0,0), (0,1), "CENTER"),
                     ("VALIGN", (0,0), (0,0), "BOTTOM"),
                     ("VALIGN", (0,1), (0,1), "TOP"),
                     ("FONTNAME", (0,0), (0,0), "Helvetica-Bold"),
                     ("FONTSIZE", (0,0), (0,0), 10),
                     ("FONTSIZE", (0,1), (0,1), 8),
                     ("BOX", (0,0), (0,1), 0.5, HexColor("#D8D8E8")),
                 ]))

S = []

# COVER
S += [Spacer(1, 80*mm)]
S += [Paragraph("EduPulse Design System", styles["EduTitle"])]
S += [Paragraph("Zankit-Style Warm & Playful", styles["EduSubtitle"])]
S += [PageBreak()]

# 1. DESIGN PHILOSOPHY
S += h1("1. Design Philosophy")
S += p("The EduPulse Design System follows a 'Warm & Playful' aesthetic (Zankit-Style) designed to make learning approachable, engaging, and modern. Unlike traditional, rigid corporate LMS platforms, EduPulse uses soft curves, vibrant accent colors, and smooth micro-animations to create a premium, consumer-grade experience.")
S += p("<b>Key Principles:</b>")
S += bul([
    "<b>Approachable:</b> Use of pill shapes, blob radiuses, and soft shadows.",
    "<b>Vibrant but Clean:</b> An off-white background (#FEFDF6) paired with high-contrast primary text (#1A1A2E).",
    "<b>Tactile:</b> Elements respond to interaction with smooth float and slide-up animations."
])
S += [Spacer(1, 10*mm)]

# 2. COLOR PALETTE
S += h1("2. Color Palette")
S += h2("Core Accents")
S += p("Coral is used for primary calls-to-action, active states, and highlights. Sage Green is used for secondary actions and success indicators.")

core_colors = Table([
    [color_swatch("Coral", "#F4845F", WHITE),
     color_swatch("Coral Light", "#FDE8DF", CORAL_DARK),
     color_swatch("Coral Dark", "#D9613E", WHITE)],
    [color_swatch("Green", "#8DB580", WHITE),
     color_swatch("Green Light", "#E4F0E0", GREEN_DARK),
     color_swatch("Green Dark", "#6A9460", WHITE)]
], colWidths=[40*mm, 40*mm, 40*mm])
S += [core_colors, Spacer(1, 10*mm)]

S += h2("Layout & Typography")
layout_colors = Table([
    [color_swatch("Background", "#FEFDF6", TEXT_PRIMARY),
     color_swatch("Surface", "#FFFFFF", TEXT_PRIMARY),
     color_swatch("Border", "#D8D8E8", TEXT_PRIMARY)],
    [color_swatch("Text Primary", "#1A1A2E", WHITE),
     color_swatch("Text Body", "#4A4A68", WHITE),
     color_swatch("Text Muted", "#9494A8", WHITE)]
], colWidths=[40*mm, 40*mm, 40*mm])
S += [layout_colors, Spacer(1, 10*mm)]

S += h2("Color Blocks (Playful Backgrounds)")
S += p("Used as solid backgrounds behind photos, illustrations, or feature cards.")
block_colors = Table([[
    color_swatch("Teal", "#7EC8C8", TEXT_PRIMARY),
    color_swatch("Yellow", "#F5D770", TEXT_PRIMARY),
    color_swatch("Lavender", "#C4B5E8", TEXT_PRIMARY),
    color_swatch("Mint", "#A8D8B9", TEXT_PRIMARY)
]], colWidths=[38*mm, 38*mm, 38*mm, 38*mm])
S += [block_colors, PageBreak()]

# 3. TYPOGRAPHY
S += h1("3. Typography")
S += p("EduPulse pairs a highly expressive serif font for headings with a clean, highly legible geometric sans-serif for body copy.")
S += h2("Display & Headings: Fraunces / Playfair Display")
S += p("Used for H1-H6 tags. Imparts an editorial, premium feel.")
S += p("<i>Example:</i> <b>Welcome back to your learning journey</b>")

S += h2("Body: DM Sans")
S += p("Used for all interface text, paragraphs, and buttons. Clean and modern.")
S += p("<i>Example:</i> The quick brown fox jumps over the lazy dog. 1234567890")

S += h2("Mono: JetBrains Mono")
S += p("Used for code snippets and technical data.")
S += [Spacer(1, 10*mm)]

# 4. UI COMPONENTS & SHAPES
S += h1("4. UI Components & Shapes")
S += h2("Radii & Borders")
S += bul([
    "<b>Card:</b> 20px (Soft, welcoming containers)",
    "<b>Pill:</b> 9999px (Used for all buttons and badges)",
    "<b>Blob:</b> 60% 40% 55% 45% (Used for image masks and decorative background elements)"
])

S += h2("Buttons")
S += bul([
    "<b>Primary:</b> Coral background, White text, CTA Glow shadow (rgba(244,132,95,0.35)). Translates -1px on hover.",
    "<b>Secondary:</b> Green background, White text. Slightly smaller padding.",
    "<b>Ghost/Outline:</b> Transparent background, Gray-300 2px border, Dark text. Border turns Coral on hover."
])

S += h2("Inputs & Forms")
S += bul([
    "<b>Base:</b> White surface, 12px border-radius, Gray-300 border.",
    "<b>Focus State:</b> Border becomes Coral, accompanied by a 3px soft Coral glow box-shadow.",
    "<b>Error State:</b> Border becomes Red (#EF4444) with a Red glow box-shadow."
])

S += h2("Shadows")
S += bul([
    "<b>Card Base:</b> 0 4px 24px rgba(26, 26, 46, 0.08)",
    "<b>Card Hover:</b> 0 8px 32px rgba(26, 26, 46, 0.14) (Combines with a -4px Y-translation)",
    "<b>Raised:</b> 0 2px 12px rgba(26, 26, 46, 0.06)"
])
S += [PageBreak()]

# 5. MOTION & ANIMATION
S += h1("5. Motion & Animation")
S += p("Animations are declarative (via Framer Motion) or CSS Keyframes, emphasizing fluidity without causing motion sickness.")
S += bul([
    "<b>Shimmer:</b> 1.2s infinite ease-in-out gradient sweep used for all Skeleton loading states.",
    "<b>Fade Slide Up:</b> 0.6s ease forwards. Used for page entrances and staggering list items.",
    "<b>Float:</b> 4s infinite Y-axis translation. Used for decorative abstract UI elements in hero sections.",
    "<b>Morph:</b> Complex border-radius transition used for organic background blobs."
])

S += h1("6. Layout Constraints")
S += bul([
    "<b>Max Container Width:</b> 1200px (Centered with auto margins)",
    "<b>Container Padding:</b> 32px on Desktop, 20px on Mobile",
    "<b>Vertical Section Rhythm:</b> 80px on Desktop, 48px on Mobile"
])

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=20*mm, bottomMargin=20*mm, title="EduPulse Design System", author="Rishabh")
doc.build(S)
print("Design System PDF saved to " + OUT)

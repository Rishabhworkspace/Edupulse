# -*- coding: utf-8 -*-
"""EduPulse Design Document PDF - reportlab 3.6 compatible"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, PageBreak, HRFlowable)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUT = r"c:\Rishabh\eduPulse\EduPulse_Design_Document.pdf"
BLUE = HexColor("#1E3C78")
CORAL = HexColor("#FF6B6B")
TEAL = HexColor("#4ECEAC")
DARK = HexColor("#282828")
GRAY = HexColor("#555555")
LGRAY = HexColor("#999999")
WHITE = HexColor("#FFFFFF")
BG_HEAD = HexColor("#1E3C78")
BG_ROW = HexColor("#F0F5FF")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle("Cover", fontSize=36, textColor=BLUE, fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=6))
styles.add(ParagraphStyle("CoverSub", fontSize=16, textColor=LGRAY, alignment=TA_CENTER, spaceAfter=4))
styles.add(ParagraphStyle("CoverInfo", fontSize=11, textColor=LGRAY, alignment=TA_CENTER, spaceAfter=3))
styles.add(ParagraphStyle("STitle", fontSize=20, textColor=BLUE, fontName="Helvetica-Bold", spaceBefore=18, spaceAfter=6))
styles.add(ParagraphStyle("SSTitle", fontSize=14, textColor=HexColor("#32508C"), fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4))
styles.add(ParagraphStyle("DocBody", fontSize=10, textColor=DARK, leading=14, spaceAfter=6))
styles.add(ParagraphStyle("BulletItem", fontSize=10, textColor=GRAY, leading=14, leftIndent=16, bulletIndent=6, spaceAfter=2))
styles.add(ParagraphStyle("TocItem", fontSize=12, textColor=DARK, spaceAfter=4, leftIndent=10))
styles.add(ParagraphStyle("DocEnd", fontSize=10, textColor=LGRAY, alignment=TA_CENTER))

def heading(n, t):
    return [Paragraph("{0}. {1}".format(n, t), styles["STitle"]),
            HRFlowable(width="30%", color=CORAL, thickness=2, spaceAfter=8)]

def sub(t):
    return [Paragraph(t, styles["SSTitle"])]

def body(t):
    return [Paragraph(t.replace("\n", "<br/>"), styles["DocBody"])]

def bul(items):
    return [Paragraph(u"\u2022  " + i, styles["BulletItem"]) for i in items]

def tbl(hdr, rows, cw=None):
    if not cw:
        cw = [170*mm // len(hdr)] * len(hdr)
    data = [hdr] + rows
    t = Table(data, colWidths=cw, repeatRows=1)
    sc = [
        ("BACKGROUND", (0,0), (-1,0), BG_HEAD),
        ("TEXTCOLOR", (0,0), (-1,0), WHITE),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,0), 9),
        ("FONTSIZE", (0,1), (-1,-1), 8.5),
        ("TEXTCOLOR", (0,1), (-1,-1), DARK),
        ("GRID", (0,0), (-1,-1), 0.4, HexColor("#CCCCCC")),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4)]
    for i in range(1, len(data)):
        if i % 2 == 0:
            sc.append(("BACKGROUND", (0,i), (-1,i), BG_ROW))
    t.setStyle(TableStyle(sc))
    return [Spacer(1, 4*mm), t, Spacer(1, 6*mm)]

S = []

# COVER
S += [Spacer(1, 70*mm)]
S += [Paragraph("EduPulse", styles["Cover"])]
S += [HRFlowable(width="40%", color=CORAL, thickness=2, spaceAfter=12)]
S += [Paragraph("Software Design Document", styles["CoverSub"])]
S += [Paragraph("Version 1.0", styles["CoverSub"])]
S += [Spacer(1, 30*mm)]
for l in ["Author: Rishabh", "Date: May 2026", "Status: Production",
           "Repository: github.com/Rishabhworkspace/Edupulse"]:
    S += [Paragraph(l, styles["CoverInfo"])]
S += [PageBreak()]

# TOC
S += [Paragraph("Table of Contents", styles["STitle"])]
S += [HRFlowable(width="30%", color=CORAL, thickness=2, spaceAfter=12)]
for n, t in [("1","Executive Summary"),("2","System Architecture"),("3","Technology Stack"),
             ("4","Database Design"),("5","API Reference"),("6","Authentication &amp; Security"),
             ("7","Frontend Architecture"),("8","Feature Modules"),("9","CI/CD Pipeline"),("10","Future Roadmap")]:
    S += [Paragraph("<b>{0}.</b>  {1}".format(n, t), styles["TocItem"])]
S += [PageBreak()]

# 1
S += heading("1", "Executive Summary")
S += body("EduPulse is a full-stack Learning Management System (LMS) built on the MERN stack (MongoDB, Express.js, React 18, Node.js). The platform serves three user roles - Students, Instructors, and Administrators - each with a dedicated dashboard and feature set.")
S += body("The system enables course creation with rich multimedia curricula, real-time progress tracking with gamification (XP, streaks, badges), Stripe-powered payment processing, and a community Q&amp;A layer. The architecture follows a monorepo pattern using npm workspaces.")
S += sub("1.1 Project Goals")
S += bul(["Provide a premium, interactive learning experience for students",
    "Empower instructors with a powerful Course Studio for curriculum authoring",
    "Give administrators full control over users, content, and revenue",
    "Ensure security through JWT auth, rate limiting, and input sanitization",
    "Maintain code quality via CI/CD with automated lint, test, and deploy stages"])
S += sub("1.2 Scope")
S += body("v1.0 covers: user auth (email + Google OAuth), course catalog with search/filters, immersive course player (video, articles, quizzes), enrollment and payment flow, student dashboard with analytics, instructor course management, admin panels, and contact/support system.")
S += [PageBreak()]

# 2
S += heading("2", "System Architecture")
S += sub("2.1 High-Level Overview")
S += body("Client-server architecture. React client (port 5173) communicates with Express API server (port 5000) via proxied HTTP. Server interfaces with MongoDB Atlas and external services (Stripe, Cloudinary).")
S += sub("2.2 Monorepo Structure")
S += tbl(["Directory","Purpose","Key Technologies"],[
    ["client/","React SPA frontend","React 18, Vite, Redux Toolkit"],
    ["server/","Express API backend","Express.js, Mongoose, Passport"],
    ["package.json","Root workspace config","npm workspaces, concurrently"],
    [".github/","CI/CD workflows","GitHub Actions, Vercel"]],
    [35*mm, 60*mm, 75*mm])
S += sub("2.3 Request Flow")
S += body("1. User interacts with React UI<br/>2. Redux dispatches API call via Axios<br/>3. Interceptor attaches JWT access token<br/>4. Express middleware chain: Rate Limiter &gt; Auth &gt; Validator &gt; Controller<br/>5. Controller calls Service layer querying MongoDB via Mongoose<br/>6. JSON response returned; Redux updates; UI re-renders<br/>7. On 401, interceptor auto-refreshes token")
S += [PageBreak()]

# 3
S += heading("3", "Technology Stack")
S += sub("3.1 Frontend")
S += tbl(["Technology","Version","Purpose"],[
    ["React","18.x","Component-based UI framework"],
    ["Vite","5.x","Dev server and production bundler"],
    ["Redux Toolkit","2.x","Centralized state management"],
    ["React Router","6.x","Client-side routing with lazy loading"],
    ["Framer Motion","11.x","Declarative animations"],
    ["Axios","1.x","HTTP client with interceptors"],
    ["Lucide React","-","Modern icon library"]],
    [38*mm, 22*mm, 110*mm])
S += sub("3.2 Backend")
S += tbl(["Technology","Version","Purpose"],[
    ["Node.js","18+","JavaScript runtime"],
    ["Express.js","4.x","REST API web framework"],
    ["Mongoose","7.x","MongoDB ODM"],
    ["Passport.js","0.7.x","Google OAuth middleware"],
    ["Stripe SDK","14.x","Payment processing"],
    ["Cloudinary","1.x","Image/video CDN"],
    ["Winston","3.x","Structured logging"],
    ["bcryptjs","-","Password hashing (12 rounds)"]],
    [38*mm, 22*mm, 110*mm])
S += sub("3.3 Security Libraries")
S += bul(["helmet - Secure HTTP headers", "express-rate-limit - DDoS protection",
    "express-mongo-sanitize - NoSQL injection prevention",
    "jsonwebtoken - JWT generation/verification", "cookie-parser - HttpOnly cookie handling"])
S += [PageBreak()]

# 4
S += heading("4", "Database Design")
S += sub("4.1 Overview")
S += body("MongoDB Atlas with 10 Mongoose collections. Optimized with compound indexes, text search, and .lean() queries.")
S += sub("4.2 User Collection")
S += tbl(["Field","Type","Details"],[
    ["name","String","Required, max 100"],
    ["email","String","Unique, lowercase, indexed"],
    ["password","String","bcrypt hashed, select:false"],
    ["role","Enum","student | instructor | admin"],
    ["isVerified/isBanned","Boolean","Account status"],
    ["xpPoints/streak","Number","Gamification"],
    ["badges","[Object]","Name, icon, awardedAt"],
    ["wishlist","[ObjectId]","Ref: Course"],
    ["oauth","[Object]","Provider + providerId"],
    ["refreshToken","String","select: false"]],
    [40*mm, 28*mm, 102*mm])
S += sub("4.3 Course Collection")
S += tbl(["Field","Type","Details"],[
    ["title/slug","String","Required, auto-slug"],
    ["price","Number","Min 0, default free"],
    ["instructor","ObjectId","Ref: User"],
    ["category/level","String","Filtering fields"],
    ["status","Enum","draft|review|published|archived"],
    ["rating/enrolledCount","Number","Aggregated"],
    ["outcomes/requirements","[String]","Learning objectives"],
    ["isFeatured","Boolean","Admin-promoted"]],
    [45*mm, 28*mm, 97*mm])
S += sub("4.4 Supporting Collections")
S += tbl(["Collection","Key Fields","Relationships"],[
    ["Lesson","title, type, content, order","Belongs to Course"],
    ["Enrollment","user, course, progress","User-Course M:N"],
    ["Order","user, course, amount, stripeId","Payment record"],
    ["Discussion","course, user, replies, votes","Q&amp;A threads"],
    ["Review","user, course, rating, comment","Unique user+course"],
    ["Coupon","code, type, discount, expiry","Applied to Orders"],
    ["Category","name, slug, courseCount","Grouping"],
    ["Contact","name, email, subject, message","Support tickets"]],
    [30*mm, 65*mm, 75*mm])
S += [PageBreak()]

# 5
S += heading("5", "API Reference")
S += body("All endpoints under /api/v1/. Auth via Bearer tokens. Rate limiting applied globally.")
S += sub("5.1 Authentication")
S += tbl(["Method","Endpoint","Description","Auth"],[
    ["POST","/auth/register","Create account","No"],
    ["POST","/auth/login","JWT token pair","No"],
    ["POST","/auth/refresh","Refresh token","Cookie"],
    ["POST","/auth/logout","Invalidate","Yes"],
    ["POST","/auth/forgot-password","Reset email","No"],
    ["PUT","/auth/reset-password/:token","Reset","No"],
    ["GET","/auth/google","OAuth initiate","No"],
    ["GET","/auth/google/callback","OAuth callback","No"]],
    [18*mm, 52*mm, 72*mm, 18*mm])
S += sub("5.2 Courses")
S += tbl(["Method","Endpoint","Description","Auth"],[
    ["GET","/courses","List + filters + pagination","No"],
    ["GET","/courses/:slug","Full detail + curriculum","No"],
    ["POST","/courses","Create course","Instructor"],
    ["PUT","/courses/:id","Update metadata","Instructor"],
    ["DELETE","/courses/:id","Archive","Admin"],
    ["POST","/courses/:id/enroll","Enroll (free)","Student"],
    ["PUT","/courses/:id/progress","Update progress","Student"]],
    [18*mm, 52*mm, 72*mm, 18*mm])
S += sub("5.3 Payments &amp; Other")
S += tbl(["Method","Endpoint","Description","Auth"],[
    ["POST","/payments/create-checkout","Stripe session","Student"],
    ["POST","/payments/verify","Verify + enroll","Student"],
    ["POST","/payments/webhook","Stripe webhook","Stripe"],
    ["GET/PUT","/users/me","Profile CRUD","Yes"],
    ["CRUD","/coupons","Coupon mgmt","Admin"],
    ["POST","/contact","Support ticket","No"]],
    [18*mm, 52*mm, 72*mm, 18*mm])
S += [PageBreak()]

# 6
S += heading("6", "Authentication &amp; Security")
S += sub("6.1 JWT Token Architecture")
S += body("<b>Access Token:</b> 15 min, Authorization header<br/><b>Refresh Token:</b> 7 days, HttpOnly secure cookie<br/><br/>On expiry, Axios interceptor auto-calls /auth/refresh for seamless UX.")
S += sub("6.2 Google OAuth 2.0")
S += body("Passport.js GoogleStrategy. Creates/links user, generates JWT pair, redirects to /oauth-success.")
S += sub("6.3 Password Security")
S += bul(["bcryptjs hashing with 12 salt rounds", "Min 6 chars at model level",
    "Password excluded from queries (select: false)", "Reset via crypto-random tokens (1hr expiry)"])
S += sub("6.4 Middleware Stack")
S += tbl(["Middleware","Purpose"],[
    ["helmet","Secure HTTP headers (CSP, HSTS)"],
    ["express-rate-limit","DDoS protection"],
    ["express-mongo-sanitize","NoSQL injection prevention"],
    ["cors","Whitelist-based origin control"],
    ["compression","Gzip compression"]],
    [50*mm, 120*mm])
S += [PageBreak()]

# 7
S += heading("7", "Frontend Architecture")
S += sub("7.1 Component Hierarchy")
S += body("App (ErrorBoundary + Suspense)<br/>&nbsp;&nbsp;MainLayout &gt; Public + Auth pages<br/>&nbsp;&nbsp;DashboardLayout &gt; Student + Instructor + Admin pages<br/>&nbsp;&nbsp;CoursePlayerPage (fullscreen immersive)")
S += sub("7.2 State Management")
S += body("Redux Toolkit: authSlice (session, tokens) + courseSlice (catalog, filters). Async via createAsyncThunk.")
S += sub("7.3 Routing")
S += bul(["React Router v6 with nested layouts", "Lazy-loaded via React.lazy() + Suspense",
    "ProtectedRoute / GuestRoute / RoleRoute guards", "Chunk preloading on hover"])
S += sub("7.4 Key Components")
S += tbl(["Component","Purpose"],[
    ["VideoPlayer","Responsive video playback"],
    ["PlayerSidebar","Curriculum nav + progress"],
    ["CourseCard","Catalog card with rating"],
    ["NotesPanel","Per-lesson notes"],
    ["QuizPlayer","Interactive quizzes"],
    ["ErrorBoundary","Crash recovery"],
    ["MockPaymentPopup","Dev payment testing"]],
    [50*mm, 120*mm])
S += [PageBreak()]

# 8
S += heading("8", "Feature Modules")
S += sub("8.1 Course Discovery")
S += bul(["Text search across title, description, tags", "Filter by category, level, price, rating",
    "Responsive grid with animated cards", "Detail page with hero, curriculum, reviews"])
S += sub("8.2 Course Player")
S += bul(["Full-screen with collapsible sidebar", "Video, article, quiz lesson types",
    "Notes panel synced per lesson", "Progress tracking + 15s timeout protection"])
S += sub("8.3 Student Dashboard")
S += bul(["Overview with enrolled count, XP, streak", "MyCourses, Schedule, Achievements, Assignments",
    "Saved courses and community forum"])
S += sub("8.4 Instructor Tools")
S += bul(["Course Studio for creation + curriculum", "Revenue analytics + Q&amp;A Dashboard"])
S += sub("8.5 Admin Panel")
S += bul(["User management with ban/role controls", "Course moderation + order tracking",
    "Coupon system (flat/percentage)"])
S += sub("8.6 Payment System")
S += bul(["Stripe Checkout + mock dev mode", "Coupon validation + auto-enrollment",
    "Webhook for async Stripe events"])
S += [PageBreak()]

# 9
S += heading("9", "CI/CD Pipeline")
S += tbl(["Stage","Tool","Description"],[
    ["Checkout","actions/checkout","Clone repo"],
    ["Setup","actions/setup-node","Node.js 18.x"],
    ["Install","npm ci","Dependencies"],
    ["Lint","ESLint","Static analysis"],
    ["Test","Jest + Vitest","Server + client"],
    ["Build","Vite","Production bundle"],
    ["Deploy","Vercel CLI","Edge deployment"]],
    [28*mm, 42*mm, 100*mm])
S += sub("9.2 Environment Variables")
S += tbl(["Variable","Required By","Description"],[
    ["MONGO_URI","Server","MongoDB Atlas connection"],
    ["JWT_ACCESS_SECRET","Server","Access token key"],
    ["JWT_REFRESH_SECRET","Server","Refresh token key"],
    ["STRIPE_SECRET_KEY","Server","Stripe API secret"],
    ["CLOUDINARY_*","Server","Cloud config"],
    ["VITE_API_URL","Client","Backend API URL"]],
    [45*mm, 30*mm, 95*mm])
S += [PageBreak()]

# 10
S += heading("10", "Future Roadmap")
S += tbl(["Phase","Feature","Description","Priority"],[
    ["1","Live Sessions","WebRTC video + chat","High"],
    ["2","AI Tutor","AI Q&amp;A + quiz gen","High"],
    ["3","Mobile App","React Native + offline","Medium"],
    ["4","Marketplace","Payouts + affiliates","Medium"],
    ["5","Analytics V2","Cohort analysis","Low"],
    ["6","Localization","i18n support","Low"]],
    [18*mm, 35*mm, 90*mm, 27*mm])
S += [Spacer(1, 10*mm)]
S += body("This document provides a comprehensive overview of the EduPulse platform architecture, design decisions, and implementation details.")
S += [Spacer(1, 15*mm)]
S += [Paragraph("<i>--- End of Document ---</i>", styles["DocEnd"])]

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm,
                        topMargin=20*mm, bottomMargin=20*mm,
                        title="EduPulse Design Document", author="Rishabh")
doc.build(S)
print("PDF saved to " + OUT)

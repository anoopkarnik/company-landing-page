# 🚀 COMPANY LANDING PAGE BOILERPLATE  

### A Modern, Minimal Landing Page for Any Company with Next.js & Strapi(Built with Turborepo)

![Alt text](https://strapi.bayesian-labs.com/uploads/company_landing_page_8e99b299b1.png)

🔹 **Minimal & Clean UI**  
🔹 **Built with ShadCN UI & Resend for Email Subscriptions**
🔹 **Easily customizable**  
🔹 **Supports Strapi CMS**  
🔹 **Deploy with Vercel in One Click**  

👉 **[Live Demo](https://bayesian-labs.com)**  

> **⭐ If you find this project useful, consider giving it a star to support development!**  

---

## 📌 Overview  

Every company, technical or otherwise, needs a **professional landing page** to build trust and authenticity with customers.  

This boilerplate provides a **minimalistic and modern** landing page built using **Turborepo**, with:  
✅ **ShadCN UI components** for atomic design  
✅ **Resend integration** for email newsletter subscriptions  
✅ **Flexible data configuration** for landing & legal pages  
✅ **Dodo Payments support** for easy donation payments  

---

## 🚀 Getting Started  

### 1️⃣ **Clone & Install**  

Clone the repo and install dependencies:  

```sh
npx company-landing-page@latest
cd company-landing-page
npm install
```

### 2️⃣ **Run Locally**  

Start the Next.js app on localhost:3000 and Strapi CMS on localhost:1337:

```sh
# Start Next.js app
npm run dev

# Start Strapi CMS (In a separate terminal)
cd apps/strapi-cms
npm run dev #Username - guest@bayesian-labs.com Password - Password1
```

---

## 🛠 Modifying the Landing Page Data

### Option 1: Edit Directly in Code

Modify the landing page content in:  

📂 `apps/nextjs-app/lib/constants/landing-page/`  

Modify legal pages by updating variables inside:  

📂 `apps/nextjs-app/lib/constants/appDetails.tsx`


### Option 2: Use Strapi CMS

1) Open Strapi at localhost:1337 (Username - guest@bayesian-labs.com Password - Password1)
2) Navigate to Content Manager (Sidebar).
3) Click on "companyLandingPage" under "SINGLE TYPES" to edit your profile details.
4) Save & Publish to see changes reflected instantly!

---

## 🛠 Configuring the Landing Page Data 

### Option 1: Data from Files

By default, the landing page displays information from files.

### Option 2: Data from Strapi CMS

If you prefer to fetch data from Strapi CMS instead of files, follow these steps:

1) Click on ⚙️ Settings icon located at the bottom left of the page. This will open a settings panel on the right side.
2) Enter the password (default: "password"). To customize this, update the SETTINGS_PASSWORD environment variable. Then, click Verify.
3) Once verified, toggle the switch to change the data source from file-based to CMS-based.
4) To revert back to file-based data, simply toggle the switch again.

---


## 📜 Managing Blogs: Add, Edit, or Delete

Easily manage blog posts in Strapi CMS by following these steps:

1) Open Strapi at localhost:1337 (Username - guest@bayesian-labs.com Password - Password1)
2) Navigate to Content Manager (Sidebar).
3) Click on "Author" under "COLLECTION TYPES" to create, delete and edit existing author details.
4) Click on "Category" under "COLLECTION TYPES" to create, delete and edit existing category details.
5) Click on "Article" under "COLLECTION TYPES" where there is a list of blogs published and in
draft.
6) Click on an article and modify title, description, slug(id), cover image, author, categories,
and blocks having Rich text(mdx) or Quote or Files, etc.
7) Save & Publish to see changes reflected instantly!

---

## 💳 Modifying Payment Link  

For donation payments, we use **Dodo Payments**: [Dodo Payments](https://dodopayments.com)  

1) Sign up and verify your account.  
2) Create a **product** with min/max payment options.  
3) Use the generated **donation link** in the app.  

Alternatively, you can replace this with any other payment provider.  

---

## 📩 Email Newsletter Setup  

1️⃣ Create a **Resend** account → [Resend Signup](https://resend.com)  
2️⃣ Generate an API key in **API Keys** (Sidebar)  
3️⃣ Add it to `.env` in **RESEND_API_KEY**  
4️⃣ Create an **Audience ID** under "Audiences"  
5️⃣ Add it to `.env` in **RESEND_AUDIENCE_ID**  

---

## 🚀 Deploy Your Landing Page  

### 1️⃣ Deploy to Vercel (1-Click)  

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanoopkarnik%2Fcompany-landing-page&build-command=cd%20apps%2Fnextjs-app%20%26%26%20npm%20run%20build&output-directory=apps%2Fnextjs-app%2F.next&install-command=npm%20install&dev-command=cd%20apps%2Fnextjs-app%20%26%26%20npm%20run%20dev)

### 2️⃣ Deploy on Your Own Server  

- Use **Vercel** or **Netlify** for hosting  
- Self-host using **AWS, DigitalOcean, Railway, or Coolify**  

---

## 🤝 Contributing  

We welcome contributions! To contribute:  

1) **Fork the repo** & create a new branch  
2) **Make changes** following the coding guidelines  
3) **Submit a Pull Request (PR)**  

📖 Check out the contribution guide:  

- [CONTRIBUTING](/docs/CONTRIBUTING.md)  
- [CODE_OF_CONDUCT](/docs/CODE_OF_CONDUCT.md)  
- [PULL_REQUEST](/docs/pull_request_template.md)  


🐞 Found a bug? Report it via [BUG_REPORT](https://github.com/anoopkarnik/company-landing-page/issues/new?template=bug_report.md) 

💡 Have an idea? Submit a [FEATURE_REQUEST](https://github.com/anoopkarnik/company-landing-page/issues/new?template=feature_request.md)  

---

## 📜 License  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


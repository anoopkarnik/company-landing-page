# 🚀 Turborepo-Based Landing Page Boilerplate

A beautifully designed and highly customizable landing page template powered by **Next.js**, **Turborepo**, and **Strapi CMS**.

## 🌟 Features

- ✨ **Minimal & Clean UI** built with ShadCN UI
- 📩 **Resend integration** for seamless email newsletter subscriptions
- 🔄 **Easy customization** via file-based constants or Strapi CMS
- 💳 **Dodo Payments** support for donations
- 🚀 **One-click Vercel deployment**

👉 [Live Demo](https://bayesian-labs.com)

## 🚀 Quick Start

### Step 1: Install & Run

Start your Next.js app and Strapi CMS locally:

```sh
npm run dev

# Start Strapi CMS separately
cd apps/strapi-cms
npm run dev # Admin: guest@bayesian-labs.com / Password1
```

### Step-by-Step Customization:

**File-Based Customization:**
- Modify landing page content in `lib/constants` directory.
- Adjust app details in:
  ```tsx
  apps/nextjs-app/lib/constants/appDetails.tsx
```

**CMS-Based Customization (Strapi):**
- Navigate to your CMS: [localhost:1337](http://localhost:1337)
- Edit under **Content Manager → Single Types → company-landing-page**

## 💡 Payment Integration

- Integrated **Dodo Payments** for donations
- Generate and replace donation links easily

## 📧 Email Newsletter

- Create a [Resend account](https://resend.com)
- Set up your API Key to enable newsletters

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanoopkarnik)

Or manually deploy on:
- AWS, DigitalOcean, Netlify, Railway, Coolify

## 🐞 Issues & Contributions

### 🔍 [Bug Report](https://github.com/anoopkarnik/your-repo/issues/new?template=BUG_REPORT.md)
Report bugs clearly via our standardized GitHub issue template.

### 🚀 [Feature Request](https://github.com/anoopkarnik/your-repo/issues/new?template=feature_request.md)

### 📖 Docs:
- [Contribution Guide](https://github.com/anoopkarnik/your-repo/blob/main/docs/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/anoopkarnik/your-repo/blob/main/docs/CODE_OF_CONDUCT.md)
- [Pull Request Template](https://github.com/anoopkarnik/your-repo/blob/main/docs/pull_request_template.md)

## 📚 Legal

- [Terms of Service](https://github.com/anoopkarnik/your-repo/blob/main/docs/termsOfService.md)
- [Privacy Policy](https://github.com/anoopkarnik/your-repo/blob/main/docs/privacyPolicy.md)
- [Cancellation & Refund Policies](https://github.com/anoopkarnik/your-repo/blob/main/docs/cancellationRefundPolicies.md)
- [Contact Us](https://github.com/anoopkarnik/your-repo/blob/main/docs/contactUs.md)

---

🚀 **[Live Demo](https://bayesian-labs.com)**

Enjoy coding! ✨

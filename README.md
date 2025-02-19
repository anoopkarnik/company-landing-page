# COMPANY LANDING PAGE BOILERPLATE

## Overview

Every company technical or otherwise needs a good landing page to look authentic and have trust of the customers. This is a clean minimalistic landing page in turborepo with resend package for subscription to your mailing list and UI package with atomic design components from shadcn. 

## Starting Locally

Clone the repo using:

```sh
npx company-landing-page@latest
```

## Modifying Landing Page, Legal Pages data

1) In apps/nextjs-app/lib/constants/landing-page, you can modify landing page data section wise in the files.
2) In apps/nextjs-app/lib/constants/appDetails.tsx, you can modify variables used in different legal pages in apps/nextjs-app/lib/constants/legal.

## Modifying Payment link

For donation payments, we use dodo payments link - https://dodopayments.com as its build for SaaS, you can login and verify your account to get live transactions and create a product with minimum and maximum payment and use the link in the donation link variable. You can also use any other payment links for donation payments.

## Email Newsletter 

1) Create a resend account.
2) Create a resend api key, in API keys tab in sidebar.
3) Copy the api key and fill it in RESEND_API_KEY environment variable in apps/nextjs-app/.env.
4) In the Audiences tab in sidebar, create a new audience and copy the AUDIENCE ID.
5) Fill it in RESEND_AUDIENCE_ID environment variable in apps/nextjs-app/.env.

## Deploy Your Own

1) You can deploy it to Vercel with one click:

    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanoopkarnik%2Fcompany-landing-page&build-command=cd%20apps%2Fnextjs-app%20%26%26%20npm%20run%20build&output-directory=apps%2Fnextjs-app%2F.next&install-command=npm%20install&dev-command=cd%20apps%2Fnextjs-app%20%26%26%20npm%20run%20dev
    )

2) Give a repository name which will clone this repo to your account.

## Contribution

See the [CONTRIBUTING](/docs/CONTRIBUTING.md) file for details on how to add to the repo, while maintaining the [CODE_OF_CONDUCT](/docs/CODE_OF_CONDUCT.md). Use this [PULL_REQUEST](/docs/pull_request_template.md) template to add in description, while issuing a pull request for us to approve.

You can also contribute by reporting a bug using this [BUG_REPORT](/docs/ISSUE_TEMPLATE/bug_report.md) template and request a feature using this [FEATURE_REQUEST](/docs/ISSUE_TEMPLATE/feature_request.md) template.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


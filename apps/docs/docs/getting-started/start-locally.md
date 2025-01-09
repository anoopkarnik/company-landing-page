---
sidebar_position: 3
---

# Start Locally

## Clone repo and Install Packages
```bash
# Clone the repo
git clone https://github.com/anoopkarnik/turborepo-saas-boilerplate-code.git
cd turborepo-saas-boilerplate-code

# Install Packages
npm install
```

## Start Postgres Locally and migrate the database

```bash
# Create a docker network
sudo docker network create turborepo-network

#Pull and create postgres docker
sudo docker-compose -f docker-compose-tools.yml up -d

# Check if the services are running
sudo docker ps

# Copy all the .env.example files
sudo sh scripts/copy-env-files.sh

# Create the postgres tables by running the below command in the root directory
npm run db:migrate
```

## Modify Details for Landing Page, Home Page and Settings

Modify details in tsx files in this path apps/nextjs-app/lib/constants.

## For Registering a New User using email authentiation

Fill the NEXT_PUBLIC_RESEND_API_KEY in the apps/nexjs-app/.env using the below doc

[Resend API Key](/docs/getting-started/get-credentials/resend)


## For Registering a New User using social Logins

**Gmail Login**: To allow gmail login, *AUTH_GOOGLE_ID*, *AUTH_GOOGLE_SECRET* and *NEXT_PUBLIC_RESEND_API_KEY* present in the apps/nextjs-app/.env file are required to be filled. You can get the above details from below docs:

[Google Login OAuth](/docs/getting-started/get-credentials/gmail-login)

**Linkedin Login**: To allow linkedin login, *AUTH_LINKEDIN_ID* and *AUTH_LINKEDIN_SECRET* present in the apps/nextjs-app/.env file are required to be filled. You can get the above details from below docs:

[Linkedin Login OAuth](/docs/getting-started/get-credentials/linkedin-login)

**Github Login**: To allow github login, *AUTH_GITHUB_ID* and *AUTH_GITHUB_SECRET* present in the apps/nextjs-app/.env file are required to be filled. You can get the above details from below doc:

[Github Login OAuth](/docs/getting-started/get-credentials/github-login)

## For making Guest and Admin Login Work

Create guest and admin users using email authentication and fill in the below environment variables present in the apps/nextjs-app/.env
*NEXT_PUBLIC_GUEST_MAIL* & *NEXT_PUBLIC_GUEST_PASSWORD* with the guest user email and password you created.
*NEXT_PUBLIC_ADMIN_MAIL* & *NEXT_PUBLIC_ADMIN_PASSWORD*  with the admin user email and password you created.

## For modifying Profile Pic in Settings

1. Using the below link get the vercel blob token.
2. Fill the *NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN* variable with the token in the apps/nextjs-app/.env 

[Vercel Blob Token](/docs/getting-started/get-credentials/vercel-blob)

## Running the apps locally in dev mode

```bash
npm run dev
```


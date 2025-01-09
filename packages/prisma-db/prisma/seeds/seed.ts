import db from '../../src/index'
import { createAdminUser, createGuestUser } from './fakeUsers'
import { createResetPasswordEmailTemplate, createVerificationEmailTemplate } from './emailTemplates'


async function main () {
    await createGuestUser()
    await createAdminUser()
    await createVerificationEmailTemplate()
    await createResetPasswordEmailTemplate()
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
import { ContactUsProps } from '@repo/ts-types/landing-page/v1'

const ContactUs = ({lastUpdated,companyName,address,email,contactNumber}:ContactUsProps) => {
  return (
    <div className='p-6 mx-[20%]'>
        <h2 className='text-title-h1'>Contact Us</h2>

        <p className="text-description mb-6">Last updated: {lastUpdated}</p>
        <p className="mb-4">Merchant Legal entiy name: {companyName}</p>
        <p className="mb-4">Registered Address: {address}</p>
        <p className="mb-4">Operational Address: {address}</p>
        <p className="mb-4">Contact Number: {contactNumber}</p>
        <p className="mb-4"> Email Id: &nbsp; 
          <a href={`https://mail.google.com/mail?view=cm&fs=1&to=${email}&su=SupportEmail`} className='text-blue-500 cursor-pointer'>
            {email}
          </a>
        </p>

    </div>
  )
}

export default ContactUs
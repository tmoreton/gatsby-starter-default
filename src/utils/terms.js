const terms = (order) => {
  switch(order.state_code) {
    case 'IL':
      return {
        terms: 'I agree I have read the Terms and Conditions and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'MA':
      return {
        terms: 'I agree I have read the Terms of Service and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: `I, ${order.first_name} ${order.last_name}, choose to switch my electricity supply service to Inspire Energy Holdings, LLC from my current supplier. I understand that only one entity can be designated as my electricity supplier, that a charge may be incurred for switching suppliers, but that Inspire does not assess a fee for enrolling for its service. \n I confirm that my billing address is ${order.street} ${order.city} ${order.state_code} ${order.zip} that an Inspire representative disclosed the material terms of my agreement with Inspire; that I had an opportunity to review my contract, referred to as the Sales Agreement; and that I understand I have the right to rescind the contract within three business days of receiving it.`
      }
      break;
    case 'MD':
      return {
        terms: 'I agree I have read the Terms and Conditions and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'NJ':
      return {
        terms: 'I agree I have read the Disclosure Statement and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'NY':
      return {
        terms: 'I agree I have read the Terms of Service and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'OH':
      return {
        terms: 'I agree I have read the Customer Contract and I have authorization to switch my supply service to Inspire. Further, I decline to receive a hard copy of the Terms of Service, and consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'PA':
      return {
        terms: 'I agree I have read the Disclosure Statement and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: 'I authorize the switch of my electricity supply to Inspire. I can confirm that an Inspire representative disclosed the material terms of my agreement with Inspire and that I had an opportunity to review my contract, referred to as the Disclosure Statement. \n I understand that I have the right to rescind the contract within three business days of receiving it.'
      }
      break;
    case 'DE':
      return {
        terms: 'I agree I have read the Disclosure Statement and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null
      }
      break;
    case 'DC':
      return {
        terms: 'I agree I have read the Disclosure Statement and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: null,
      }
      break;
    default:
      return {
        terms: 'I agree I have read the Disclosure Statement and I have authorization to switch my supply service to Inspire. I consent to the sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above Terms of Service. I understand that I have the right to withdraw this consent at any time.',
        loa: 'I authorize the switch of my electricity supply to Inspire. I can confirm that an Inspire representative disclosed the material terms of my agreement with Inspire and that I had an opportunity to review my contract, referred to as the Disclosure Statement. \n I understand that I have the right to rescind the contract within three business days of receiving it.'
      }
  }
}

module.exports = terms

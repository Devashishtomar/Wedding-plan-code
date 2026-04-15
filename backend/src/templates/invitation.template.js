export const invitationTemplate = ({ name, message, rsvpLink }) => `
  <p>Dear ${name},</p>

  <p>${message}</p>

  <p>Please confirm your attendance by clicking the link below:</p>

  <p><a href="${rsvpLink}">RSVP Now</a></p>

  <p>We look forward to celebrating with you!</p>
`;

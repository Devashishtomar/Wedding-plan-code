export const invitationTemplate = ({ name, message, rsvpLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wedding Invitation</title>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f7f5f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f5f2; padding: 50px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(27, 54, 93, 0.05); border: 1px solid #e2e8f0;">
          
          <tr>
            <td style="background-color: #1b365d; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          
<tr>
            <td style="padding: 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2d6c5; border-radius: 10px; padding: 30px 25px;">               
                <tr>
                  <td align="center" style="padding-bottom: 5px;">
                    <span style="display: inline-block; color: #b5893d; font-size: 32px; line-height: 1;">✧  ♥  ✧</span>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="font-size: 12px; font-weight: 700; color: #b5893d; text-transform: uppercase; letter-spacing: 4px; line-height: 1.5; padding-bottom: 25px;">
                    We can't wait to celebrate with you
                  </td>
                </tr>

                <tr>
                  <td style="text-align: center; font-family: Georgia, serif;">
                    <p style="font-size: 20px; font-style: italic; color: #1b365d; margin-top: 0; margin-bottom: 20px; font-weight: 500;">
                      Dearest ${name},
                    </p>
                    <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #4a5568; line-height: 1.8; margin-top: 0; margin-bottom: 25px; white-space: pre-line;">
                      ${message}
                    </p>
                    <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 500; color: #1b365d; line-height: 1.6; margin-top: 0; margin-bottom: 30px;">
                      We are so excited to celebrate this beautiful new chapter of our lives, and having you with us to share these moments would mean the world to us!
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom: 25px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="background-color: #1b365d; border-radius: 50px;">
                          <a href="${rsvpLink}" target="_blank" style="display: inline-block; padding: 15px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; line-height: 1;">
                            RSVP with Love
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top: 5px; padding-bottom: 10px; font-family: Georgia, serif;">
                    <p style="font-size: 16px; font-style: italic; color: #b5893d; margin: 0;">
                      See you at the celebrations!
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 40px; background-color: #fafbfc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #a0aec0; text-transform: uppercase; letter-spacing: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                Sent with joy via AI Wedding Planner Suite
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
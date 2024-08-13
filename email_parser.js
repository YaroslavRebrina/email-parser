const fs = require('fs');

const isRelatedEmail = (userEmail, sampleEmail) => {
  const normalizeEmail = (email) => email.replace(/[^a-zA-Z0-9]/g, '');
  const normalizedUserEmail = normalizeEmail(userEmail);
  const normalizedSampleEmail = normalizeEmail(sampleEmail);

  return (
    normalizedSampleEmail.includes(normalizedUserEmail.substring(0, 5)) ||
    normalizedUserEmail.includes(normalizedSampleEmail.substring(0, 5))
  );
};

const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
const sampleData = JSON.parse(fs.readFileSync('sample_data.json', 'utf8'));

const result = {
  recognized: [],
  not_recognized: [],
};

sampleData.forEach((data) => {
  const email = data.email || data.account_email;

  if (email) {
    let recognized = false;

    users.forEach((user) => {
      if (isRelatedEmail(user.email, email)) {
        let userEntry = result.recognized.find(
          (item) => item.user_email === user.email
        );

        if (userEntry) {
          userEntry.related_emails.push(email);
        } else {
          result.recognized.push({
            user_email: user.email,
            related_emails: [email],
          });
        }
        recognized = true;
      }
    });

    if (!recognized) {
      result.not_recognized.push(email);
    }
  }
});


fs.writeFileSync('output.json', JSON.stringify(result, null, 4), 'utf8');
console.log('Email processing completed. Check output.json for results.');

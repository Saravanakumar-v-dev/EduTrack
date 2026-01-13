import nodemailer from 'nodemailer';

async function generateEtherealAccount() {
    try {
        console.log('🔄 Generating Ethereal email test account...\n');

        // Create a test account
        const testAccount = await nodemailer.createTestAccount();

        console.log('✅ Ethereal Email Account Created!\n');
        console.log('='.repeat(60));
        console.log('📧 EMAIL CREDENTIALS FOR .env FILE');
        console.log('='.repeat(60));
        console.log('EMAIL_HOST=smtp.ethereal.email');
        console.log('EMAIL_PORT=587');
        console.log(`EMAIL_USER=${testAccount.user}`);
        console.log(`EMAIL_PASS=${testAccount.pass}`);
        console.log('='.repeat(60));
        console.log('\n📝 Copy the above credentials to your server/.env file\n');

        console.log('🌐 Web Interface:');
        console.log(`   URL: https://ethereal.email`);
        console.log(`   Username: ${testAccount.user}`);
        console.log(`   Password: ${testAccount.pass}`);
        console.log('\n💡 You can view all sent emails at https://ethereal.email/messages\n');

        // Test the connection
        const transporter = nodemailer.createTransporter({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        await transporter.verify();
        console.log('✅ SMTP Connection Verified!\n');

        console.log('🚀 Next Steps:');
        console.log('   1. Copy the credentials above to server/.env');
        console.log('   2. Restart your server (npm start)');
        console.log('   3. Register a new user');
        console.log('   4. Check https://ethereal.email/messages for the OTP email\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error generating Ethereal account:', error.message);
        process.exit(1);
    }
}

// Run the function
generateEtherealAccount();

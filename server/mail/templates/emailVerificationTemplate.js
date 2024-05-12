const otpTemplate = (otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP verification Email</title>
    <style>
        body{
            background-color: #ffffff;
            font-family: Arial,sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: #333333;
            margin: 0;
            padding: 0;

        }
        .container{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;

        }
        .logo{
            max-width: 200px;
            margin-bottom: 20px;

        }
        .message{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;

        }
        .support{
            font-size: 14px;
            color: #999999;
            margin-top:20px ;
        }
        .highlight{
            font-weight: bold;

        }
    
        
    </style>

</head>
<body>
    <div class = "container">
        <a href = "https://studynotion-edtech-project.vercel.app"><img class= "logo"
        src="" alt = "StudyNotion Login"></a>
        <div  class="message">OTP verification Email</div>
        <div class="body">
            <p>Dear User,</p>
            <p> Thank you for registering with studyNotion. to complete your registration , please use th following (One-Timw-Password) to verify your account:</p>
            <h2 class=" highlight">${otp}</h2>
            <p>This OTP is valid for 5 minute. If you did not request this verification , please disregard the Once your account is verified , you 
                will have access to our platform and its features.
            </p>
        </div>
        <div class=" support "> If you have any questions or need assistance , please feel free to reach out to 
            <a href="mailto:info@studynotion.com">info@studynotion.com</a>We are here to help!</div>
        </div>
    </div>
</body>
</html>
    `
};
module.exports = otpTemplate;
package services

import (
	"fmt"
	"log" 
	"math/rand"
	"time"
	"../config"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

const charset = "abcdefghijklmnopqrstuvwxyz" + 
"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" 

var seededRand * rand.Rand = rand.New(
rand.NewSource(time.Now().UnixNano()))

func StringWithCharset(length int, charset string)string {
		b := make([]byte, length)
		for i := range b {
				b[i] = charset[seededRand.Intn(len(charset))]
			}
		return string(b)
}

func String(length int)string {
	return StringWithCharset(length, charset)
}


func SendNewPasswordConfirmEmail(name string, email string, txhash string) {
	
	from := mail.NewEmail("Human", "human@autonomous.ai")
	subject := "You've gotten a new password"
	to := mail.NewEmail(name, email)
	htmlContent := "Dear customer,<br/>Thanks for your inquiry of new password. Here is your new password:<br/><b>" + txhash + "</b><br/>Please login to Autonomous Bike with your email and new password. You can change your password in Your Profile on Autonomous Bike app.<br/><br/>Thanks and regards,<br/>Autonomous Team"

	content := mail.NewContent("text/html", htmlContent)

	m := mail.NewV3MailInit(from, subject, to, content)

	request := sendgrid.GetRequest(config.SENDGRID_API_KEY, "/v3/mail/send", "https://api.sendgrid.com")
	request.Method = "POST"
	request.Body = mail.GetRequestBody(m)
	response, err := sendgrid.API(request)
	if err != nil {
	  log.Println(err)
	}else {
	  fmt.Println(response.StatusCode)
	  fmt.Println(response.Body)
	  fmt.Println(response.Headers)
	}

}


func SendRequestConfirmEmail(name string, email string, txhash string) {
	
	from := mail.NewEmail("Human", "human@autonomous.ai")
	subject := "Reset your password"
	to := mail.NewEmail(name, email)
	//plainTextContent := ""
	link := "https://bike.autonomous.ai/confirm-forgot-pass/?email=" + email + "&txhash=" + txhash
	htmlContent := "Dear customer,<br/>You've received this email because someone entered your email to Autonomous Bike's forgot password feature. <br/>Please click the link below to receive an email contained your new password:<br/>" + link + "<br/>If you dont request to change your password, feel free to skip this email.<br/><br/>Thankyou,<br/>Autonomous Team"

	content := mail.NewContent("text/html", htmlContent)

	m := mail.NewV3MailInit(from, subject, to, content)
	
	request := sendgrid.GetRequest(config.SENDGRID_API_KEY, "/v3/mail/send", "https://api.sendgrid.com")
	request.Method = "POST"
	request.Body = mail.GetRequestBody(m)
	response, err := sendgrid.API(request)
	if err != nil {
	  log.Println(err)
	}else {
	  fmt.Println(response.StatusCode)
	  fmt.Println(response.Body)
	  fmt.Println(response.Headers)
	}
}



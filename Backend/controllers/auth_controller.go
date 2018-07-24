package controllers
 
import (
	"time"
	"fmt"
	//"strings"
	//"strconv"
	"../models"
	"../config"
	"net/http"
	"github.com/labstack/echo" 
	jwt "github.com/dgrijalva/jwt-go"
	opentok "github.com/eauge/opentok-go-sdk"
	//"crypto/md5"
	// "crypto/sha256"
	// "encoding/hex"
	// "crypto/hmac"
	//"encoding/json"
)


func (basectl *BaseController) GetInfo(c echo.Context) error {

	user := c.Get("user").(*jwt.Token)
	fmt.Println("data: ", user) 
	claims := user.Claims.(jwt.MapClaims) 
	usermodel := new(models.User)  
	usermodel.ID =   int(claims["id"].(float64))
	usermodel.FetchById() 
	if usermodel.ID > 0 { 
		//Init Balanceing ...
		// basectl.Dao.Model(&usermodel).Related(&usermodel.Balances)   
		// var f interface{} 
		return c.JSON(http.StatusOK,"ok") 

	}

	return echo.ErrUnauthorized 
}
 
func (basectl *BaseController)Signup(c echo.Context) error{

	user := new(models.User)
	if c.FormValue("fullname") =="" || c.FormValue("email") == "" || c.FormValue("password") =="" {
		var f interface{}
		f = map[string]interface{}{
			"fullname":  c.FormValue("fullname"),
			"email":  c.FormValue("email"),
			"password":  c.FormValue("password"), 
			"message": "Please enter valid infomation.",
		}
		return c.JSON(http.StatusInternalServerError,f) 
	} 
	user.Fullname = c.FormValue("fullname")
	user.Email = c.FormValue("email")
	user.Password, _ = models.HashPassword(c.FormValue("password"))  
	user.Create(basectl.Dao) 
	if user.ID > 0 { 
		//Init Balanceing ...
		//basectl.Dao.Model(&user).Related(&user.Balances)

		token := jwt.New(jwt.SigningMethodHS256) 
		// Set claims
		claims := token.Claims.(jwt.MapClaims)
		claims["id"] = user.ID
		claims["email"] = user.Email 
		claims["exp"] = time.Now().Add(time.Hour *  time.Duration(config.TOKEN_EXP_TIME)).Unix() 
		// Generate encoded token and send it as response.
		t, err := token.SignedString([]byte(config.SECRET_KEY))
		if err != nil {
			return err
		}  
		user.Password =""

		var f interface{}
		f = map[string]interface{}{
			"token": t,
			"user": user,
		}
		return c.JSON(http.StatusOK, f) 

	}

	var f interface{}
	f = map[string]interface{}{
		"fullname":  c.FormValue("fullname"),
		"email":  c.FormValue("email"),
		"password":  c.FormValue("password"), 
		"message": "email already exists.",
	}
	return c.JSON(http.StatusInternalServerError,f) 
	
	//return echo.ErrUnauthorized 

}

func (basectl *BaseController)Auth(c echo.Context) error{

	//secretKey := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" 
	user := new(models.User)  
	user.Email = c.FormValue("email")
	//user.Password, _ = models.HashPassword(c.FormValue("password"))  
	user.FetchByUsername(basectl.Dao)
	if models.CheckPasswordHash( c.FormValue("password"), user.Password ) == false {
		return echo.ErrUnauthorized 
	}  
	//===============
	if user.ID > 0 { 
		   
		token := jwt.New(jwt.SigningMethodHS256) 
		// Set claims
		claims := token.Claims.(jwt.MapClaims)
		claims["id"] = user.ID
		claims["email"] = user.Email 
		claims["exp"] = time.Now().Add(time.Hour * time.Duration(config.TOKEN_EXP_TIME) ).Unix()  
		t, err := token.SignedString([]byte(config.SECRET_KEY))
		if err != nil {
			return err
		}  
		var f interface{}
		f = map[string]interface{}{
			"token": t,
			"email":  user.Email,
		}
		return c.JSON(http.StatusOK,f) 
	}

	return echo.ErrUnauthorized

}

//generation opentokcode. 
func (basectl *BaseController)CreateSession(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)  
	userid :=   int(claims["id"].(float64)) 
 

	ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET)

	s, err := ot.Session(nil)
	fmt.Println(s)
	if err != nil {
			panic(err)
	}

	t, err := ot.Token(s.ID, nil)
	if err != nil {
			panic(err)
	}   

 
	var f interface{}
	f = map[string]interface{}{
		"session":s.ID ,
		"token":t,
	}  

	fmt.Println("token: ", t) 
	room := new(models.Room) 
	room.Session = s.ID 
	room.Token = string(*t)
	room.Status = 0
	room.UserId = userid

	room.Create(basectl.Dao) 

	return c.JSON(http.StatusOK,f) 
 
}

//generation opentokcode. 
func (basectl *BaseController)CreateToken(c echo.Context) error{

	ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET) 
	t, err := ot.Token(c.FormValue("session"), nil)
	if err != nil {
			panic(err)
	} 

	var f interface{}
	f = map[string]interface{}{ 
		"token":  t,
	}
	return c.JSON(http.StatusOK,f) 
 
}


//generation opentokcode. 
func (basectl *BaseController)ListRoom(c echo.Context) error{

	var listroom []models.Room
	//Offset(3)
	basectl.Dao.Where(&models.Room{Status:0}).Find(&listroom) //Limit(50).Find(&dices)
	//db.Limit(3).Find(&users)
	//loguser := models.Loggame{UserId: c.user.ID , ActionType:"DICE" , CoinType: dat.Symbol, OldCoin: myCoinAmount.Balance, NewCoin:myCoinAmount.Balance}
	var f interface{}
	f = map[string]interface{}{ 
		"list": listroom,
	}  
	 
	return c.JSON(http.StatusOK,f) 
 
}


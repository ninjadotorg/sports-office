package config

import (
	"os"  
//	"time"
	"strconv"
	"fmt"
	"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/mysql"
//	"github.com/labstack/echo"
	//"github.com/dgrijalva/jwt-go"
)

var SECRET_BOT="" 
var SECRET_KEY = ""
var SECRET_KEY_INTERNAL = ""
var COIN_SERVICE_IP=""

var PAYOUT_GLOBAL = 0.95
var GAME_THRESHOLD = 5000.0 
var TOKEN_VIEW= ""
var GUEST_USER = ""
var TOKEN_EXP_TIME = 720
var MIN_WITHDRAW_BTC = 0.0001
var MIN_WITHDRAW_ETH = 0.005

var MAX_PLAYER_IN_ROOM_STR="10"
var MAX_PLAYER_IN_ROOM_INT=10
var OPENTOK_SCRET = os.Getenv("OPENTOK_SCRET")  
var OPENTOK_API_KEY,_ = strconv.Atoi( os.Getenv("OPENTOK_API_KEY")  )
var SENDGRID_API_KEY = os.Getenv("SENDGRID_API_KEY")  
var gormConn *gorm.DB

func GetDatabaseConnection() *gorm.DB {
 
	DB_DIALECT :=  os.Getenv("DBCONNECT") //export DBCONNECT="root:root@/sportbike?charset=utf8&parseTime=True&loc=Local"
	// os.Getenv("FOO")  
	//	db, err := gorm.Open("mysql", "user:password@/dbname?charset=utf8&parseTime=True&loc=Local")

	//DB_DIALECT :="host=127.0.0.1 port=5432 user=postgres dbname=dice password=gopklGgf90889GDvvdflk  sslmode=disable"
	// Check if a connection allready exists
	if gormConn != nil && gormConn.DB() != nil && gormConn.DB().Ping() == nil {
		return gormConn
	} 
	// Try to connect to the database
	conn, err := gorm.Open("mysql" , DB_DIALECT)
	if err != nil {
		//panic("failed to connect database")
		fmt.Println("Errr connect %s ", err)
	}
	
	//defer conn.Close() 
	// Store the connection in package variable for furher request
	gormConn = conn

	return gormConn
}


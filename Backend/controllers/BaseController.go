package controllers
 
import (
	// "time"
	// "fmt"
	//"Workshop/goGameCore/models"
	//"net/http"
	"github.com/jinzhu/gorm"
	//"github.com/labstack/echo"
	//"github.com/dgrijalva/jwt-go"
	//"encoding/json"
)

type BaseController struct {
	Dao		*gorm.DB  `json:"db" gorm:"db"`
}

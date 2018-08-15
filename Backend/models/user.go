package models

import (
	"time" 
	// "net/url"
	"errors"
	// "sort"
	// "io"
	//"fmt"
	"golang.org/x/crypto/bcrypt"
	"../config"
	"github.com/jinzhu/gorm" 
	// "crypto/sha256"
	// "encoding/hex"
	// "crypto/hmac"
	//"github.com/labstack/echo"
	"github.com/dgrijalva/jwt-go"
)
 
// User ...
type User struct { 
	ID         int        `json:"id" gorm:"primary_key"`
	CreatedAt *time.Time `json:"createdAt, omitempty"`
	UpdatedAt *time.Time `json:"updatedAt, omitempty"`
	DeletedAt *time.Time `json:"deletedAt, omitempty" sql:"index"`  
	Fullname string `json:"fullname, omitempty" gorm:"not null; type:varchar(100)"` 
	Email     string `json:"email, omitempty" gorm:"type:varchar(100);unique;unique_index"`
	Password string `json:"password, omitempty" gorm:"not null; type:varchar(100)"`  
	PhotoUrl  string `json:"photoUrl, omitempty" gorm:"type:varchar(100)"`

}

// TableName set User's table name to be `profiles`
func (User) TableName() string {
	return "users"
}


// IsValid can do some very very simple "low-level" data validations.
func (u User) IsValid() bool {
	return u.ID > 0
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
} 
 
//Detect UserID from token 

//DefineTokenGeneration
func CreateTokenInternalService(userid string) string {

	token := jwt.New(jwt.SigningMethodHS256) 
	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = userid
	claims["exp"] = time.Now().Add(time.Hour *  time.Duration(config.TOKEN_EXP_TIME)).Unix()  
	t, _ := token.SignedString([]byte(config.SECRET_KEY_INTERNAL))  

	return t 
}

  

// FetchAll ...
func (u *User) FetchAll() []User {
	db := config.GetDatabaseConnection()

	var users []User
	db.Find(&users)
	//db.Limit(3).Find(&users)
	return users
}

// FetchById ...
func (u *User) FetchById(db *gorm.DB) error {
 
	if err := db.Where("id = ?", u.ID).Find(&u).Error; err != nil {
		return errors.New("Could not find the user")
	}

	//db.Model(&u).Related(&u.Balances)


	return nil
}

// FetchLogin ...
func (u *User) FetchLoginByUserNamePassword(db *gorm.DB) error {
	//db := config.GetDatabaseConnection()
  
	if err := db.Where(&User{Email:u.Email, Password: u.Password}).First(&u).Error; err != nil {
		return errors.New("Could not find the user")
	}

	//db.Model(&u).Related(&u.Balances)

	return nil
}
// FetchLogin ...
func (u *User) FetchByUsername(db *gorm.DB) error {
	//db := config.GetDatabaseConnection() 
	if err := db.Where(&User{Email:u.Email}).First(&u).Error; err != nil {
		return errors.New("Could not find the user")
	}

	//db.Model(&u).Related(&u.Balances)

	return nil
} 
// Create ...
func (u *User) Create(db *gorm.DB) error {
	//db := config.GetDatabaseConnection()
	// Validate record
	if !db.NewRecord(u) { // => returns `true` as primary key is blank
		return errors.New("New records can not have primary key id")
	}

	if err := db.Create(&u).Error; err != nil {
		return errors.New("Could not create user")
	}
	
	//InitBalance...
	// db.Create(&Balance{UserId: u.ID, Name:"ETH", Balance:0})
	// db.Create(&Balance{UserId: u.ID, Name:"BTC", Balance:0})
	// db.Create(&Balance{UserId:  u.ID, Name:"LTC", Balance:0}) 

	return nil
}

// Save ...
func (u *User) Save() error {
	db := config.GetDatabaseConnection()

	if db.NewRecord(u) {
		if err := db.Create(&u).Error; err != nil {
			return errors.New("Could not create user")
		}
	} else {
		if err := db.Save(&u).Error; err != nil {
			return errors.New("Could not update user")
		}
	}

	return nil
}

// Delete ...
func (u *User) Delete() error {
	db := config.GetDatabaseConnection()

	if err := db.Delete(&u).Error; err != nil {
		return errors.New("Could not find the user")
	}

	return nil
}

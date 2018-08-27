package models

import (
	"time" 
	// "net/url"
	"errors"
	// "sort"
	// "io"
	//"fmt" 
	"../config"
	"github.com/jinzhu/gorm"  
)
 
// Room ...
type Room struct { 
	ID         int        `json:"id" gorm:"primary_key"`
	UserId    int    `json:"userId"`
	CreatedAt *time.Time `json:"createdAt, omitempty"`
	UpdatedAt *time.Time `json:"updatedAt, omitempty"`
	DeletedAt *time.Time `json:"deletedAt, omitempty" sql:"index"`  
	Name string `json:"name, omitempty" gorm:"not null; type:varchar(100)"` 
	Photo string `json:"photo, omitempty" gorm:"not null; type:varchar(500)"` 
	Session     string `json:"session, omitempty" gorm:"type:varchar(100);unique;unique_index"`
	Token string `json:"token, omitempty" gorm:"not null; type:varchar(500)"`  
	Status     int        `json:"status, omitempty" gorm:"not null"`  
	MapId	   int        `json:"mapId, omitempty" gorm:"not null"`  
	Loop	   int        `json:"loop, omitempty" gorm:"not null"`  
	Miles	   float64        `json:"miles, omitempty" gorm:"not null"`  

}

// TableName set Room's table name to be `profiles`
func (Room) TableName() string {
	return "rooms"
}

    

// FetchAll ...
func (u *Room) FetchAll() []Room {
	db := config.GetDatabaseConnection()

	var rooms []Room
	db.Find(&rooms)
	//db.Limit(3).Find(&users)
	return rooms
}

// FetchById ...
func (u *Room) FetchById(db *gorm.DB) error {
 
	if err := db.Where("id = ?", u.ID).Find(&u).Error; err != nil {
		return errors.New("Could not find the Room")
	} 
	return nil
}
// FetchById ...
func (u *Room) FetchBySession(db *gorm.DB) error {
	  
	if err := db.Where("session = ?", u.Session).Find(&u).Error; err != nil {
		return errors.New("Could not find the Room")
	} 
	return nil
}
// Create ...
func (u *Room) Create(db *gorm.DB) error {
	//db := config.GetDatabaseConnection()
	// Validate record
	if !db.NewRecord(u) { // => returns `true` as primary key is blank
		return errors.New("New records can not have primary key id")
	}

	if err := db.Create(&u).Error; err != nil {
		return errors.New("Could not create Room")
	}
	
	//InitBalance...
	// db.Create(&Balance{UserId: u.ID, Name:"ETH", Balance:0})
	// db.Create(&Balance{UserId: u.ID, Name:"BTC", Balance:0})
	// db.Create(&Balance{UserId:  u.ID, Name:"LTC", Balance:0}) 

	return nil
}

// Save ...
func (u *Room) Save(db *gorm.DB) error {
 
	if db.NewRecord(u) {
		if err := db.Create(&u).Error; err != nil {
			return errors.New("Could not create Room")
		}
	} else {
		if err := db.Save(&u).Error; err != nil {
			return errors.New("Could not update Room")
		}
	}

	return nil
}

// Delete ...
func (u *Room) Delete() error {
	db := config.GetDatabaseConnection()

	if err := db.Delete(&u).Error; err != nil {
		return errors.New("Could not find the Room")
	}

	return nil
}

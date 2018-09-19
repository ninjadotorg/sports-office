package models

import (
	"time"  
	"errors" 
	// "../config"
	"github.com/jinzhu/gorm"  
)
 
// Room ...
//member/list/
//member/invite/user_id
// Friend(myId, friendId, inviteCode, status)
// send Invite Notification => and waiting ....
// user=>post accept Invite friend 
type Friend struct { 
	ID        int       `json:"id" gorm:"primary_key"` 
	UserId    int          `json:"userId, omitempty" gorm:"not null"` 
	FriendId  int        `json:"friendId, omitempty" gorm:"not null"`  
	InviteCode	  int  		`json:"inviteCode, omitempty" gorm:"not null"`  
	
	//Inivte status : 0 inviting , 1 accepted 
	Status	  int  		`json:"status, omitempty" gorm:"not null"`  

	CreatedAt *time.Time `json:"createdAt, omitempty"`
	UpdatedAt *time.Time `json:"updatedAt, omitempty"`
	DeletedAt *time.Time `json:"deletedAt, omitempty" sql:"index"`  

}

type IsFriend struct {
	UserId int          `json:"userId"` 
	FriendId  int        `json:"friendId"`  
}


// TableName set Room's table name to be `profiles`
func (Friend) TableName() string {
	return "friends"
}

// Create ...
func (u *Friend) Create(db *gorm.DB) error {
	//db := config.GetDatabaseConnection()
	// Validate record
	if !db.NewRecord(u) { // => returns `true` as primary key is blank
		return errors.New("New records can not have primary key id")
	} 
	if err := db.Create(&u).Error; err != nil {
		return errors.New("Could not create user")
	}  
	return nil
}

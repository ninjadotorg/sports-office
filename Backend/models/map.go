package models

import (
	"time"  
	// "errors" 
	// "../config"
	//"github.com/jinzhu/gorm"  
)
 
// Room ...
type Map struct { 
	ID         int        `json:"id" gorm:"primary_key"` 
	CreatedAt *time.Time `json:"createdAt, omitempty"`
	UpdatedAt *time.Time `json:"updatedAt, omitempty"`
	DeletedAt *time.Time `json:"deletedAt, omitempty" sql:"index"`  
	Name string `json:"name, omitempty" gorm:"not null; type:varchar(100)"`  
	Photo string `json:"photo, omitempty" gorm:"not null; type:varchar(200)"`  
	MapGrap string `json:"cover, omitempty" gorm:"not null; type:varchar(200)"`  
	DataPoints string `json:"datapoints, omitempty" sql:"type:text"`  
	Width float64        `json:"width, omitempty" gorm:"not null"`  
	Height float64        `json:"height, omitempty" gorm:"not null"`  
	Miles	   float64        `json:"miles, omitempty" gorm:"not null"`  
	Status     int        `json:"status, omitempty" gorm:"not null"`  

}

// TableName set Room's table name to be `profiles` ``
func (Map) TableName() string {
	return "maps"
}
 
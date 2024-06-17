package entity

import (
	"time"

	"github.com/yaza-putu/golang-starter-api/internal/app/auth/entity"
)

type Room struct {
	ID        string       `gorm:"primaryKey;type:char(36)" json:"id"`
	Name      string       `json:"name" gorm:"name"`
	Users     entity.Users `gorm:"many2many:room_users"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

package entity

import (
	"time"

	"github.com/yaza-putu/golang-starter-api/internal/app/auth/entity"
)

type RoomUser struct {
	RoomId    string
	Room      Room `json:"room" gorm:"foreignKey:RoomId"`
	UserId    string
	User      entity.User `json:"user" gorm:"foreignKey:UserId"`
	CreatedAt time.Time   `json:"created_at"`
}

package entity

import (
	"time"

	"github.com/yaza-putu/golang-starter-api/internal/app/auth/entity"
)

type Chat struct {
	ID        string `gorm:"primaryKey;type:char(36)" json:"id"`
	RoomId    string
	SenderId  string
	Sender    entity.User `gorm:"foreignKey:SenderId" json:"sender"`
	Room      Room        `gorm:"foreignKey:RoomId" json:"room"`
	Message   string      `gorm:"type:longtext" json:"message"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}

type Chats []Chat

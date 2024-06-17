package repository

import (
	"context"

	"github.com/yaza-putu/golang-starter-api/internal/app/chat/entity"
	"github.com/yaza-putu/golang-starter-api/internal/database"
)

type chatRepository struct{}

func NewChatRepository() *chatRepository {
	return &chatRepository{}
}

func (c *chatRepository) Create(ctx context.Context, chat entity.Chat) (entity.Chat, error) {
	r := database.Instance.WithContext(ctx).Create(&chat)
	return chat, r.Error
}

func (c *chatRepository) All(ctx context.Context, roomId string) (entity.Chats, error) {
	chats := entity.Chats{}
	r := database.Instance.WithContext(ctx).Preload("Sender").Preload("Room").Where("room_id = ?", roomId).Order("updated_at asc").Find(&chats)
	return chats, r.Error
}

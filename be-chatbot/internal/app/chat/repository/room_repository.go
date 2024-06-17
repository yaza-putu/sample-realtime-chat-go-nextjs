package repository

import (
	"context"

	"github.com/yaza-putu/golang-starter-api/internal/app/chat/entity"
	"github.com/yaza-putu/golang-starter-api/internal/database"
)

type roomRepository struct{}

func NewRoomRepository() *roomRepository {
	return &roomRepository{}
}

func (r *roomRepository) Create(ctx context.Context, room entity.Room) (entity.Room, error) {
	rs := database.Instance.WithContext(ctx).Create(&room)

	return room, rs.Error
}

func (r *roomRepository) Validate(ctx context.Context, userId string) (int64, error) {
	var c int64
	e := entity.Room{}
	rs := database.Instance.WithContext(ctx).Model(&e).Preload("Users", "user_id IN ?", userId).Count(&c)

	return c, rs.Error
}

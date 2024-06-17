package routes

import (
	"github.com/labstack/echo/v4"
	chat "github.com/yaza-putu/golang-starter-api/internal/app/chat/handler"
)

var chatHandler = chat.NewChatHandler()

func Api(r *echo.Echo) {
	wss := r.Group("wss")
	{
		wss.GET("/:room_id", chatHandler.Connect)
	}
}

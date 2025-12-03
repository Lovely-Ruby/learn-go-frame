package todo

import (
	"context"

	v1 "back-end/api/todo/v1"
	"back-end/internal/dao"
	"back-end/internal/model/do"
)

func (c *ControllerV1) Create(ctx context.Context, req *v1.CreateReq) (res *v1.CreateRes, err error) {
	insertId, err := dao.Todo.Ctx(ctx).Data(do.Todo{
		Title: req.Title,
	}).InsertAndGetId()
	if err != nil {
		return nil, err
	}
	res = &v1.CreateRes{
		Id: insertId,
	}
	return
}

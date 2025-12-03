package todo

import (
	"context"

	v1 "back-end/api/todo/v1"
	"back-end/internal/dao"
	"back-end/internal/model/do"
)

func (c *ControllerV1) Update(ctx context.Context, req *v1.UpdateReq) (res *v1.UpdateRes, err error) {
	_, err = dao.Todo.Ctx(ctx).Data(do.Todo{
		Title: req.Title,
		Done:  req.Done,
	}).WherePri(req.Id).Update()
	return
}

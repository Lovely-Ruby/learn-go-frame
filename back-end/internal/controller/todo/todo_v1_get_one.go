package todo

import (
	"context"

	v1 "back-end/api/todo/v1"
	"back-end/internal/dao"
)

func (c *ControllerV1) GetOne(ctx context.Context, req *v1.GetOneReq) (res *v1.GetOneRes, err error) {
	res = &v1.GetOneRes{}
	err = dao.Todo.Ctx(ctx).WherePri(req.Id).Scan(&res.Todo)
	return
}

package todo

import (
	"context"

	v1 "back-end/api/todo/v1"
	"back-end/internal/dao"
	"back-end/internal/model/do"
)

func (c *ControllerV1) GetList(ctx context.Context, req *v1.GetListReq) (res *v1.GetListRes, err error) {
	res = &v1.GetListRes{}
	err = dao.Todo.Ctx(ctx).Where(do.Todo{
		Title: req.Title,
		Done:  req.Done,
	}).Scan(&res.List)
	return
}
